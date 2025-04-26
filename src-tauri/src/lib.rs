use serde_json::Number;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn math(a: Number, b: Number) -> Number {
    let a_f64 = a.as_f64().expect("Invalid number");
    let b_f64 = b.as_f64().expect("Invalid number");
    let sum = a_f64 + b_f64;
    Number::from_f64(sum).expect("Sum is not a valid f64")
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, math])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
