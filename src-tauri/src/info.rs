#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
pub fn get_app_version() -> String {
  let version = env!("CARGO_PKG_VERSION");
  format!("v{}", version)
}

#[tauri::command]
pub fn get_app_name() -> String {
  let name = env!("CARGO_PKG_NAME");
  format!("{}", name)
}
