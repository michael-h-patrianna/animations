import type { ErrorInfo } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// We need to test with import.meta.env.PROD toggled.
// Vitest doesn't easily toggle import.meta.env.PROD, so we mock it via vi.stubEnv.

type WindowWithReporter = Window & {
  __PF_ANIM_RUNTIME_ERROR_REPORTER__?: (error: Error, errorInfo: ErrorInfo) => void
}

const testError = new Error('test component crash')
const testErrorInfo: ErrorInfo = { componentStack: '\n  at Foo\n  at Bar' }

describe('reportRuntimeError', () => {
  let reportRuntimeError: typeof import('@/services/errorTracking').reportRuntimeError

  beforeEach(async () => {
    // Fresh import each test to reset module-level state
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    delete (window as WindowWithReporter).__PF_ANIM_RUNTIME_ERROR_REPORTER__
  })

  it('does nothing in non-production mode', async () => {
    vi.stubEnv('PROD', false)
    const mod = await import('@/services/errorTracking')
    reportRuntimeError = mod.reportRuntimeError

    const reporter = vi.fn()
    ;(window as WindowWithReporter).__PF_ANIM_RUNTIME_ERROR_REPORTER__ = reporter

    reportRuntimeError(testError, testErrorInfo)

    expect(reporter).not.toHaveBeenCalled()
  })

  it('calls window reporter in production mode', async () => {
    vi.stubEnv('PROD', true)
    const mod = await import('@/services/errorTracking')
    reportRuntimeError = mod.reportRuntimeError

    const reporter = vi.fn()
    ;(window as WindowWithReporter).__PF_ANIM_RUNTIME_ERROR_REPORTER__ = reporter

    reportRuntimeError(testError, testErrorInfo)

    expect(reporter).toHaveBeenCalledOnce()
    expect(reporter).toHaveBeenCalledWith(testError, testErrorInfo)
  })

  it('does nothing in production when no reporter is registered', async () => {
    vi.stubEnv('PROD', true)
    const mod = await import('@/services/errorTracking')
    reportRuntimeError = mod.reportRuntimeError

    // No reporter on window — should not throw
    expect(() => reportRuntimeError(testError, testErrorInfo)).not.toThrow()
  })

  it('catches and logs reporter errors instead of propagating', async () => {
    vi.stubEnv('PROD', true)
    const mod = await import('@/services/errorTracking')
    reportRuntimeError = mod.reportRuntimeError

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const brokenReporter = vi.fn(() => {
      throw new Error('reporter internal failure')
    })
    ;(window as WindowWithReporter).__PF_ANIM_RUNTIME_ERROR_REPORTER__ = brokenReporter

    // Should not throw, even though the reporter throws
    expect(() => reportRuntimeError(testError, testErrorInfo)).not.toThrow()

    // Should log the error
    expect(consoleErrorSpy).toHaveBeenCalledOnce()
    expect(consoleErrorSpy.mock.calls[0][0]).toBe('Runtime error reporter failed:')
    expect(consoleErrorSpy.mock.calls[0][1].message).toBe('reporter internal failure')

    consoleErrorSpy.mockRestore()
  })

  it('ignores non-function values on window.__PF_ANIM_RUNTIME_ERROR_REPORTER__', async () => {
    vi.stubEnv('PROD', true)
    const mod = await import('@/services/errorTracking')
    reportRuntimeError = mod.reportRuntimeError

    // Set to a non-function value
    ;(window as WindowWithReporter).__PF_ANIM_RUNTIME_ERROR_REPORTER__ =
      'not a function' as unknown as (error: Error, errorInfo: ErrorInfo) => void

    expect(() => reportRuntimeError(testError, testErrorInfo)).not.toThrow()
  })
})
