#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// mod info;
mod math;
mod plugins;
mod splash;
// use info::{get_app_name, get_app_version};
use math::{greet, sum};
use plugins::plugin;
use splash::{close_splash, upd_status};
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .menu(tauri::menu::Menu::default)
    .plugin(tauri_plugin_log::Builder::new().build())
    .plugin(tauri_plugin_websocket::init())
    .invoke_handler(tauri::generate_handler![
      // get_app_version,
      // get_app_name,
      close_splash,
      upd_status,
      plugin,
      greet,
      sum
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
