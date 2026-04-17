#!/usr/bin/env node
import { spawn } from 'node:child_process'

const args = process.argv.slice(2)
const pnpmBin = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
const child = spawn(pnpmBin, ['exec', 'vitest', ...args], {
  stdio: 'inherit',
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.exit(1)
  } else {
    process.exit(code ?? 0)
  }
})
