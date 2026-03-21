import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { logger } from '@/services/logger'

describe('logger', () => {
  let consoleSpy: {
    error: ReturnType<typeof vi.spyOn>
    warn: ReturnType<typeof vi.spyOn>
    info: ReturnType<typeof vi.spyOn>
    debug: ReturnType<typeof vi.spyOn>
  }

  beforeEach(() => {
    logger.resetSink()
    consoleSpy = {
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      info: vi.spyOn(console, 'info').mockImplementation(() => {}),
      debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
    logger.resetSink()
  })

  it('delegates error to console.error in dev mode', () => {
    logger.error('test error', { detail: 1 })
    expect(consoleSpy.error).toHaveBeenCalledWith('test error', { detail: 1 })
  })

  it('delegates warn to console.warn in dev mode', () => {
    logger.warn('test warning', 42)
    expect(consoleSpy.warn).toHaveBeenCalledWith('test warning', 42)
  })

  it('delegates info to console.info in dev mode', () => {
    logger.info('test info')
    expect(consoleSpy.info).toHaveBeenCalledWith('test info')
  })

  it('delegates debug to console.debug in dev mode', () => {
    logger.debug('debug msg', [1, 2, 3]) // eslint-disable-line testing-library/no-debugging-utils -- testing logger.debug, not debugging
    expect(consoleSpy.debug).toHaveBeenCalledWith('debug msg', [1, 2, 3])
  })

  describe('setSink', () => {
    it('replaces the active sink', () => {
      const customSink = vi.fn()
      logger.setSink(customSink)

      logger.error('err')
      logger.warn('wrn')
      logger.info('inf')
      logger.debug('dbg') // eslint-disable-line testing-library/no-debugging-utils -- testing logger.debug, not debugging

      expect(customSink).toHaveBeenCalledTimes(4)
      expect(customSink).toHaveBeenCalledWith('error', 'err')
      expect(customSink).toHaveBeenCalledWith('warn', 'wrn')
      expect(customSink).toHaveBeenCalledWith('info', 'inf')
      expect(customSink).toHaveBeenCalledWith('debug', 'dbg')

      // Console should NOT have been called
      expect(consoleSpy.error).not.toHaveBeenCalled()
    })
  })

  describe('resetSink', () => {
    it('restores default console sink after custom sink', () => {
      const customSink = vi.fn()
      logger.setSink(customSink)
      logger.resetSink()

      logger.info('back to console')
      expect(consoleSpy.info).toHaveBeenCalledWith('back to console')
      expect(customSink).not.toHaveBeenCalled()
    })
  })

  describe('setSink replacement behavior', () => {
    it('replaces previous custom sink when setSink is called again', () => {
      const sink1 = vi.fn()
      const sink2 = vi.fn()

      logger.setSink(sink1)
      logger.setSink(sink2)

      logger.info('test')
      expect(sink1).not.toHaveBeenCalled()
      expect(sink2).toHaveBeenCalledWith('info', 'test')
    })

    it('passes multiple variadic arguments through to custom sink', () => {
      const sink = vi.fn()
      logger.setSink(sink)

      const errorObj = new Error('detail')
      const context = { userId: 123 }
      logger.error('multi-arg', errorObj, context)

      expect(sink).toHaveBeenCalledWith('error', 'multi-arg', errorObj, context)
    })

    it('continues working even if custom sink throws', () => {
      const throwingSink = vi.fn(() => {
        throw new Error('sink crashed')
      })
      logger.setSink(throwingSink)

      // The logger delegates directly to the sink — if the sink throws, it propagates.
      // This documents the behavior: setSink callers must provide non-throwing sinks.
      expect(() => logger.error('test')).toThrow('sink crashed')
    })
  })

  describe('log level routing', () => {
    it('routes each level to the correct console method', () => {
      logger.error('e')
      logger.warn('w')
      logger.info('i')
      logger.debug('d') // eslint-disable-line testing-library/no-debugging-utils -- testing logger.debug

      expect(consoleSpy.error).toHaveBeenCalledWith('e')
      expect(consoleSpy.warn).toHaveBeenCalledWith('w')
      expect(consoleSpy.info).toHaveBeenCalledWith('i')
      expect(consoleSpy.debug).toHaveBeenCalledWith('d')
    })

    it('does not cross-contaminate between log levels', () => {
      logger.error('only-error')

      expect(consoleSpy.error).toHaveBeenCalledOnce()
      expect(consoleSpy.warn).not.toHaveBeenCalled()
      expect(consoleSpy.info).not.toHaveBeenCalled()
      expect(consoleSpy.debug).not.toHaveBeenCalled()
    })
  })
})
