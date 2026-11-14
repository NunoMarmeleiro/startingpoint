import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import mkcert from 'vite-plugin-mkcert'

export default defineConfig(({ command, mode }) => {
  const useMkcert = command === "serve" && mode !== "test" && !process.env.VITEST
  return {
    plugins: [
    react(),
      ...(useMkcert ? [mkcert()] : []),
  ],
  server: {
    host: 'localhost',
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
  },
}})