// #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use serde::Deserialize;

// #[derive(Deserialize)]
// struct Message {
//   payload: String,
// }

// struct Client;

// impl Client {
//   async fn create_data(&self, data: &str) -> Result<String, String> {
//     Ok(data.to_string())
//   }
//   async fn retrieve_data(&self, data_id: &str) -> Result<String, String> {
//     Ok(data_id.to_string())
//   }
//   async fn update_data(&self, data: &str) -> Result<String, String> {
//     Ok(data.to_string())
//   }
//   async fn delete_data(&self, data_id: &str) -> Result<String, String> {
//     Ok(data_id.to_string())
//   }
// }

// struct Connect {
//   client: Client,
// }

// impl Connect {
//   fn new(client: Client) -> Self {
//     Connect { client }
//   }
//   async fn create(&self, data: Message) -> Result<String, String> {
//     let res = self.client.create_data(&data.payload).await?;
//     Ok(res)
//   }
//   async fn retrieve(&self, data_id: Message) -> Result<String, String> {
//     let res = self.client.retrieve_data(&data_id.payload).await?;
//     Ok(res)
//   }
//   async fn update(&self, data: Message) -> Result<String, String> {
//     let res = self.client.update_data(&data.payload).await?;
//     Ok(res)
//   }
//   async fn delete(&self, data_id: Message) -> Result<String, String> {
//     let res = self.client.delete_data(&data_id.payload).await?;
//     Ok(res)
//   }
// }

// #[tauri::command]
// pub async fn create(data: Message) -> Result<String, String> {
//   let client = Client {};
//   let connect = Connect::new(client);
//   connect.create(data).await
// }

// #[tauri::command]
// pub async fn retrieve(data_id: Message) -> Result<String, String> {
//   let client = Client {};
//   let connect = Connect::new(client);
//   connect.retrieve(data_id).await
// }

// #[tauri::command]
// pub async fn update(data: Message) -> Result<String, String> {
//   let client = Client {};
//   let connect = Connect::new(client);
//   connect.update(data).await
// }

// #[tauri::command]
// pub async fn delete(data_id: Message) -> Result<String, String> {
//   let client = Client {};
//   let connect = Connect::new(client);
//   connect.delete(data_id).await
// }
