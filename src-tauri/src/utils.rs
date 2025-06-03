#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde_json::Number;
use tauri::{AppHandle, Manager};
use tokio::time::{sleep, Duration};

#[tauri::command]
pub fn close_splash(app: AppHandle) {
  if let Some(splash) = app.get_webview_window("splash") {
    let _ = splash.close();
  }
  if let Some(main) = app.get_webview_window("main") {
    let _ = main.show();
  }
}

#[tauri::command]
pub fn close_app(app: AppHandle) {
  app.exit(0);
}

#[tauri::command]
pub fn greet(name: &str) -> String {
  format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub fn sum(a: Number, b: Number) -> Number {
  let a_f64 = a.as_f64().expect("Invalid number");
  let b_f64 = b.as_f64().expect("Invalid number");
  let sum = a_f64 + b_f64;
  Number::from_f64(sum).unwrap_or(Number::from(0))
}

#[tauri::command]
pub fn is_window_visible(app: AppHandle, label: &str) -> bool {
  if let Some(window) = app.get_webview_window(label) {
    window.is_visible().unwrap_or(false)
  } else {
    false
  }
}

pub async fn wait_until_window_visible(app: AppHandle, label: &str) {
  loop {
    if is_window_visible(app.clone(), label) {
      break;
    }
    sleep(Duration::from_millis(300)).await;
  }
}
