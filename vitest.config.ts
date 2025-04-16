/// <reference types="vitest/config" />
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	build: {},
	plugins: [react(), reactRouter(), tailwindcss(), tsconfigPaths()],
	test: {
		globals: true,
		environment: 'happy-dom',
		setupFiles: ['./test/setup-test-env.ts'],
		include: ['**/*.test.ts', '**/*.test.tsx'],
		exclude: ['**/__tests__/**', '**/__mocks__/**', 'node_modules'],
	},
})
