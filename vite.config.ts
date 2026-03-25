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
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor'
            }
            if (id.includes('framer-motion') || id.includes('motion')) return 'motion'
            return 'vendor'
          }

          // Category index files → main bundle (lightweight registration code)
          if (id.includes('/src/components/rewards/index') ||
              id.includes('/src/components/dialogs/index') ||
              id.includes('/src/components/base/index') ||
              id.includes('/src/components/progress/index') ||
              id.includes('/src/components/realtime/index')) {
            return 'index'
          }

          // Animation groups: split framer/css variants into separate chunks.
          // Files under framer/ or css/ go to <group>-framer / <group>-css.
          // Group root files (shared.css, index.ts, helpers) are left to Rollup
          // auto-chunking so both variant chunks can share them.
          const variantMatch = id.match(
            /\/src\/components\/(?:base|dialogs|progress|realtime|rewards)\/([^/]+)\/(framer|css)\//
          )
          if (variantMatch) {
            return `${variantMatch[1]}-${variantMatch[2]}`
          }

          return undefined
        },
      },
    },
  },
})
