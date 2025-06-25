import { TrayIcon } from "@tauri-apps/api/tray";
import { Menu } from "@tauri-apps/api/menu";

export async function trayMenu() {
  const menu = await Menu.new({
    items: [
      {
        id: "quit",
        text: "Quit",
        action: async () => {
          await invoke<null>("close_app", {});
        },
      },
    ],
  });
  const options = {
    menu,
    menuOnLeftClick: true,
    action: (event: {
      type: string;
      button?: string;
      buttonState?: string;
    }) => {
      switch (event.type) {
        case "Click":
          console.log(
            `mouse ${event.button} button pressed, state: ${event.buttonState}`
          );
          break;
      }
    },
  };
  return await TrayIcon.new(options);
}
