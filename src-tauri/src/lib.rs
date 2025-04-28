#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[cfg(desktop)]

mod state;
mod splash;
// mod sql;
use serde_json::Number;
use tauri_plugin_store::StoreExt;
use serde_json::json;
use std::sync::Mutex;
use state::Counter;
use state::{increment, decrement, reset, get};
use splash::isReady;

#[tauri::command]
fn greet(name: &str) -> String {
  format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn math(a: Number, b: Number) -> Number {
  let a_f64 = a.as_f64().expect("Invalid number");
  let b_f64 = b.as_f64().expect("Invalid number");
  let sum = a_f64 + b_f64;
  Number::from_f64(sum).unwrap_or(Number::from(0))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .menu(tauri::menu::Menu::default)
    .manage(Counter::new(Mutex::new(0)))
    .plugin(tauri_plugin_store::Builder::default().build())
    .plugin(tauri_plugin_store::Builder::new().build())
    .plugin(tauri_plugin_log::Builder::new().build())
    // .plugin(tauri_plugin_os::init())
    // .plugin(tauri_plugin_clipboard_manager::init())
    .plugin(tauri_plugin_opener::init())
    .plugin(tauri_plugin_websocket::init())
    .setup(|app| {
        let store = app.store("store.json")?;
        store.set("some-key", json!({ "value": 5 }));
        let value = store.get("some-key").expect("Failed to get value from store");
        println!("{}", value);
        store.close_resource();
        Ok(())
    })
    .invoke_handler(tauri::generate_handler![isReady, greet, math, increment, decrement, reset, get])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
 