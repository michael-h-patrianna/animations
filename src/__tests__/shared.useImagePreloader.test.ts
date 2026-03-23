import { useImagePreloader } from '@/components/rewards/collection-effects/SharedImagePreloader'
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Track created Image instances and their handlers
let imageInstances: Array<{
  src: string
  onload: (() => void) | null
  onerror: (() => void) | null
}>

beforeEach(() => {
  vi.useFakeTimers()
  imageInstances = []

  vi.stubGlobal(
    'Image',
    class MockImage {
      src = ''
      onload: (() => void) | null = null
      onerror: (() => void) | null = null

      constructor() {
        imageInstances.push(this as unknown as (typeof imageInstances)[number])
      }
    }
  )
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('useImagePreloader', () => {
  describe('empty or undefined images', () => {
    it('returns ready=true immediately when images is undefined', () => {
      const { result } = renderHook(() => useImagePreloader(undefined))

      expect(result.current.ready).toBe(true)
      expect(result.current.timedOut).toBe(false)
    })

    it('returns ready=true immediately when images is empty array', () => {
      const { result } = renderHook(() => useImagePreloader([]))

      expect(result.current.ready).toBe(true)
      expect(result.current.timedOut).toBe(false)
    })
  })

  describe('successful image loading', () => {
    it('starts not-ready when images are provided', () => {
      const { result } = renderHook(() => useImagePreloader(['img.png']))

      expect(result.current.ready).toBe(false)
      expect(result.current.timedOut).toBe(false)
    })

    it('assigns correct src to each Image instance', () => {
      renderHook(() => useImagePreloader(['a.png', 'b.png', 'c.png']))

      expect(imageInstances).toHaveLength(3)
      expect(imageInstances[0]!.src).toBe('a.png')
      expect(imageInstances[1]!.src).toBe('b.png')
      expect(imageInstances[2]!.src).toBe('c.png')
    })

    it('sets ready=true when all images load successfully', async () => {
      const { result } = renderHook(() => useImagePreloader(['img1.png', 'img2.png']))

      expect(result.current.ready).toBe(false)

      // Simulate all images loading and flush the promise chain
      await act(async () => {
        for (const img of imageInstances) {
          img.onload?.()
        }
        // Flush microtasks so Promise.all resolves
        await vi.advanceTimersByTimeAsync(0)
      })

      expect(result.current.ready).toBe(true)
      expect(result.current.timedOut).toBe(false)
    })
  })

  describe('image load errors (graceful fallback)', () => {
    it('resolves gracefully when images fail to load (onerror resolves the promise)', async () => {
      const { result } = renderHook(() => useImagePreloader(['broken.png']))

      expect(result.current.ready).toBe(false)

      await act(async () => {
        imageInstances[0]!.onerror?.()
        await vi.advanceTimersByTimeAsync(0)
      })

      // onerror calls resolve() — so Promise.all resolves, making ready=true
      expect(result.current.ready).toBe(true)
      expect(result.current.timedOut).toBe(false)
    })

    it('resolves when some images succeed and some fail', async () => {
      const { result } = renderHook(() => useImagePreloader(['good.png', 'bad.png']))

      await act(async () => {
        imageInstances[0]!.onload?.()
        imageInstances[1]!.onerror?.()
        await vi.advanceTimersByTimeAsync(0)
      })

      expect(result.current.ready).toBe(true)
      expect(result.current.timedOut).toBe(false)
    })
  })

  describe('timeout behavior', () => {
    it('sets timedOut=true and ready=true after default timeout (3000ms)', () => {
      const { result } = renderHook(() => useImagePreloader(['slow.png']))

      expect(result.current.ready).toBe(false)
      expect(result.current.timedOut).toBe(false)

      act(() => {
        vi.advanceTimersByTime(3100)
      })

      expect(result.current.ready).toBe(true)
      expect(result.current.timedOut).toBe(true)
    })

    it('respects custom timeout parameter', () => {
      const { result } = renderHook(() => useImagePreloader(['slow.png'], 1000))

      act(() => {
        vi.advanceTimersByTime(1100)
      })

      expect(result.current.timedOut).toBe(true)
      expect(result.current.ready).toBe(true)
    })

    it('does not set timedOut before timeout elapses', () => {
      const { result } = renderHook(() => useImagePreloader(['slow.png'], 5000))

      act(() => {
        vi.advanceTimersByTime(4000)
      })

      expect(result.current.timedOut).toBe(false)
      expect(result.current.ready).toBe(false)
    })
  })

  describe('cleanup on unmount', () => {
    it('does not crash when images load after unmount (cancelledRef guard)', async () => {
      const { unmount } = renderHook(() => useImagePreloader(['pending.png']))

      unmount()

      // Simulate late image load after unmount — should not crash
      await act(async () => {
        imageInstances[0]!.onload?.()
        await vi.advanceTimersByTimeAsync(0)
      })
    })

    it('does not crash when timeout fires after unmount (cancelledRef guard)', () => {
      const { unmount } = renderHook(() => useImagePreloader(['pending.png'], 1000))

      unmount()

      // Advance past timeout — should not crash because cleanup cleared the timeout
      act(() => {
        vi.advanceTimersByTime(2000)
      })
    })

    it('clears timeout on unmount', () => {
      const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout')
      const { unmount } = renderHook(() => useImagePreloader(['pending.png']))

      unmount()

      expect(clearTimeoutSpy).toHaveBeenCalled()
      clearTimeoutSpy.mockRestore()
    })
  })

  describe('single image scenarios', () => {
    it('handles single image that loads', async () => {
      const { result } = renderHook(() => useImagePreloader(['one.png']))

      await act(async () => {
        imageInstances[0]!.onload?.()
        await vi.advanceTimersByTimeAsync(0)
      })

      expect(result.current.ready).toBe(true)
    })

    it('handles single image that errors', async () => {
      const { result } = renderHook(() => useImagePreloader(['fail.png']))

      await act(async () => {
        imageInstances[0]!.onerror?.()
        await vi.advanceTimersByTimeAsync(0)
      })

      expect(result.current.ready).toBe(true)
    })
  })
})
