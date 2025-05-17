#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod extism;
mod math;
mod splash;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .menu(tauri::menu::Menu::default)
    .plugin(tauri_plugin_log::Builder::new().build())
    .setup(|app| {
      #[cfg(debug_assertions)]
      extism::init_plugin(app)?;
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      extism::plugin,
      extism::init,
      splash::close,
      splash::status,
      math::greet,
      math::sum
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
