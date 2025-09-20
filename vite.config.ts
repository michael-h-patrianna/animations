import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@/components': '/src/components',
      '@/animations': '/src/animations',
      '@/utils': '/src/utils',
      '@/types': '/src/types',
      '@/hooks': '/src/hooks',
      '@/assets': '/src/assets',
    },
  },
})
