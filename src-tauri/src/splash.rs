use log::{error, info};
use once_cell::sync::OnceCell;
use parking_lot::RwLock as ParkingLotRwLock;
use std::future::Future;
use std::pin::Pin;
use std::sync::atomic::{AtomicBool, Ordering};
use tauri::{AppHandle, Manager};
use tokio::time::{sleep, timeout, Duration};

#[derive(Debug)]
pub struct Config {
  operation_timeout: Duration,
  status_check_timeout: Duration,
  retry_delay: Duration,
  max_retries: u32,
}
impl Default for Config {
  fn default() -> Self {
    Self {
      operation_timeout: Duration::from_secs(5),
      status_check_timeout: Duration::from_secs(10),
      retry_delay: Duration::from_millis(500),
      max_retries: 2,
    }
  }
}
type Result<T> = std::result::Result<T, SplashError>;
#[derive(Clone, Debug, serde::Serialize)]
pub struct StatusUpdate {
  pub step: String,
  pub progress: u8,
  pub message: String,
  pub done: bool,
  pub error: Option<String>,
}
#[derive(Debug, thiserror::Error)]
pub enum SplashError {
  #[error("Environment error: {0}")]
  Environment(String),
  #[error("Resource error: {0}")]
  Resource(String),
  #[error("Plugin error: {0}")]
  Startup(String),
  #[error("Timeout error: {0}")]
  Timeout(String),
}
impl From<Box<dyn std::error::Error + Send + Sync>> for SplashError {
  fn from(error: Box<dyn std::error::Error + Send + Sync>) -> Self {
    SplashError::Startup(error.to_string())
  }
}
async fn process_steps() -> Result<StatusUpdate> {
  let steps = vec![
    ("Checking Updates", check_updates()),
    ("Getting Ready", setup_environment()),
    ("Loading Plugins", initialize_plugins()),
  ];
  let total_steps = steps.len();
  let progress_per_step = 100 / total_steps as u8;
  for (index, (step_name, step_future)) in steps.into_iter().enumerate() {
    update_progress(step_name, progress_per_step * index as u8, "Starting...").await?;
    match step_future.await {
      Ok(message) => {
        update_progress(step_name, progress_per_step * (index + 1) as u8, &message).await?;
      }
      Err(e) => {
        let error_message = e.to_string();
        get_state().write().handle_error(step_name, &error_message);
        return Err(e);
      }
    }
  }
  INITIALIZATION_COMPLETE.store(true, Ordering::SeqCst);
  Ok(StatusUpdate {
    step: "done".into(),
    progress: 100,
    message: "done".into(),
    done: true,
    error: None,
  })
}
async fn check_updates_impl() -> Result<String> {
  info!("Starting check_updates_impl");
  let result = with_timeout(
    Config::default().operation_timeout,
    retry(
      || async {
        info!("Attempting update check...");
        match do_check_updates().await {
          Ok(_) => {
            info!("Update check successful");
            Ok("updated successfully".to_string())
          }
          Err(e) => {
            error!("Update check failed: {}", e);
            Err(SplashError::Resource(e.to_string()))
          }
        }
      },
      Config::default().max_retries,
      Config::default().retry_delay,
    ),
  )
  .await;
  info!("check_updates_impl completed with result: {:?}", result);
  result
}
fn check_updates() -> Pin<Box<dyn Future<Output = Result<String>> + Send>> {
  Box::pin(check_updates_impl())
}
async fn setup_environment_impl() -> Result<String> {
  with_timeout(Config::default().operation_timeout, async {
    do_environment_setup()
      .await
      .map_err(|e| SplashError::Environment(e.to_string()))?;
    Ok("Environment setup complete".to_string())
  })
  .await
}
fn setup_environment() -> Pin<Box<dyn Future<Output = Result<String>> + Send>> {
  Box::pin(setup_environment_impl())
}
async fn initialize_plugins_impl() -> Result<String> {
  with_timeout(Config::default().operation_timeout, async {
    do_plugin_init()
      .await
      .map_err(|e| SplashError::Resource(e.to_string()))?;
    Ok("Plugins initialized successfully".to_string())
  })
  .await
}
fn initialize_plugins() -> Pin<Box<dyn Future<Output = Result<String>> + Send>> {
  Box::pin(initialize_plugins_impl())
}
#[derive(Default)]
pub struct SplashState {
  current_step: String,
  progress: u8,
  message: String,
  is_completed: bool,
  history: Vec<StatusUpdate>,
  completed_steps: Vec<String>,
}
impl SplashState {
  pub fn new() -> Self {
    Self::default()
  }
  pub fn update(&mut self, step: impl Into<String>, progress: u8, message: impl Into<String>) {
    let step = step.into();
    let message = message.into();
    self.current_step = step.clone();
    self.progress = progress;
    self.message = message.clone();
    self.is_completed = progress >= 100;
    self.history.push(StatusUpdate {
      step: step.clone(),
      progress,
      message,
      done: false,
      error: None,
    });
    if progress >= 100 / 5 * (self.completed_steps.len() + 1) as u8
      && !self.completed_steps.contains(&step)
    {
      self.completed_steps.push(step);
    }
  }
  pub fn handle_error(&mut self, step: impl AsRef<str>, error: impl AsRef<str>) {
    let step = step.as_ref();
    let error = error.as_ref();
    info!("Handling error for step {}: {}", step, error);
    self.update(step.to_string(), 0, format!("Error: {}", error));
    if let Some(index) = self.completed_steps.iter().position(|s| s == step) {
      self.completed_steps.truncate(index);
    }
  }
  pub fn get_current_status(&self) -> StatusUpdate {
    StatusUpdate {
      step: self.current_step.clone(),
      progress: self.progress,
      message: self.message.clone(),
      done: self.is_completed,
      error: None,
    }
  }
}
static INITIALIZATION_COMPLETE: AtomicBool = AtomicBool::new(false);
static STATE: OnceCell<ParkingLotRwLock<SplashState>> = OnceCell::new();
fn get_state() -> &'static ParkingLotRwLock<SplashState> {
  STATE.get_or_init(|| ParkingLotRwLock::new(SplashState::new()))
}
async fn do_check_updates() -> std::result::Result<(), Box<dyn std::error::Error + Send + Sync>> {
  sleep(Duration::from_millis(500)).await;
  Ok(())
}
async fn do_environment_setup() -> std::result::Result<(), Box<dyn std::error::Error + Send + Sync>>
{
  sleep(Duration::from_millis(500)).await;
  Ok(())
}
async fn do_plugin_init() -> std::result::Result<(), Box<dyn std::error::Error + Send + Sync>> {
  sleep(Duration::from_millis(500)).await;
  Ok(())
}
async fn update_progress(step: &str, progress: u8, message: &str) -> Result<()> {
  info!(
    "Updating progress - Step: {}, Progress: {}%, Message: {}",
    step, progress, message
  );
  let state = get_state();
  let mut state = state.write();
  state.update(step.to_string(), progress, message.to_string());
  info!("Progress updated successfully");
  Ok(())
}
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
pub async fn fetch_status() -> std::result::Result<StatusUpdate, String> {
  async fn get_status() -> Result<StatusUpdate> {
    if INITIALIZATION_COMPLETE.load(Ordering::SeqCst) {
      return Ok(
        get_state()
          .read()
          .history
          .last()
          .cloned()
          .unwrap_or_else(|| StatusUpdate {
            step: "Complete".into(),
            progress: 100,
            message: "Initialization complete".into(),
            done: true,
            error: None,
          }),
      );
    }
    let current_state = get_state().read().get_current_status();
    if !current_state.step.is_empty() && current_state.progress < 100 {
      return Ok(current_state);
    }
    process_steps().await
  }
  match timeout(Config::default().status_check_timeout, get_status()).await {
    Ok(result) => result.map_err(|e| e.to_string()),
    Err(_) => Err("Status check timed out".into()),
  }
}
async fn with_timeout<T>(
  duration: Duration,
  operation: impl Future<Output = Result<T>>,
) -> Result<T> {
  timeout(duration, operation)
    .await
    .map_err(|_| SplashError::Timeout(format!("Operation timed out after {:?}", duration)))?
}
async fn retry<T, Fut, F>(operation: F, retries: u32, delay: Duration) -> Result<T>
where
  F: Fn() -> Fut,
  Fut: Future<Output = Result<T>>,
{
  let mut attempts = 0;
  loop {
    match operation().await {
      Ok(result) => return Ok(result),
      Err(e) if attempts < retries => {
        attempts += 1;
        info!("Retry attempt {} after error: {}", attempts, e);
        sleep(delay).await;
        continue;
      }
      Err(e) => return Err(e),
    }
  }
}
