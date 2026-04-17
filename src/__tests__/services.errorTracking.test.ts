import type { ErrorInfo } from 'react'
import type { AppError } from '@/services/errorTracking'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Toggling import.meta.env.PROD requires vi.stubEnv plus a fresh module import
// per test so the frozen env is read by the newly-loaded module graph.

type WindowWithReporter = Window & {
  __PF_ANIM_RUNTIME_ERROR_REPORTER__?: (error: Error, errorInfo: ErrorInfo) => void
}

const testError = new Error('test component crash')

describe('reportAppError — host reporter forwarding', () => {
  let reportAppError: typeof import('@/services/errorTracking').reportAppError

  beforeEach(async () => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    delete (window as WindowWithReporter).__PF_ANIM_RUNTIME_ERROR_REPORTER__
  })

  it('does not forward ANIMATION_RENDER_CRASH to host reporter in dev', async () => {
    vi.stubEnv('PROD', false)
    const mod = await import('@/services/errorTracking')
    reportAppError = mod.reportAppError

    const reporter = vi.fn()
    ;(window as WindowWithReporter).__PF_ANIM_RUNTIME_ERROR_REPORTER__ = reporter

    reportAppError({
      type: 'ANIMATION_RENDER_CRASH',
      animationId: 'modal-base__scale-gentle-pop',
      cause: testError,
      componentStack: '\n  at Foo',
      timestamp: 1000,
    })

    expect(reporter).not.toHaveBeenCalled()
  })

  it('forwards ANIMATION_RENDER_CRASH to host reporter exactly once in prod', async () => {
    vi.stubEnv('PROD', true)
    const mod = await import('@/services/errorTracking')
    reportAppError = mod.reportAppError

    const reporter = vi.fn()
    ;(window as WindowWithReporter).__PF_ANIM_RUNTIME_ERROR_REPORTER__ = reporter

    reportAppError({
      type: 'ANIMATION_RENDER_CRASH',
      animationId: 'modal-base__scale-gentle-pop',
      cause: testError,
      componentStack: '\n  at Foo\n  at Bar',
      timestamp: 2000,
    })

    expect(reporter).toHaveBeenCalledOnce()
    expect(reporter).toHaveBeenCalledWith(testError, { componentStack: '\n  at Foo\n  at Bar' })
  })

  it('forwards with componentStack: null when omitted', async () => {
    vi.stubEnv('PROD', true)
    const mod = await import('@/services/errorTracking')
    reportAppError = mod.reportAppError

    const reporter = vi.fn()
    ;(window as WindowWithReporter).__PF_ANIM_RUNTIME_ERROR_REPORTER__ = reporter

    reportAppError({
      type: 'ANIMATION_RENDER_CRASH',
      animationId: 'x__y',
      cause: testError,
      timestamp: 3000,
    })

    expect(reporter).toHaveBeenCalledWith(testError, { componentStack: null })
  })

  it('does not forward non-crash error types to host reporter', async () => {
    vi.stubEnv('PROD', true)
    const mod = await import('@/services/errorTracking')
    reportAppError = mod.reportAppError

    const reporter = vi.fn()
    ;(window as WindowWithReporter).__PF_ANIM_RUNTIME_ERROR_REPORTER__ = reporter

    reportAppError({
      type: 'GROUP_LOAD_FAILURE',
      groupId: 'modal-base-framer',
      cause: testError,
      timestamp: 4000,
    })
    reportAppError({
      type: 'SOURCE_LOAD_FAILURE',
      animationId: 'x__y',
      cause: testError,
      timestamp: 5000,
    })
    reportAppError({
      type: 'METADATA_VALIDATION_ERROR',
      filePath: 'x.meta.ts',
      violations: ['bad'],
      timestamp: 6000,
    })

    expect(reporter).not.toHaveBeenCalled()
  })

  it('tolerates a missing host reporter in production', async () => {
    vi.stubEnv('PROD', true)
    const mod = await import('@/services/errorTracking')
    reportAppError = mod.reportAppError

    expect(() =>
      reportAppError({
        type: 'ANIMATION_RENDER_CRASH',
        animationId: 'x__y',
        cause: testError,
        timestamp: 7000,
      })
    ).not.toThrow()
  })

  it('catches host reporter exceptions and logs them instead of propagating', async () => {
    vi.stubEnv('PROD', true)
    const [mod, loggerMod] = await Promise.all([
      import('@/services/errorTracking'),
      import('@/services/logger'),
    ])
    reportAppError = mod.reportAppError

    const logCalls: { level: string; message: string; args: unknown[] }[] = []
    loggerMod.logger.setSink((level, message, ...args) => {
      logCalls.push({ level, message, args })
    })
    ;(window as WindowWithReporter).__PF_ANIM_RUNTIME_ERROR_REPORTER__ = () => {
      throw new Error('reporter internal failure')
    }

    expect(() =>
      reportAppError({
        type: 'ANIMATION_RENDER_CRASH',
        animationId: 'x__y',
        cause: testError,
        timestamp: 8000,
      })
    ).not.toThrow()

    // 1. the app-error summary 2. the reporter-failed entry
    expect(logCalls.map((c) => c.message)).toContain('Runtime error reporter failed:')
    const reporterLog = logCalls.find((c) => c.message === 'Runtime error reporter failed:')!
    expect(reporterLog.level).toBe('error')
    expect((reporterLog.args[0] as Error).message).toBe('reporter internal failure')

    loggerMod.logger.resetSink()
  })

  it('ignores non-function values on window.__PF_ANIM_RUNTIME_ERROR_REPORTER__', async () => {
    vi.stubEnv('PROD', true)
    const mod = await import('@/services/errorTracking')
    reportAppError = mod.reportAppError
    ;(window as WindowWithReporter).__PF_ANIM_RUNTIME_ERROR_REPORTER__ =
      'not a function' as unknown as (error: Error, errorInfo: ErrorInfo) => void

    expect(() =>
      reportAppError({
        type: 'ANIMATION_RENDER_CRASH',
        animationId: 'x__y',
        cause: testError,
        timestamp: 9000,
      })
    ).not.toThrow()
  })
})

describe('reportAppError — logger output', () => {
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
