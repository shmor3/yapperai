#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{AppHandle, Manager};

#[tauri::command]
pub fn close_splash(app: AppHandle) {
  app.get_webview_window("splash").unwrap().close().unwrap();
  app.get_webview_window("main").unwrap().show().unwrap();
}

#[tauri::command]
pub fn close_app(app: AppHandle) {
  app.exit(0);
}
