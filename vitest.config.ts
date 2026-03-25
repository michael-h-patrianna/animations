import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const rootDir = fileURLToPath(new URL('./', import.meta.url))
const resolveFromRoot = (relativePath: string) => resolve(rootDir, relativePath)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolveFromRoot('src'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/setupTests.ts',
    typecheck: {
      tsconfig: './tsconfig.test.json',
    },
    css: true,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/scripts/playwright/**',
      'tests/e2e/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: [
        'src/components/ui/**/*.{ts,tsx}',
        'src/components/animationRegistry.ts',
        'src/components/ErrorBoundary.tsx',
        'src/components/**/framer/**/*.{ts,tsx}',
        'src/components/**/css/**/*.{ts,tsx}',
        'src/contexts/**/*.{ts,tsx}',
        'src/hooks/**/*.{ts,tsx}',
        'src/lib/**/*.{ts,tsx}',
        'src/services/**/*.{ts,tsx}',
        'src/utils/**/*.{ts,tsx}',
        'src/App.tsx',
      ],
      exclude: [
        'node_modules/',
        'src/setupTests.ts',
        'src/test/**',
        '**/*.test.{ts,tsx}',
        '**/__tests__/**',
        'scripts/**',
        'build/**',
        'dist/**',
      ],
      thresholds: {
        // Global floor: a low aggregate threshold that catches catastrophic
        // regressions (e.g. an entire subsystem losing test coverage) without
        // being dragged down by animation components (~20% from smoke tests).
        statements: 35,
        branches: 25,
        functions: 30,
        lines: 35,
        // Per-subsystem thresholds enforce higher bars where they apply.
        'src/hooks/**': {
          statements: 90,
          branches: 75,
          functions: 90,
          lines: 90,
        },
        'src/lib/**': {
          statements: 90,
          branches: 75,
          functions: 90,
          lines: 90,
        },
        'src/services/**': {
          statements: 90,
          branches: 75,
          functions: 90,
          lines: 90,
        },
        'src/utils/**': {
          statements: 90,
          branches: 85,
          functions: 90,
          lines: 90,
        },
        // Context providers contain complex state management
        // (AnimationInspectorContext animated preview, prop overrides).
        // Thresholds set to current levels as a regression ratchet.
        'src/contexts/**': {
          statements: 75,
          branches: 64,
          functions: 78,
          lines: 76,
        },
        // UI shell components (AnimationCard, GroupSection, Sidebar, etc.)
        // Statements threshold is 88% (not 90%) because GroupSection's demo
        // wrappers (DemoModeWrapper, IconDotDemo, StatusRowDemo) and AnimationCard's
        // portal features (preview modal, code viewer, auto-preview, clipboard) are
        // tested through E2E tests rather than unit tests — createPortal +
        // document.body interactions require browser-level verification.
        // Functions threshold is 85% for the same reason.
        'src/components/ui/**': {
          statements: 88,
          branches: 75,
          functions: 85,
          lines: 88,
        },
        // Animation components are tested via smoke tests and metadata integrity
        // checks rather than per-component unit tests.
        'src/components/**/framer/**': {
          statements: 20,
          branches: 10,
          functions: 15,
          lines: 20,
        },
        'src/components/**/css/**': {
          statements: 20,
          branches: 10,
          functions: 15,
          lines: 20,
        },
      },
    },
  },
})
