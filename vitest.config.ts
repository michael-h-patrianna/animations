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
        statements: 90,
        branches: 75,
        functions: 85,
        lines: 90,
      },
    },
  },
})
