import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    strictPort: false,
    open: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Skip node_modules for this check
          if (id.includes('node_modules')) {
            // Keep all React-related packages together to avoid context errors
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor'
            }
            if (id.includes('framer-motion') || id.includes('motion')) return 'motion'
            return 'vendor'
          }

          // Group index files and their lazy-loaded modules
          // Each animation group gets its own chunk for framer and css variants
          if (id.includes('/src/components/rewards/')) {
            if (id.includes('/collection-effects/')) return 'collection-effects'
            if (id.includes('/icon-animations/')) return 'icon-animations'
            if (id.includes('/lights/')) return 'lights'
            if (id.includes('/modal-celebrations/')) return 'modal-celebrations'
            if (id.includes('/prize-reveal/')) return 'prize-reveal'
          }

          if (id.includes('/src/components/dialogs/')) {
            if (id.includes('/modal-base/')) return 'modal-base'
            if (id.includes('/modal-content/')) return 'modal-content'
            if (id.includes('/modal-dismiss/')) return 'modal-dismiss'
            if (id.includes('/modal-open/')) return 'modal-open'
            if (id.includes('/modal-orchestration/')) return 'modal-orchestration'
          }

          if (id.includes('/src/components/base/')) {
            if (id.includes('/text-effects/')) return 'text-effects'
            if (id.includes('/standard-effects/')) return 'standard-effects'
            if (id.includes('/button-effects/')) return 'button-effects'
          }

          if (id.includes('/src/components/progress/')) {
            if (id.includes('/progress-bars/')) return 'progress-bars'
            if (id.includes('/loading-states/')) return 'loading-states'
          }

          if (id.includes('/src/components/realtime/')) {
            if (id.includes('/timer-effects/')) return 'timer-effects'
            if (id.includes('/update-indicators/')) return 'update-indicators'
            if (id.includes('/realtime-data/')) return 'realtime-data'
          }

          // Keep category index files in main bundle (they're lightweight)
          if (id.includes('/src/components/rewards/index') ||
              id.includes('/src/components/dialogs/index') ||
              id.includes('/src/components/base/index') ||
              id.includes('/src/components/progress/index') ||
              id.includes('/src/components/realtime/index')) {
            return 'index'
          }

          return undefined
        },
      },
    },
  },
})
