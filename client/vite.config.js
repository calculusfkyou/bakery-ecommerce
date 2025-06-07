// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    port: 5173,
    allowedHosts: true,
    proxy: {
      '/api': 'https://bakery-system.sdpmlab.org/api'
    },
    hmr: {
      protocol: 'wss',
      host: 'bakery-system.sdpmlab.org',
      port: 5173,
    }
  }
})
