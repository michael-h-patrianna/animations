import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import { animationTitleIndexPlugin } from './vite/plugins/animationTitleIndexPlugin'

const rootDir = fileURLToPath(new URL('./', import.meta.url))
const resolveFromRoot = (relativePath: string) => resolve(rootDir, relativePath)

export default defineConfig({
  plugins: [animationTitleIndexPlugin(), react()],
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
        // Per-subsystem thresholds: set ~2% below actual coverage to catch
        // regressions. Raise these as coverage improves.
        'src/hooks/**': {
          statements: 86,
          branches: 70,
          functions: 93,
          lines: 87,
        },
        'src/lib/**': {
          statements: 91,
          branches: 83,
          functions: 90,
          lines: 92,
        },
        'src/services/**': {
          statements: 80,
          branches: 70,
          functions: 90,
          lines: 82,
        },
        'src/utils/**': {
          statements: 90,
          branches: 85,
          functions: 93,
          lines: 90,
        },
        // Context providers: complex state management with browser-dependent code paths.
        'src/contexts/**': {
          statements: 80,
          branches: 66,
          functions: 83,
          lines: 82,
        },
        // UI shell components: portal features and demo wrappers tested via E2E.
        'src/components/ui/**': {
          statements: 85,
          branches: 72,
          functions: 87,
          lines: 87,
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
