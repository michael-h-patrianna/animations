import type { ErrorInfo } from 'react'
import type { AppError } from '@/services/errorTracking'
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
    const [mod, loggerMod] = await Promise.all([
      import('@/services/errorTracking'),
      import('@/services/logger'),
    ])
    reportRuntimeError = mod.reportRuntimeError

    const logCalls: { level: string; message: string; args: unknown[] }[] = []
    loggerMod.logger.setSink((level, message, ...args) => {
      logCalls.push({ level, message, args })
    })

    const brokenReporter = vi.fn(() => {
      throw new Error('reporter internal failure')
    })
    ;(window as WindowWithReporter).__PF_ANIM_RUNTIME_ERROR_REPORTER__ = brokenReporter

    // Should not throw, even though the reporter throws
    expect(() => reportRuntimeError(testError, testErrorInfo)).not.toThrow()

    // Should log the error via logger
    expect(logCalls).toHaveLength(1)
    expect(logCalls[0]!.level).toBe('error')
    expect(logCalls[0]!.message).toBe('Runtime error reporter failed:')
    expect((logCalls[0]!.args[0] as Error).message).toBe('reporter internal failure')

    loggerMod.logger.resetSink()
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

describe('reportAppError', () => {
  let reportAppError: typeof import('@/services/errorTracking').reportAppError

  beforeEach(async () => {
    vi.resetModules()
    const mod = await import('@/services/errorTracking')
    reportAppError = mod.reportAppError
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    delete (window as WindowWithReporter).__PF_ANIM_RUNTIME_ERROR_REPORTER__
  })

  it('logs GROUP_LOAD_FAILURE with group ID in message', async () => {
    const loggerMod = await import('@/services/logger')
    const logCalls: { level: string; message: string }[] = []
    loggerMod.logger.setSink((level, message) => {
      logCalls.push({ level, message })
    })

    const error: AppError = {
      type: 'GROUP_LOAD_FAILURE',
      groupId: 'modal-base-framer',
      cause: new Error('Failed to fetch'),
      timestamp: 1000,
    }

    reportAppError(error)

    expect(logCalls).toHaveLength(1)
    expect(logCalls[0]!.message).toContain('GROUP_LOAD_FAILURE')
    expect(logCalls[0]!.message).toContain('modal-base-framer')
    expect(logCalls[0]!.message).toContain('Failed to fetch')

    loggerMod.logger.resetSink()
  })

  it('logs ANIMATION_RENDER_CRASH with animation ID in message', async () => {
    const loggerMod = await import('@/services/logger')
    const logCalls: { level: string; message: string }[] = []
    loggerMod.logger.setSink((level, message) => {
      logCalls.push({ level, message })
    })

    const error: AppError = {
      type: 'ANIMATION_RENDER_CRASH',
      animationId: 'modal-base__scale-gentle-pop',
      cause: new Error('Cannot read properties'),
      componentStack: '\n    at Foo',
      timestamp: 2000,
    }

    reportAppError(error)

    expect(logCalls[0]!.message).toContain('ANIMATION_RENDER_CRASH')
    expect(logCalls[0]!.message).toContain('modal-base__scale-gentle-pop')

    loggerMod.logger.resetSink()
  })

  it('logs SOURCE_LOAD_FAILURE with animation ID in message', async () => {
    const loggerMod = await import('@/services/logger')
    const logCalls: { level: string; message: string }[] = []
    loggerMod.logger.setSink((level, message) => {
      logCalls.push({ level, message })
    })

    reportAppError({
      type: 'SOURCE_LOAD_FAILURE',
      animationId: 'lights__circle-static-1',
      cause: new Error('404'),
      timestamp: 3000,
    })

    expect(logCalls[0]!.message).toContain('SOURCE_LOAD_FAILURE')
    expect(logCalls[0]!.message).toContain('lights__circle-static-1')

    loggerMod.logger.resetSink()
  })

  it('logs METADATA_VALIDATION_ERROR with violations joined', async () => {
    const loggerMod = await import('@/services/logger')
    const logCalls: { level: string; message: string }[] = []
    loggerMod.logger.setSink((level, message) => {
      logCalls.push({ level, message })
    })

    reportAppError({
      type: 'METADATA_VALIDATION_ERROR',
      filePath: './framer/Bad.meta.ts',
      violations: ['tier must be 1-4', 'id must contain "__"'],
      timestamp: 4000,
    })

    expect(logCalls[0]!.message).toContain('METADATA_VALIDATION_ERROR')
    expect(logCalls[0]!.message).toContain('tier must be 1-4')
    expect(logCalls[0]!.message).toContain('id must contain "__"')

    loggerMod.logger.resetSink()
  })

  it('passes structured event data as second argument', async () => {
    const loggerMod = await import('@/services/logger')
    const logArgs: unknown[][] = []
    loggerMod.logger.setSink((_level, _message, ...args) => {
      logArgs.push(args)
    })

    const error: AppError = {
      type: 'GROUP_LOAD_FAILURE',
      groupId: 'test',
      cause: new Error('x'),
      timestamp: 5000,
    }

    reportAppError(error)

    expect(logArgs[0]![0]).toEqual({ event: error })

    loggerMod.logger.resetSink()
  })
})
