#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use extism::*;
use once_cell::sync::Lazy;
use std::collections::HashMap;
use std::sync::Mutex;
use thiserror::Error;

#[derive(Error, Debug)]
#[allow(dead_code)]
pub enum PluginError {
  #[error("Plugin not initialized: {0}")]
  NotInitialized(String),
  #[error("Failed to create plugin: {0}")]
  Creation(String),
  #[error("Failed to call plugin function: {0}")]
  FunctionCall(String),
  #[error("Plugin lock error")]
  LockError,
}

type PluginResult<T> = std::result::Result<T, PluginError>;

static PLUGIN_REGISTRY: Lazy<Mutex<HashMap<String, Plugin>>> =
  Lazy::new(|| Mutex::new(HashMap::new()));

fn get_registry() -> PluginResult<std::sync::MutexGuard<'static, HashMap<String, Plugin>>> {
  PLUGIN_REGISTRY.lock().map_err(|_| PluginError::LockError)
}

pub fn plugin_init(plugin_id: String, plugin_url: String) -> Result<(), String> {
  let url = if plugin_url.is_empty() {
    format!(
      "https://github.com/extism/plugins/releases/latest/download/{}.wasm",
      plugin_id
    )
  } else {
    plugin_url
  };
  let wasm_url = Wasm::url(&url);
  let manifest = Manifest::new([wasm_url]);
  let plugin = Plugin::new(&manifest, [], true)
    .map_err(|e| format!("Failed to create plugin {}: {}", plugin_id, e))?;
  let mut registry = get_registry().map_err(|e| e.to_string())?;
  registry.insert(plugin_id, plugin);
  Ok(())
}

#[tauri::command]
pub fn call_plugin(
  plugin_id: String,
  method: String,
  args: serde_json::Value,
) -> Result<serde_json::Value, String> {
  let input = args.to_string();
  let mut registry = get_registry().map_err(|e| e.to_string())?;
  let plugin = registry
    .get_mut(&plugin_id)
    .ok_or_else(|| format!("Plugin '{}' not initialized", plugin_id))?;
  let result = plugin
    .call(&method, input.as_bytes().to_vec())
    .map(|output: Vec<u8>| {
      let output_str = String::from_utf8_lossy(&output).to_string();
      serde_json::from_str(&output_str).unwrap_or_else(|_| serde_json::Value::String(output_str))
    })
    .map_err(|e| format!("Failed to call method '{}': {}", method, e))?;
  Ok(result)
}

#[tauri::command]
pub fn unload_plugin(plugin_id: String) -> Result<(), String> {
  let mut registry = get_registry().map_err(|e| e.to_string())?;
  if registry.remove(&plugin_id).is_none() {
    return Err(format!("Plugin '{}' was not loaded", plugin_id));
  }
  Ok(())
}

#[tauri::command]
pub fn list_plugins() -> Result<Vec<String>, String> {
  let registry = get_registry().map_err(|e| e.to_string())?;
  Ok(registry.keys().cloned().collect())
}
