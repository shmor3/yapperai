#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::collections::BTreeMap;
use std::sync::{Mutex};
use tauri::State;
pub struct EnvStore {
  store: Mutex<BTreeMap<String, String>>,
}
impl EnvStore {
  pub fn new() -> Self {
    EnvStore {
      store: Mutex::new(BTreeMap::new()),
    }
  }
  pub fn get(&self, key: &str) -> Option<String> {
    let store = self.store.lock().unwrap();
    store.get(key).cloned()
  }
  pub fn set(&self, key: String, value: String) {
    let mut store = self.store.lock().unwrap();
    store.insert(key, value);
  }
}
#[tauri::command]
pub fn get_app_env(env_store: State<'_, EnvStore>, key: String) -> Option<String> {
  env_store.get(&key)
}
#[tauri::command]
pub fn set_app_env(env_store: State<'_, EnvStore>, key: String, value: String) {
  env_store.set(key, value);
}
pub fn create_env_store() -> EnvStore {
  EnvStore::new()
}
