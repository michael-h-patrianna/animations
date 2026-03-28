import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { importWithReload, clearStaleChunkFlag } from '@/lib/staleChunkReload'

const RELOAD_KEY = 'pf-chunk-reload'

describe('importWithReload', () => {
  let reloadSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    sessionStorage.clear()
    reloadSpy = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { ...window.location, reload: reloadSpy },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns the import result on success', async () => {
    const result = await importWithReload(() => Promise.resolve({ value: 42 }))
    expect(result).toEqual({ value: 42 })
    expect(reloadSpy).not.toHaveBeenCalled()
  })

  it('triggers reload on first chunk load error', async () => {
    const chunkError = new TypeError('Failed to fetch dynamically imported module /chunk-abc.js')

    // importWithReload calls reload() then returns a never-resolving promise.
    // Race it against a timeout to verify reload was called without hanging.
    const raceResult = await Promise.race([
      importWithReload(() => Promise.reject(chunkError)).then(() => 'resolved'),
      new Promise<string>((resolve) => setTimeout(() => resolve('timed-out'), 50)),
    ])

    expect(reloadSpy).toHaveBeenCalledOnce()
    expect(sessionStorage.getItem(RELOAD_KEY)).toBe('1')
    expect(raceResult).toBe('timed-out')
  })

  it('rethrows chunk load error when reload flag is already set', async () => {
    sessionStorage.setItem(RELOAD_KEY, '1')
    const chunkError = new TypeError('Failed to fetch dynamically imported module /chunk-xyz.js')

    await expect(importWithReload(() => Promise.reject(chunkError))).rejects.toThrow(chunkError)
    expect(reloadSpy).not.toHaveBeenCalled()
  })

  it('rethrows non-TypeError errors without triggering reload', async () => {
    const syntaxError = new SyntaxError('Unexpected token')

    await expect(importWithReload(() => Promise.reject(syntaxError))).rejects.toThrow(syntaxError)
    expect(reloadSpy).not.toHaveBeenCalled()
    expect(sessionStorage.getItem(RELOAD_KEY)).toBeNull()
  })

  it('rethrows TypeError with non-chunk message without triggering reload', async () => {
    const typeError = new TypeError('Cannot read properties of undefined')

    await expect(importWithReload(() => Promise.reject(typeError))).rejects.toThrow(typeError)
    expect(reloadSpy).not.toHaveBeenCalled()
  })

  it('detects Safari-style chunk error message', async () => {
    const safariError = new TypeError('Importing a module script failed')

    const raceResult = await Promise.race([
      importWithReload(() => Promise.reject(safariError)).then(() => 'resolved'),
      new Promise<string>((resolve) => setTimeout(() => resolve('timed-out'), 50)),
    ])

    expect(reloadSpy).toHaveBeenCalledOnce()
    expect(raceResult).toBe('timed-out')
  })

  it('detects Firefox-style chunk error message', async () => {
    const firefoxError = new TypeError('error loading dynamically imported module')

    const raceResult = await Promise.race([
      importWithReload(() => Promise.reject(firefoxError)).then(() => 'resolved'),
      new Promise<string>((resolve) => setTimeout(() => resolve('timed-out'), 50)),
    ])

    expect(reloadSpy).toHaveBeenCalledOnce()
    expect(raceResult).toBe('timed-out')
  })
})

describe('clearStaleChunkFlag', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('removes the reload flag from sessionStorage', () => {
    sessionStorage.setItem(RELOAD_KEY, '1')
    clearStaleChunkFlag()
    expect(sessionStorage.getItem(RELOAD_KEY)).toBeNull()
  })

  it('is safe to call when flag is not set', () => {
    clearStaleChunkFlag()
    expect(sessionStorage.getItem(RELOAD_KEY)).toBeNull()
  })
})
