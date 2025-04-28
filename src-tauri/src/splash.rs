#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::{AppHandle, Manager, Window};
use std::time::Duration;
use std::thread;
use tauri_plugin_updater::UpdaterExt;

#[tauri::command]
fn isReady() -> Bool {
  println!("isReady called");
  true

}

async fn update(app: tauri::AppHandle) -> tauri_plugin_updater::Result<()> {
  if let Some(update) = app.updater()?.check().await? {
    let mut downloaded = 0;
    update
      .download_and_install(
        |chunk_length, content_length| {
          downloaded += chunk_length;
          println!("downloaded {downloaded} from {content_length:?}");
        },
        || {
          println!("download finished");
        },
      )
      .await?;
    println!("update installed");
    app.restart();
  }
  Ok(())
}

fn close_splash(app: AppHandle) {
    let splash_window = app.get_webview_window("splash").unwrap();
    let main_window = app.get_webview_window("main").unwrap();
    splash_window.close().unwrap();
    main_window.show().unwrap();
}

async fn check_for_updates(window: Window) -> Result<String, String> {
    window.emit("update_status", "Checking for updates...").unwrap();
    thread::sleep(Duration::from_secs(2));
    let update_available = true;
    if update_available {
        window.emit("update_status", "Update available. Downloading...").unwrap();
        thread::sleep(Duration::from_secs(3));
        window.emit("update_status", "Installing update...").unwrap();
        thread::sleep(Duration::from_secs(2));
        window.emit("update_status", "Update complete!").unwrap();
        Ok("update_complete".to_string())
    } else {
        window.emit("update_status", "No updates available").unwrap();
        Ok("no_update".to_string())
    }
}

fn setup(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    let app_handle = app.handle();
    let splash_window = app.get_webview_window("splash").unwrap();
    tauri::async_runtime::spawn(async move {
        thread::sleep(Duration::from_secs(2));
        if let Err(e) = check_for_updates(splash_window.clone()).await {
            eprintln!("Failed to check for updates: {}", e);
        }
        close_splash(app_handle);
    });
    Ok(())
}