#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod env;
mod math;
mod plugins;
mod request;
mod splash;
mod update;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .manage(env::create_env_store())
    .menu(tauri::menu::Menu::default)
    .plugin(tauri_plugin_log::Builder::new().build())
    .invoke_handler(tauri::generate_handler![
      plugins::plugin_init,
      plugins::call_plugin,
      plugins::list_plugins,
      plugins::unload_plugin,
      splash::close,
      splash::status,
      math::greet,
      math::sum,
      request::create,
      request::retrieve,
      request::update,
      request::delete,
      env::get_app_env,
      env::set_app_env,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
