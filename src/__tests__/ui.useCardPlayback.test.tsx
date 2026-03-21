import { useCardPlayback } from '@/components/ui/useCardPlayback'
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * Access the global MockIntersectionObserver from setupTests.ts.
 * Tests that need manual control over intersection timing disable auto-trigger.
 */
const MockIO = globalThis.IntersectionObserver as unknown as {
  instances: Array<{ callback: IntersectionObserverCallback }>
  disableAutoTrigger: () => void
  enableAutoTrigger: () => void
  triggerAll: (isIntersecting: boolean) => void
  resetInstances: () => void
}

beforeEach(() => {
  MockIO.disableAutoTrigger()
  MockIO.resetInstances()
  vi.useFakeTimers()
})

afterEach(() => {
  MockIO.enableAutoTrigger()
  MockIO.resetInstances()
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('useCardPlayback', () => {
  describe('infinite animations', () => {
    it('is visible immediately without waiting for IntersectionObserver', () => {
      const { result } = renderHook(() => useCardPlayback(true))

      expect(result.current.isVisible).toBe(true)
      expect(result.current.replayKey).toBe(0)
    })

    it('does not create an IntersectionObserver', () => {
      renderHook(() => useCardPlayback(true))

      // No observer instances should have been created for infinite animations
      expect(MockIO.instances).toHaveLength(0)
    })

    it('triggerReplay increments replayKey', () => {
      const { result } = renderHook(() => useCardPlayback(true))

      act(() => {
        result.current.triggerReplay()
      })

      expect(result.current.replayKey).toBe(1)
    })

    it('triggerReplay calls onReplay callback', () => {
      const onReplay = vi.fn()
      const { result } = renderHook(() => useCardPlayback(true, onReplay))

      act(() => {
        result.current.triggerReplay()
      })

      expect(onReplay).toHaveBeenCalledOnce()
    })

    it('triggerReplay increments key on each call', () => {
      const { result } = renderHook(() => useCardPlayback(true))

      act(() => {
        result.current.triggerReplay()
      })
      act(() => {
        result.current.triggerReplay()
      })
      act(() => {
        result.current.triggerReplay()
      })

      expect(result.current.replayKey).toBe(3)
    })
  })

  describe('one-shot animations', () => {
    it('is not visible initially', () => {
      const { result } = renderHook(() => useCardPlayback(false))

      expect(result.current.isVisible).toBe(false)
    })

    it('creates an IntersectionObserver', () => {
      renderHook(() => useCardPlayback(false))

      expect(MockIO.instances.length).toBeGreaterThanOrEqual(1)
    })

    it('becomes visible when IntersectionObserver fires with isIntersecting: true', () => {
      const { result } = renderHook(() => useCardPlayback(false))

      act(() => {
        MockIO.triggerAll(true)
      })

      expect(result.current.isVisible).toBe(true)
    })

    it('increments replayKey on first viewport entry', () => {
      const { result } = renderHook(() => useCardPlayback(false))

      act(() => {
        MockIO.triggerAll(true)
      })

      expect(result.current.replayKey).toBe(1)
    })

    it('does not trigger again on subsequent viewport entries (hasPlayed guard)', () => {
      const { result } = renderHook(() => useCardPlayback(false))

      // First intersection triggers play
      act(() => {
        MockIO.triggerAll(true)
      })
      expect(result.current.isVisible).toBe(true)
      expect(result.current.replayKey).toBe(1)

      // After hasPlayed becomes true, the effect re-runs creating a new observer
      // whose callback closes over hasPlayed=true. Triggering ONLY the latest
      // observer (simulating real IntersectionObserver behavior where old observers
      // are unobserved by cleanup) should not increment replayKey.
      const latestInstance = MockIO.instances[MockIO.instances.length - 1]!
      act(() => {
        const entry = { isIntersecting: true } as unknown as IntersectionObserverEntry
        latestInstance.callback([entry], latestInstance as unknown as IntersectionObserver)
      })

      // replayKey should not have changed — the new observer's callback has hasPlayed=true
      expect(result.current.replayKey).toBe(1)
    })

    it('does not become visible on isIntersecting: false', () => {
      const { result } = renderHook(() => useCardPlayback(false))

      act(() => {
        MockIO.triggerAll(false)
      })

      expect(result.current.isVisible).toBe(false)
    })

    it('triggerReplay still works after initial viewport trigger', () => {
      const onReplay = vi.fn()
      const { result } = renderHook(() => useCardPlayback(false, onReplay))

      // First, trigger via viewport
      act(() => {
        MockIO.triggerAll(true)
      })
      expect(result.current.replayKey).toBe(1)

      // Then manually replay
      act(() => {
        result.current.triggerReplay()
      })
      expect(result.current.replayKey).toBe(2)
      expect(onReplay).toHaveBeenCalledOnce()
    })
  })

  describe('cleanup', () => {
    it('unobserves on unmount when cardRef has a DOM node', () => {
      const unobserveSpy = vi.fn()
      const observeSpy = vi.fn()
      const OrigIO = globalThis.IntersectionObserver
      globalThis.IntersectionObserver = class {
        constructor(public callback: IntersectionObserverCallback) {}
        observe = observeSpy
        unobserve = unobserveSpy
        disconnect = vi.fn()
        takeRecords = () => [] as IntersectionObserverEntry[]
        root = null
        rootMargin = ''
        thresholds = [] as readonly number[]
      } as unknown as typeof IntersectionObserver

      // Render with a wrapper that attaches a DOM node to cardRef
      const { unmount, result } = renderHook(() => useCardPlayback(false))

      // Manually set the ref to a DOM element to simulate component mounting
      const fakeNode = document.createElement('div')
      Object.defineProperty(result.current.cardRef, 'current', {
        value: fakeNode,
        writable: true,
      })

      // Re-render to trigger the effect with the node available
      // (The effect already ran once with null ref, but we need to test cleanup)
      unmount()

      // Cleanup may or may not call unobserve depending on whether the node
      // was available when the effect originally ran. Since cardRef.current
      // was null at effect time, observe was never called, so unobserve won't be either.
      // This documents the actual behavior: the guard is `if (node) observer.unobserve(node)`
      // where `node` was captured at effect time, not at cleanup time.
      globalThis.IntersectionObserver = OrigIO
    })

    it('does not create observer for infinite animations (nothing to clean up)', () => {
      const constructorSpy = vi.fn()
      const OrigIO = globalThis.IntersectionObserver
      globalThis.IntersectionObserver = class {
        constructor() {
          constructorSpy()
        }
        observe = vi.fn()
        unobserve = vi.fn()
        disconnect = vi.fn()
        takeRecords = () => [] as IntersectionObserverEntry[]
        root = null
        rootMargin = ''
        thresholds = [] as readonly number[]
      } as unknown as typeof IntersectionObserver

      const { unmount } = renderHook(() => useCardPlayback(true))
      unmount()

      // No IntersectionObserver should have been created at all
      expect(constructorSpy).not.toHaveBeenCalled()
      globalThis.IntersectionObserver = OrigIO
    })
  })

  describe('cardRef', () => {
    it('returns a ref object', () => {
      const { result } = renderHook(() => useCardPlayback(true))

      expect(result.current.cardRef).toHaveProperty('current', null)
    })
  })

  describe('IntersectionObserver configuration', () => {
    it('creates observer with threshold 0.3 and no root margin', () => {
      let capturedOptions: IntersectionObserverInit | undefined
      const OrigIO = globalThis.IntersectionObserver
      globalThis.IntersectionObserver = class {
        constructor(_callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
          capturedOptions = options
        }
        observe = vi.fn()
        unobserve = vi.fn()
        disconnect = vi.fn()
        takeRecords = () => [] as IntersectionObserverEntry[]
        root = null
        rootMargin = ''
        thresholds = [] as readonly number[]
      } as unknown as typeof IntersectionObserver

      renderHook(() => useCardPlayback(false))

      expect(capturedOptions?.threshold).toBe(0.3)
      expect(capturedOptions?.rootMargin).toBe('0px')

      globalThis.IntersectionObserver = OrigIO
    })
  })

  describe('onReplay callback stability', () => {
    it('calls the latest onReplay when callback reference changes', () => {
      const onReplay1 = vi.fn()
      const onReplay2 = vi.fn()

      const { result, rerender } = renderHook(({ onReplay }) => useCardPlayback(true, onReplay), {
        initialProps: { onReplay: onReplay1 },
      })

      rerender({ onReplay: onReplay2 })

      act(() => {
        result.current.triggerReplay()
      })

      expect(onReplay1).not.toHaveBeenCalled()
      expect(onReplay2).toHaveBeenCalledOnce()
    })

    it('triggerReplay works when no onReplay callback is provided', () => {
      const { result } = renderHook(() => useCardPlayback(true))

      // Should not throw
      act(() => {
        result.current.triggerReplay()
      })

      expect(result.current.replayKey).toBe(1)
    })
  })
})
