#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{AppHandle, Manager};
use tokio::time::{sleep, Duration};

#[tauri::command]
pub fn close_splash(app: AppHandle) {
  app.get_webview_window("splash").unwrap().close().unwrap();
  app.get_webview_window("main").unwrap().show().unwrap();
}

#[tauri::command]
pub async fn upd_status() -> Result<Vec<(String, u8)>, String> {
  let steps = vec!["Checking for updates..."];
  let mut results = Vec::new();
  for (i, step) in steps.iter().enumerate() {
    let progress = if i < steps.len() - 1 {
      (i * 100) / (steps.len() - 1)
    } else {
      100
    };
    results.push((step.to_string(), progress as u8));
    sleep(Duration::from_millis(2500)).await;
  }
  Ok(results)
}
