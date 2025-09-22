import { useAnimations } from '@/hooks/useAnimations'
import { animationDataService } from '@/services/animationData'
import { act, renderHook } from '@testing-library/react'

describe('hooks • useAnimations', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.useRealTimers()
  })

  it('loads categories on mount and exposes refresh', async () => {
    const { result } = renderHook(() => useAnimations())

    // Initial loading true
    expect(result.current.isLoading).toBe(true)
    expect(result.current.categories).toEqual([])

    // Resolve initial load (animationDataService has 120ms delay)
    await act(async () => {
      jest.advanceTimersByTime(130)
      await Promise.resolve()
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.categories.length).toBeGreaterThan(0)

    // Trigger refresh path (60ms)
    await act(async () => {
      const p = result.current.refreshAnimations()
      jest.advanceTimersByTime(70)
      await p
    })
    expect(result.current.isLoading).toBe(false)
  })

  it('sets error on failure', async () => {
    const spy = jest.spyOn(animationDataService, 'loadAnimations').mockRejectedValueOnce(new Error('boom'))
    const { result } = renderHook(() => useAnimations())
    await act(async () => {
      jest.advanceTimersByTime(130)
      await Promise.resolve()
    })
    expect(result.current.error).toBe('boom')
    spy.mockRestore()
  })
})
