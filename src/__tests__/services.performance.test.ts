import { describe, it, expect, vi, afterEach } from 'vitest'

vi.mock('web-vitals', () => ({
  onCLS: vi.fn(),
  onFCP: vi.fn(),
  onINP: vi.fn(),
  onLCP: vi.fn(),
  onTTFB: vi.fn(),
}))

describe('reportWebVitals', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('registers callbacks for all five Core Web Vitals', async () => {
    const webVitals = await import('web-vitals')
    const { reportWebVitals } = await import('@/services/performance')

    await reportWebVitals()

    expect(webVitals.onCLS).toHaveBeenCalledOnce()
    expect(webVitals.onFCP).toHaveBeenCalledOnce()
    expect(webVitals.onINP).toHaveBeenCalledOnce()
    expect(webVitals.onLCP).toHaveBeenCalledOnce()
    expect(webVitals.onTTFB).toHaveBeenCalledOnce()
  })

  it('report callback logs metric via logger.info', async () => {
    const webVitals = await import('web-vitals')
    const { logger } = await import('@/services/logger')
    const infoSpy = vi.spyOn(logger, 'info')

    const { reportWebVitals } = await import('@/services/performance')
    await reportWebVitals()

    // Extract the report callback passed to onCLS
    const reportFn = vi.mocked(webVitals.onCLS).mock.calls[0]![0]

    reportFn({ name: 'CLS', value: 0.05, rating: 'good' } as Parameters<typeof reportFn>[0])

    expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('[WebVital] CLS: 0.05'))
    expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('(good)'))

    infoSpy.mockRestore()
  })
})
