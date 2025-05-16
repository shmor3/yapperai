#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// mod extism;
mod math;
mod splash;

// use extism::plugin;
use math::{greet, sum};
use splash::{close_splash, upd_status};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .menu(tauri::menu::Menu::default)
    .plugin(tauri_plugin_log::Builder::new().build())
    .invoke_handler(tauri::generate_handler![
      close_splash,
      upd_status,
      // plugin,
      greet,
      sum
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
