#!/usr/bin/env node
/**
 * Terminates lingering Vitest processes before starting a new run.
 * Prevents background workers from exhausting system memory between runs.
 */
import { execSync } from 'node:child_process'

const WORKSPACE_ROOT = process.cwd()

function listProcesses() {
  try {
    const output = execSync('ps -A -o pid=,ppid=,command=', { encoding: 'utf8' })
    return output
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const match = line.match(/^(\d+)\s+(\d+)\s+(.*)$/)
        if (!match) return null
        const [, pid, ppid, command] = match
        return { pid: Number(pid), ppid: Number(ppid), command: command.trim() }
      })
      .filter(Boolean)
  } catch (error) {
    console.warn('[cleanup-vitest] Unable to read process list:', error.message)
    return []
  }
}

function belongsToCurrentWorkspace(processInfo, processByPid) {
  let current = processInfo
  const visited = new Set()

  while (current && !visited.has(current.pid)) {
    visited.add(current.pid)
    if (current.command.includes(WORKSPACE_ROOT)) {
      return true
    }
    if (!current.ppid || current.ppid === current.pid) {
      return false
    }
    current = processByPid.get(current.ppid)
  }

  return false
}

;(async function main() {
  const processes = listProcesses()
  const processByPid = new Map(processes.map((processInfo) => [processInfo.pid, processInfo]))
  const vitestMatches = processes.filter((processInfo) => {
    const { command } = processInfo
    if (command.includes('/bin/zsh') || command.includes('/bin/bash')) return false
    if (command.includes('scripts/cleanup-vitest.mjs')) return false
    if (command.includes('claude/shell-snapshots')) return false
    if (command.includes('grep')) return false
    if (!belongsToCurrentWorkspace(processInfo, processByPid)) return false
    if (/vitest(?!\s+run)/.test(command)) return true
    if (/node.*vitest.*worker/i.test(command)) return true
    if (/vitest.*--pool/i.test(command)) return true
    if (/vitest\/dist\/workers\//.test(command)) return true
    return false
  })

  if (vitestMatches.length === 0) {
    console.log('[cleanup-vitest] No lingering Vitest processes found. \u2713')
    process.exit(0)
  }

  console.log(`[cleanup-vitest] Found ${vitestMatches.length} lingering Vitest processes...`)
  for (const { pid, command } of vitestMatches) {
    try {
      process.kill(pid, 'SIGTERM')
      console.log(`  - Sent SIGTERM to PID ${pid}`)
      console.log(`    ${command.slice(0, 80)}${command.length > 80 ? '...' : ''}`)
    } catch (error) {
      if (error.code !== 'ESRCH') {
        console.warn(`  - Failed to terminate PID ${pid}: ${error.message}`)
      }
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 500))
  const remainingProcesses = listProcesses()
  const stillRunning = vitestMatches.filter(({ pid }) =>
    remainingProcesses.some((processInfo) => processInfo.pid === pid)
  )

  if (stillRunning.length > 0) {
    console.log(`[cleanup-vitest] Force-killing ${stillRunning.length} unresponsive processes...`)
    for (const { pid } of stillRunning) {
      try {
        process.kill(pid, 'SIGKILL')
        console.log(`  - Sent SIGKILL to PID ${pid}`)
      } catch (error) {
        if (error.code !== 'ESRCH') {
          console.warn(`  - Failed to kill PID ${pid}: ${error.message}`)
        }
      }
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 200))
  console.log('[cleanup-vitest] Cleanup complete. \u2713')
  process.exit(0)
})()
