#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod env;
mod plugins;
mod request;
mod splash;
mod update;
mod utils;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  plugins::plugin_init("ui".to_string(), "".to_string())
    .expect("Failed to initialize ui plugin: Plugin initialization failed");
  tauri::Builder::default()
    .manage(env::create_env_store())
    .menu(tauri::menu::Menu::default)
    .plugin(tauri_plugin_log::Builder::new().build())
    .invoke_handler(tauri::generate_handler![
      utils::close_app,
      plugins::call_plugin,
      plugins::list_plugins,
      plugins::get_plugin_info,
      plugins::get_plugin_count,
      plugins::is_plugin_loaded,
      plugins::unload_plugin,
      splash::close_splash,
      splash::fetch_status,
      request::create,
      request::retrieve,
      request::update,
      request::delete,
      env::get_app_env,
      env::set_app_env,
      utils::greet,
      utils::sum,
    ])
    .run(tauri::generate_context!())
    .expect("error while running application");
}
