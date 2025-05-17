#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use extism::*;

#[tauri::command]
pub async fn plugin(_app_handle: tauri::AppHandle) -> Result<String, String> {
  let url = Wasm::url("https://github.com/extism/plugins/releases/download/v1.1.1/greet.wasm");
  let manifest = Manifest::new([url]);

  match Plugin::new(&manifest, [], true) {
    Ok(mut plugin) => match plugin.call::<&str, String>("greet", "yapperai") {
      Ok(res) => {
        println!("{}", res);
        Ok(res)
      }
      Err(e) => Err(format!("Failed to call plugin function: {}", e)),
    },
    Err(e) => Err(format!("Failed to create plugin: {}", e)),
  }
}

#[tauri::command]
pub async fn init(_app_handle: tauri::AppHandle) -> Result<(), String> {
  // You can perform any initialization here
  Ok(())
}

#[cfg(debug_assertions)]
pub fn init_plugin(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
  use tauri::Manager;
  app.manage(PluginState::default());
  Ok(())
}

#[derive(Default)]
pub struct PluginState {
  // Add any state you need to manage here
}
