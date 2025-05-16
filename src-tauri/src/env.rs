// #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use std::collections::BTreeMap;
// use std::sync::{Arc, Mutex};

// pub struct EnvStore {
//   store: Arc<Mutex<BTreeMap<String, String>>>,
// }

// impl EnvStore {
//   fn new() -> Self {
//     EnvStore {
//       store: Arc::new(Mutex::new(BTreeMap::new())),
//     }
//   }

//   fn get(&self, key: &str) -> Option<String> {
//     let store = self.store.lock().unwrap();
//     store.get(key).cloned()
//   }

//   fn set(&self, key: String, value: String) {
//     let mut store = self.store.lock().unwrap();
//     store.insert(key, value);
//   }
// }

// #[tauri::command]
// pub fn get_app_env(env_store: tauri::State<EnvStore>, key: String) -> Option<String> {
//   env_store.get(&key)
// }

// #[tauri::command]
// pub fn set_app_env(env_store: tauri::State<EnvStore>, key: String, value: String) {
//   env_store.set(key, value);
// }

// pub fn create_env_store() -> EnvStore {
//   EnvStore::new()
// }
