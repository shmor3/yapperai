use crate::update;
use tokio::time::{sleep, Duration};

#[tauri::command]
pub async fn status() -> Result<Vec<(String, u8, String)>, String> {
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
    results.push((step.to_string(), progress as u8, String::new()));
    match i {
      0 => {
        let update_result = update::update_app().await;
        if !update_result.is_empty() {
          return Err(format!("Update failed: {}", update_result));
        }
      }
      2 => {
        return Ok(vec![(
          "Plugin initialization".to_string(),
          1,
          "Initializing...".to_string(),
        )]);
      }
      _ => {}
    }
    sleep(Duration::from_millis(2500)).await;
  }
  Ok(results)
}
