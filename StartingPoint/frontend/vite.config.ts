import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  plugins: [
    react(),
    mkcert(),
  ],
  server: {
    host: 'localhost',
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
  },
})