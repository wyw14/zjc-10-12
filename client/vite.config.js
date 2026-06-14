import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5212,
    proxy: {
      '/api': {
        target: 'http://localhost:3112',
        changeOrigin: true
      }
    }
  }
})
