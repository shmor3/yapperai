import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { envOnlyMacros } from 'vite-env-only'
import tsconfigPaths from 'vite-tsconfig-paths'
const host = process.env.TAURI_DEV_HOST

export default defineConfig(async () => ({
	plugins: [reactRouter(), tailwindcss(), tsconfigPaths(), envOnlyMacros()],
	optimizeDeps: {
		include: ['react', 'react/jsx-dev-runtime'],
	},
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
			ignored: ['**/src-tauri/**', '.history/**'],
		},
	},
}))
