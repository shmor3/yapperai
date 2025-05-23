#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tokio::time::{sleep, Duration};

pub async fn update_app() -> String {
  sleep(Duration::from_millis(1000)).await;
  if perform_update().await.is_err() {
    return "Update failed".to_string();
  }
  let update_result = "Update successful".to_string();
  update_result
}

fn current_version() -> String {
  let update_version = "0.1.0".to_string();
  update_version
}

async fn check_update() -> bool {
  sleep(Duration::from_millis(1000)).await;
  if current_version() == "0.1.0" {
    return false;
  }
  true
}

async fn perform_update() -> Result<String, String> {
  sleep(Duration::from_millis(1000)).await;
  if check_update().await == false {
    return Err("No update available".to_string());
  }
  let update_result = "Update successful".to_string();
  Ok(update_result)
}
