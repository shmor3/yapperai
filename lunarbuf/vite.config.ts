/// <reference types="vitest" />
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    threads: false,
    environment: 'happy-dom',
    include: ['tests/*.spec.ts'],
    exclude: ['node_modules'],
  },
})
