// vite.config.js
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Optional dev proxy if your backend is at localhost:3000
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
})
