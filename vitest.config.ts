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
      '@/components': resolveFromRoot('src/components'),
      '@/animations': resolveFromRoot('src/animations'),
      '@/utils': resolveFromRoot('src/utils'),
      '@/types': resolveFromRoot('src/types'),
      '@/hooks': resolveFromRoot('src/hooks'),
      '@/assets': resolveFromRoot('src/assets'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/setupTests.ts',
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
    },
  },
})
