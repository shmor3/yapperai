#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod env;
mod plugins;
mod request;
mod splash;
mod update;
mod utils;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  plugins::plugin_init("count_vowels".to_string(), "".to_string())
    .expect("Failed to initialize count_vowels plugin: Plugin initialization failed");
  plugins::plugin_init("greet".to_string(), "".to_string())
    .expect("Failed to initialize greet plugin: Plugin initialization failed");
  plugins::plugin_init("http".to_string(), "".to_string())
    .expect("Failed to initialize http plugin: Plugin initialization failed");
  plugins::plugin_init("read_write".to_string(), "".to_string())
    .expect("Failed to initialize read_write plugin: Plugin initialization failed");
  tauri::Builder::default()
    .manage(env::create_env_store())
    .menu(tauri::menu::Menu::default)
    .plugin(tauri_plugin_log::Builder::new().build())
    .invoke_handler(tauri::generate_handler![
      utils::close_app,
      plugins::call_plugin,
      plugins::list_plugins,
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
