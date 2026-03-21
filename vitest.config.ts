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
        // Per-subsystem thresholds. No global aggregate because animation
        // components (~20% coverage from smoke tests) would drag down the
        // average and make a 90% global threshold unachievable.
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
          branches: 60,
          functions: 90,
          lines: 90,
        },
        'src/utils/**': {
          statements: 90,
          branches: 85,
          functions: 90,
          lines: 90,
        },
        // UI shell components (AnimationCard, GroupSection, Sidebar, etc.)
        'src/components/ui/**': {
          statements: 90,
          branches: 75,
          functions: 90,
          lines: 90,
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
