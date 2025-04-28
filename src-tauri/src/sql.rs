// fn main() {
//     let migrations = vec![
//         Migration {
//             version: 1,
//             description: "create_initial_tables",
//             sql: "CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);",
//             kind: MigrationKind::Up,
//         }
//     ];
//     tauri::Builder::default()
//         .plugin(
//             tauri_plugin_sql::Builder::default()
//                 .add_migrations("sqlite:mydatabase.db", migrations)
//                 .build(),
//         )
// }
