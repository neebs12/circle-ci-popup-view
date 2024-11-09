import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '',  // This ensures assets are loaded relative to the HTML file
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        options: 'options.html'
      }
    }
  }
})
