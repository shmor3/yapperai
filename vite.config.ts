import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { envOnlyMacros } from 'vite-env-only'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'

const host = process.env.TAURI_DEV_HOST

export default defineConfig(async () => ({
	plugins: [
		react(),
		VitePWA({
			injectRegister: 'auto',
			registerType: 'autoUpdate',
			devOptions: {
				enabled: true,
			},
		}),
		reactRouter(),
		tailwindcss(),
		tsconfigPaths(),
		envOnlyMacros(),
	],
	clearScreen: false,
	server: {
		port: 1420,
		strictPort: true,
		host: host || false,
		hmr: host
			? {
					protocol: 'ws',
					host,
					port: 1421,
				}
			: undefined,
		watch: {
			ignored: ['**/src-tauri/**'],
		},
	},
}))
