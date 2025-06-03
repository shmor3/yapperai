use crate::update;
use crate::utils;
use std::time::{SystemTime, UNIX_EPOCH};
use tokio::time::{sleep, Duration};

struct Step {
  name: &'static str,
  progress: u8,
  func: fn() -> StepFuture,
}

type StepFuture =
  std::pin::Pin<Box<dyn std::future::Future<Output = Result<String, String>> + Send>>;

fn check_updates_step() -> StepFuture {
  Box::pin(async {
    let update_result = update::check_for_updates().await;
    println!("[DEBUG] update_app() result: {:?}", update_result);
    Ok("Updates verified".to_string())
  })
}

fn setup_environment_step() -> StepFuture {
  Box::pin(async {
    sleep(Duration::from_millis(3000)).await;
    Ok("Environment setup".to_string())
  })
}

fn load_resources_step() -> StepFuture {
  Box::pin(async {
    sleep(Duration::from_millis(3000)).await;
    Ok("Resources loaded".to_string())
  })
}

fn initialize_plugins_step() -> StepFuture {
  Box::pin(async {
    sleep(Duration::from_millis(3000)).await;
    Ok("Plugins initialized".to_string())
  })
}

fn finalize_startup_step() -> StepFuture {
  Box::pin(async {
    sleep(Duration::from_millis(3000)).await;
    Ok("Startup finalized".to_string())
  })
}

#[tauri::command]
pub async fn status(app_handle: tauri::AppHandle) -> Result<Vec<(String, u8, String)>, String> {
  utils::wait_until_window_visible(app_handle, "splash").await;

  let steps: Vec<Step> = vec![
    Step {
      name: "Checking for updates",
      progress: 20,
      func: check_updates_step,
    },
    Step {
      name: "Preparing environment",
      progress: 40,
      func: setup_environment_step,
    },
    Step {
      name: "Loading resources",
      progress: 60,
      func: load_resources_step,
    },
    Step {
      name: "Initializing plugins",
      progress: 80,
      func: initialize_plugins_step,
    },
    Step {
      name: "Finalizing startup",
      progress: 100,
      func: finalize_startup_step,
    },
  ];
  let mut results: Vec<(String, u8, String)> = Vec::new();

  for step in &steps {
    println!("[DEBUG] Step: {}", step.name);

    let step_result = (step.func)().await;

    match step_result {
      Ok(msg) => {
        results.push((step.name.to_string(), step.progress, msg));
      }
      Err(e) => {
        println!("[ERROR] {} failed: {}", step.name, e);
        return Err(format!("{} failed: {}", step.name, e));
      }
    };

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

  Ok(results)
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
