
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Важно для корректной загрузки ассетов на GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
