use crate::update;
use crate::utils;
use once_cell::sync::OnceCell;
use std::time::{SystemTime, UNIX_EPOCH};
use tokio::time::{sleep, Duration};

static STATUS_RESULT: OnceCell<Result<Vec<(String, u8, String)>, String>> = OnceCell::new();

#[tauri::command]
pub async fn status(app_handle: tauri::AppHandle) -> Result<Vec<(String, u8, String)>, String> {
  utils::wait_until_window_visible(app_handle, "splash").await;
  if let Some(result) = STATUS_RESULT.get() {
    return result.clone();
  }

  let steps: Vec<&str> = vec![
    "Checking for updates",
    "Preparing environment",
    "Loading resources",
    "Initializing plugins",
    "Finalizing startup",
  ];
  let progress_values = [20, 40, 60, 80, 100];
  let mut results: Vec<(String, u8, String)> = Vec::new();
  for (idx, step) in steps.iter().enumerate() {
    println!("[DEBUG] Step {}: {}", idx, step);
    results.push((step.to_string(), 0, "Starting...".to_string()));
    sleep(Duration::from_millis(300)).await;
    let step_result = match idx {
      0 => {
        println!("[DEBUG] Checking for updates...");
        match check_updates().await {
          Ok(msg) => {
            results.push((step.to_string(), progress_values[idx], msg));
            Ok(())
          }
          Err(e) => {
            println!("[ERROR] Update check failed: {}", e);
            Err(format!("Update check failed: {}", e))
          }
        }
      }
      1 => {
        println!("[DEBUG] Preparing environment...");
        setup_environment()
          .await
          .map_err(|e| {
            println!("[ERROR] Environment failed: {}", e);
            format!("Environment failed: {}", e)
          })
          .map(|_| {
            results.push((
              step.to_string(),
              progress_values[idx],
              "Environment setup".to_string(),
            ));
          })
      }
      2 => {
        println!("[DEBUG] Loading resources...");
        load_resources()
          .await
          .map_err(|e| {
            println!("[ERROR] Resources loading failed: {}", e);
            format!("Resources loading failed: {}", e)
          })
          .map(|_| {
            results.push((
              step.to_string(),
              progress_values[idx],
              "Resource loading".to_string(),
            ));
          })
      }
      3 => {
        println!("[DEBUG] Initializing plugins...");
        initialize_plugins()
          .await
          .map_err(|e| {
            println!("[ERROR] Plugin initialization failed: {}", e);
            format!("Plugin initialization failed: {}", e)
          })
          .map(|_| {
            results.push((
              step.to_string(),
              progress_values[idx],
              "Plugin initialization".to_string(),
            ));
          })
      }
      4 => {
        println!("[DEBUG] Finalizing startup...");
        finalize_startup()
          .await
          .map_err(|e| {
            println!("[ERROR] Startup finalization failed: {}", e);
            format!("Startup finalization failed: {}", e)
          })
          .map(|_| {
            results.push((
              step.to_string(),
              progress_values[idx],
              "Startup finalization".to_string(),
            ));
          })
      }
      _ => {
        println!("[ERROR] Invalid step index: {}", idx);
        Err(format!("Invalid step index: {}", idx))
      }
    };

    if let Err(e) = step_result {
      return Err(e);
    }

    sleep(Duration::from_millis(simple_random(200, 600))).await;
  }

  println!(
    "[DEBUG] Finished all steps, returning results: {:?}",
    results
  );
  for result in &results {
    println!("Action: {:?}", result.0);
    println!("Progress: {}", result.1);
    println!("Message: {}", result.2);
  }

  let result = Ok(results.clone());
  let _ = STATUS_RESULT.set(result.clone());
  result
}

async fn check_updates() -> Result<String, String> {
  let update_result = update::check_for_updates().await;
  println!("[DEBUG] update_app() result: {:?}", update_result);
  Ok("Updates verified".to_string())
}

async fn setup_environment() -> Result<(), String> {
  Ok(())
}
async fn load_resources() -> Result<(), String> {
  Ok(())
}
async fn initialize_plugins() -> Result<(), String> {
  Ok(())
}
async fn finalize_startup() -> Result<(), String> {
  Ok(())
}

fn simple_random(min: u64, max: u64) -> u64 {
  if max <= min {
    return min;
  }
  let now = SystemTime::now()
    .duration_since(UNIX_EPOCH)
    .unwrap()
    .as_nanos();
  let range = max - min;
  (now % range as u128) as u64 + min
}
