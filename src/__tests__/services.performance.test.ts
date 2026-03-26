import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { markAnimationStart, markAnimationEnd } from '@/services/performance'

describe('Animation performance marks', () => {
  beforeEach(() => {
    vi.spyOn(performance, 'mark')
    vi.spyOn(performance, 'measure').mockReturnValue({
      duration: 42.5,
      entryType: 'measure',
      name: 'test',
      startTime: 0,
      toJSON: () => ({}),
      detail: null,
    })
    vi.spyOn(performance, 'clearMarks')
    vi.spyOn(performance, 'clearMeasures')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates a start mark with the animation ID', () => {
    markAnimationStart('modal-base__scale-gentle-pop')

    expect(performance.mark).toHaveBeenCalledWith('animation-start:modal-base__scale-gentle-pop')
  })

  it('measures duration between start and end marks', () => {
    markAnimationStart('test-anim')
    const duration = markAnimationEnd('test-anim')

    expect(performance.measure).toHaveBeenCalledWith(
      'animation:test-anim',
      'animation-start:test-anim',
      'animation-end:test-anim'
    )
    expect(duration).toBe(42.5)
  })

  it('cleans up marks and measures after measurement', () => {
    markAnimationStart('cleanup-test')
    markAnimationEnd('cleanup-test')

    expect(performance.clearMarks).toHaveBeenCalledWith('animation-start:cleanup-test')
    expect(performance.clearMarks).toHaveBeenCalledWith('animation-end:cleanup-test')
    expect(performance.clearMeasures).toHaveBeenCalledWith('animation:cleanup-test')
  })

  it('skips cleanup when start mark is missing and measure throws', () => {
    vi.mocked(performance.measure).mockImplementation(() => {
      throw new DOMException('mark not found')
    })

    markAnimationEnd('missing-start')

    // When measure throws (start mark missing), clearMarks/clearMeasures are skipped
    // because the error is caught before cleanup runs — verifying error path behavior
    expect(performance.clearMarks).not.toHaveBeenCalled()
    expect(performance.clearMeasures).not.toHaveBeenCalled()
  })
})
