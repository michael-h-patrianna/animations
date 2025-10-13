#!/usr/bin/env node
/**
 * Guarded wrapper around `vitest --watch` so automation cannot spawn endless watchers.
 */
import { spawn } from 'node:child_process'

if (process.env.ALLOW_VITEST_WATCH !== '1') {
  console.error('\nRefusing to start Vitest in watch mode.')
  console.error('Set ALLOW_VITEST_WATCH=1 if an interactive watcher is required.\n')
  process.exit(1)
}

const env = {
  ...process.env,
}

const child = spawn('npx', ['vitest', '--watch'], {
  stdio: 'inherit',
  env,
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.exit(1)
  } else {
    process.exit(code ?? 0)
  }
})
