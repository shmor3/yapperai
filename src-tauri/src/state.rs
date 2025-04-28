#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;
use tauri::State;

pub struct Counter(Mutex<usize>);

impl Counter {
    pub fn new(mutex: Mutex<usize>) -> Self {
        Counter(mutex)
    }
}
#[tauri::command]
pub fn increment(counter: State<'_, Counter>) -> usize {
  let mut c = counter.0.lock().unwrap();
  *c += 1;
  *c
}

#[tauri::command]
pub fn decrement(counter: State<'_, Counter>) -> usize {
  let mut c = counter.0.lock().unwrap();
  *c -= 1;
  *c
}

#[tauri::command]
pub fn reset(counter: State<'_, Counter>) -> usize {
  let mut c = counter.0.lock().unwrap();
  *c = 0;
  *c
}

#[tauri::command]
pub fn get(counter: State<'_, Counter>) -> usize {
  *counter.0.lock().unwrap()
}
