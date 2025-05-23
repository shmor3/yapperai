use crate::plugins;
use crate::update;
use tauri::{AppHandle, Manager};
use tokio::time::{sleep, Duration};

#[tauri::command]
pub fn close(app: AppHandle) {
  app.get_webview_window("splash").unwrap().close().unwrap();
  app.get_webview_window("main").unwrap().show().unwrap();
}

#[tauri::command]
pub async fn status() -> Result<Vec<(String, u8)>, String> {
  let steps = vec![
    "Checking for updates",
    "Loading resources",
    "Initializing plugins",
    "Starting",
  ];
  let mut results = Vec::new();
  for (i, step) in steps.iter().enumerate() {
    let progress = if i < steps.len() - 1 {
      (i * 100) / (steps.len() - 1)
    } else {
      100
    };
    results.push((step.to_string(), progress as u8));
    match i {
      0 => {
        let update_result = update::update_app().await;
        if !update_result.is_empty() {
          return Err(format!("Update failed: {}", update_result));
        }
      }
      2 => {
        if let Err(e) =
          plugins::plugin_init("count_vowels".to_string(), Some("count_vowels".to_string()))
        {
          return Err(format!("Plugin initialization failed: {}", e));
        }
      }
      _ => {}
    }
    sleep(Duration::from_millis(2500)).await;
  }
  Ok(results)
}
