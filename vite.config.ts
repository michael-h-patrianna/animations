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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          // Keep all React-related packages together to avoid context errors
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
            return 'react-vendor'
          }
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('@radix-ui')) return 'radix'
          if (id.includes('lucide-react')) return 'icons'
          return 'vendor'
        },
      },
    },
  },
})
