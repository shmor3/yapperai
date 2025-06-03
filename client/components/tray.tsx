import { TrayIcon } from '@tauri-apps/api/tray'
import { Menu } from '@tauri-apps/api/menu'

export async function trayMenu() {
	const menu = await Menu.new({
		items: [
			{
				id: 'quit',
				text: 'Quit',
				action: () => {
					console.log('quit pressed')
				},
			},
		],
	})
	const options = {
		menu,
		menuOnLeftClick: true,
		action: (event: {
			type: string
			button?: string
			buttonState?: string
			rect?: { position: { x: number; y: number } }
		}) => {
			switch (event.type) {
				case 'Click':
					console.log(
						`mouse ${event.button} button pressed, state: ${event.buttonState}`,
					)
					break
				case 'DoubleClick':
					console.log(`mouse ${event.button} button pressed`)
					break
				case 'Enter':
					console.log(
						`mouse hovered tray at ${event.rect?.position.x}, ${event.rect?.position.y}`,
					)
					break
				case 'Move':
					console.log(
						`mouse moved on tray at ${event.rect?.position.x}, ${event.rect?.position.y}`,
					)
					break
				case 'Leave':
					console.log(
						`mouse left tray at ${event.rect?.position.x}, ${event.rect?.position.y}`,
					)
					break
			}
		},
	}
	return await TrayIcon.new(options)
}
