#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use crate::ext::extism_init;
use extism::*;
use extism_convert::Json;
use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};
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
  #[error("Invalid JSON response: {0}")]
  InvalidJson(String),
}

type PluginResult<T> = std::result::Result<T, PluginError>;

static PLUGIN_REGISTRY: Lazy<Mutex<HashMap<String, Plugin>>> =
  Lazy::new(|| Mutex::new(HashMap::new()));

fn get_registry() -> PluginResult<std::sync::MutexGuard<'static, HashMap<String, Plugin>>> {
  PLUGIN_REGISTRY.lock().map_err(|_| PluginError::LockError)
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct PluginMetadata {
  pub name: String,
  pub version: String,
  pub description: String,
  pub author: String,
  pub logo: Option<String>,
  pub license: Option<String>,
  pub homepage: Option<String>,
  pub repository: Option<String>,
  pub keywords: Vec<String>,
  pub api_version: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct PluginManifest {
  pub metadata: PluginMetadata,
  pub capabilities: Vec<String>,
  pub ui_available: bool,
  pub event_handlers: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct LoadedPlugin {
  pub id: String,
  pub metadata: Option<PluginMetadata>,
  pub manifest: Option<PluginManifest>,
  pub has_ui: bool,
}

#[tauri::command(async)]
pub async fn plugin_init(plugin_id: String, plugin_url: String) -> Result<(), String> {
  if plugin_id.trim().is_empty() {
    return Err("Plugin ID cannot be empty".to_string());
  }

  let mut registry = get_registry().map_err(|e| e.to_string())?;
  if registry.contains_key(&plugin_id) {
    return Ok(());
  }

  let url = if plugin_url.is_empty() {
    format!(
      "https://github.com/shmor3/yapperai-plugins/releases/download/v1.1.1/{}.wasm",
      plugin_id
    )
  } else {
    plugin_url
  };
  if !url.starts_with("http://") && !url.starts_with("https://") && !url.starts_with("file://") {
    return Err("Invalid URL format".to_string());
  }
  let wasm_url = Wasm::url(&url);
  let manifest = Manifest::new([wasm_url]);
  let plugin = Plugin::new(&manifest, [], true)
    .map_err(|e| format!("Failed to create plugin {}: {}", plugin_id, e))?;

  registry.insert(plugin_id, plugin);
  Ok(())
}

#[tauri::command]
pub fn call_plugin(
  plugin_id: String,
  method: String,
  args: serde_json::Value,
) -> Result<serde_json::Value, String> {
  if plugin_id.trim().is_empty() {
    return Err("Plugin ID cannot be empty".to_string());
  }
  if method.trim().is_empty() {
    return Err("Method name cannot be empty".to_string());
  }
  let input = args.to_string();
  let mut registry = get_registry().map_err(|e| e.to_string())?;
  let plugin = registry
    .get_mut(&plugin_id)
    .ok_or_else(|| format!("Plugin '{}' not initialized", plugin_id))?;
  let output_vec = plugin
    .call(&method, input.as_bytes().to_vec())
    .map_err(|e| format!("Failed to call method '{}': {}", method, e))?;
  let output_str =
    String::from_utf8(output_vec).map_err(|e| format!("Plugin returned invalid UTF-8: {}", e))?;
  let result =
    serde_json::from_str(&output_str).unwrap_or_else(|_| serde_json::Value::String(output_str));
  Ok(result)
}

#[tauri::command]
pub fn get_plugin_info(plugin_id: String) -> Result<LoadedPlugin, String> {
  let mut registry = get_registry().map_err(|e| e.to_string())?;
  let plugin = registry
    .get_mut(&plugin_id)
    .ok_or_else(|| format!("Plugin '{}' not initialized", plugin_id))?;

  let metadata: Option<PluginMetadata> =
    match plugin.call::<_, Json<PluginMetadata>>("get_metadata", b"{}".to_vec()) {
      Ok(Json(res)) => Some(res),
      Err(_) => None,
    };

  let manifest: Option<PluginManifest> =
    match plugin.call::<Vec<u8>, Vec<u8>>("get_manifest", b"{}".to_vec()) {
      Ok(res) => serde_json::from_slice(&res).ok(),
      Err(_) => None,
    };

  let has_ui = plugin.call::<_, &[u8]>("get_ui", b"{}".to_vec()).is_ok();

  Ok(LoadedPlugin {
    id: plugin_id,
    metadata,
    manifest,
    has_ui,
  })
}

#[tauri::command]
pub fn unload_plugin(plugin_id: String) -> Result<(), String> {
  if plugin_id.trim().is_empty() {
    return Err("Plugin ID cannot be empty".to_string());
  }
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

#[tauri::command]
pub fn is_plugin_loaded(plugin_id: String) -> Result<bool, String> {
  if plugin_id.trim().is_empty() {
    return Err("Plugin ID cannot be empty".to_string());
  }
  let registry = get_registry().map_err(|e| e.to_string())?;
  Ok(registry.contains_key(&plugin_id))
}

#[tauri::command]
pub fn get_plugin_count() -> Result<usize, String> {
  let registry = get_registry().map_err(|e| e.to_string())?;
  Ok(registry.len())
}
