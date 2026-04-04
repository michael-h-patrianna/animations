import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { animationTitleIndexPlugin } from './vite/plugins/animationTitleIndexPlugin'

// https://vite.dev/config/
export default defineConfig({
  server: {
    // Dev server on 3000; E2E tests (playwright.config.ts) start a separate
    // server on 5173 so tests never conflict with a running dev instance.
    port: 3000,
    strictPort: false,
    open: true,
  },
  plugins: [animationTitleIndexPlugin(), react()],
  resolve: {
    alias: {
      '@': '/src',
      // Enable React Profiler in production builds so render-time badges work.
      // Overhead: ~0.12ms per frame with 12 profiled components. Zero when toggled off.
      'react-dom/client': 'react-dom/profiling',
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
            // Shiki (syntax highlighter) is dynamically imported only when the code viewer opens.
            // Routing it to its own chunk prevents ~150KB from landing in the eager vendor bundle.
            if (id.includes('shiki') || id.includes('@shikijs')) return 'syntax-highlight'
            return 'vendor'
          }

          // Utility functions and asset URL strings must live in a stable shared chunk.
          //
          // Without explicit routing, Rollup may absorb these into dynamic group chunks
          // (e.g. colors.ts into timer-effects-framer, image URLs into celebration-effects-framer),
          // which forces the entry to statically import those dynamic chunks — bloating the
          // initial load with 300KB+ of animation code the user may never visit.
          if (id.includes('/src/utils/')) return 'shared-utils'

          // Image asset modules (webp/png/svg) are URL-string-only — tiny per file but
          // numerous. Pinning them to one shared chunk prevents the same URL constant from
          // being duplicated across both the static entry chain and a dynamic group chunk,
          // which would create a false static import from the entry to that group chunk.
          if (id.match(/\/src\/assets\/.*\.(webp|png|jpg|jpeg|svg)$/)) return 'assets-manifest'

          // Category index files → main bundle (lightweight registration code)
          if (
            id.includes('/src/components/rewards/index') ||
            id.includes('/src/components/dialogs/index') ||
            id.includes('/src/components/base/index') ||
            id.includes('/src/components/progress/index') ||
            id.includes('/src/components/realtime/index')
          ) {
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
