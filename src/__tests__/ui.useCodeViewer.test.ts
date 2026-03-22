import { useCodeViewer } from '@/components/ui/useCodeViewer'
import type { SourceTab } from '@/types/animation'
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const mockSources: SourceTab[] = [
  { label: 'Component', code: 'const x = 1', language: 'tsx' },
  { label: 'CSS', code: '.foo {}', language: 'css' },
]

describe('useCodeViewer', () => {
  describe('initial state', () => {
    it('starts closed with null sources', () => {
      const { result } = renderHook(() => useCodeViewer(vi.fn().mockResolvedValue(mockSources)))

      expect(result.current.isOpen).toBe(false)
      expect(result.current.sources).toBeNull()
    })
  })

  describe('open()', () => {
    it('loads sources and opens the modal', async () => {
      const loader = vi.fn().mockResolvedValue(mockSources)
      const { result } = renderHook(() => useCodeViewer(loader))

      await act(async () => {
        await result.current.open()
      })

      expect(loader).toHaveBeenCalledOnce()
      expect(result.current.isOpen).toBe(true)
      expect(result.current.sources).toEqual(mockSources)
    })

    it('caches sources across subsequent opens (loader called only once)', async () => {
      const loader = vi.fn().mockResolvedValue(mockSources)
      const { result } = renderHook(() => useCodeViewer(loader))

      // First open: loads sources
      await act(async () => {
        await result.current.open()
      })
      expect(loader).toHaveBeenCalledOnce()

      // Close
      act(() => {
        result.current.close()
      })
      expect(result.current.isOpen).toBe(false)

      // Second open: reuses cached sources, does NOT call loader again
      await act(async () => {
        await result.current.open()
      })
      expect(loader).toHaveBeenCalledOnce() // still only 1 call
      expect(result.current.isOpen).toBe(true)
      expect(result.current.sources).toEqual(mockSources)
    })

    it('does nothing when no sourceLoader is provided', async () => {
      const { result } = renderHook(() => useCodeViewer(undefined))

      await act(async () => {
        await result.current.open()
      })

      // Should remain closed with null sources
      expect(result.current.isOpen).toBe(false)
      expect(result.current.sources).toBeNull()
    })

    it('handles sourceLoader that returns empty array', async () => {
      const loader = vi.fn().mockResolvedValue([])
      const { result } = renderHook(() => useCodeViewer(loader))

      await act(async () => {
        await result.current.open()
      })

      expect(result.current.isOpen).toBe(true)
      expect(result.current.sources).toEqual([])
    })
  })

  describe('close()', () => {
    it('sets isOpen to false but preserves sources', async () => {
      const loader = vi.fn().mockResolvedValue(mockSources)
      const { result } = renderHook(() => useCodeViewer(loader))

      await act(async () => {
        await result.current.open()
      })

      act(() => {
        result.current.close()
      })

      expect(result.current.isOpen).toBe(false)
      // Sources are still cached
      expect(result.current.sources).toEqual(mockSources)
    })

    it('close is idempotent (calling close when already closed is a no-op)', () => {
      const { result } = renderHook(() => useCodeViewer(vi.fn()))

      act(() => {
        result.current.close()
      })

      expect(result.current.isOpen).toBe(false)
    })
  })

  describe('callback stability', () => {
    it('open and close maintain stable references across re-renders', () => {
      const loader = vi.fn().mockResolvedValue(mockSources)
      const { result, rerender } = renderHook(() => useCodeViewer(loader))

      const firstOpen = result.current.open
      const firstClose = result.current.close
      rerender()

      // close should be stable (wrapped in useCallback with no deps)
      expect(result.current.close).toBe(firstClose)
      // open depends on [sourceLoader, sources], so reference may change
      // when sourceLoader reference changes. With the same reference, it should be stable.
      expect(result.current.open).toBe(firstOpen)
    })

    it('open reference updates when sourceLoader changes', () => {
      const loader1 = vi.fn().mockResolvedValue(mockSources)
      const loader2 = vi.fn().mockResolvedValue([])

      const { result, rerender } = renderHook(({ loader }) => useCodeViewer(loader), {
        initialProps: { loader: loader1 },
      })

      const firstOpen = result.current.open
      rerender({ loader: loader2 })

      // open should be a new reference since sourceLoader changed
      expect(result.current.open).not.toBe(firstOpen)
    })

    it('open reference changes after sources are loaded (sources dependency)', async () => {
      const loader = vi.fn().mockResolvedValue(mockSources)
      const { result } = renderHook(() => useCodeViewer(loader))

      const openBeforeLoad = result.current.open

      await act(async () => {
        await result.current.open()
      })

      // After loading, sources changed from null to mockSources,
      // which changes the open callback reference (useCallback dep: [sourceLoader, sources])
      const openAfterLoad = result.current.open
      expect(openAfterLoad).not.toBe(openBeforeLoad)
      // close should remain stable
    })
  })

  describe('concurrent calls', () => {
    it('calls sourceLoader twice when open() is invoked concurrently before state updates', async () => {
      // This documents a real behavior: since sources state hasn't updated between
      // the two synchronous open() calls, both will check `!sources` as true and
      // call the loader. This is a known trade-off of the current implementation.
      let resolveFirst: (value: SourceTab[]) => void
      let resolveSecond: (value: SourceTab[]) => void
      let callCount = 0

      const loader = vi.fn().mockImplementation(
        () =>
          new Promise<SourceTab[]>((resolve) => {
            callCount++
            if (callCount === 1) resolveFirst = resolve
            else resolveSecond = resolve
          })
      )

      const { result } = renderHook(() => useCodeViewer(loader))

      // Start two concurrent opens
      let open1Done = false
      let open2Done = false

      act(() => {
        result.current.open().then(() => {
          open1Done = true
        })
        result.current.open().then(() => {
          open2Done = true
        })
      })

      // Both calls were initiated because sources was null for both
      expect(loader).toHaveBeenCalledTimes(2)

      // Resolve both
      await act(async () => {
        resolveFirst!(mockSources)
        resolveSecond!(mockSources)
      })

      expect(open1Done).toBe(true)
      expect(open2Done).toBe(true)
      expect(result.current.isOpen).toBe(true)
      expect(result.current.sources).toEqual(mockSources)
    })
  })

  describe('error handling', () => {
    it('catches sourceLoader errors, logs them via logger.error, and does not open the modal', async () => {
      const { logger } = await import('@/services/logger')
      const logSpy = vi.spyOn(logger, 'error').mockImplementation(() => {})

      const networkError = new Error('network failure')
      const loader = vi.fn().mockRejectedValue(networkError)
      const { result } = renderHook(() => useCodeViewer(loader))

      await act(async () => {
        await result.current.open()
      })

      // Modal should NOT open after a failed load
      expect(result.current.isOpen).toBe(false)
      // Sources remain null after failed load
      expect(result.current.sources).toBeNull()
      // logger.error must have been called with the error — catches silent error swallowing
      expect(logSpy).toHaveBeenCalledOnce()
      expect(logSpy).toHaveBeenCalledWith('Failed to load animation source code', networkError)

      logSpy.mockRestore()
    })

    it('retries loading after a failure (sources stay null, so next open re-fetches)', async () => {
      const loader = vi
        .fn()
        .mockRejectedValueOnce(new Error('first failure'))
        .mockResolvedValueOnce(mockSources)

      const { result } = renderHook(() => useCodeViewer(loader))

      // First attempt fails
      await act(async () => {
        await result.current.open()
      })
      expect(result.current.isOpen).toBe(false)
      expect(result.current.sources).toBeNull()

      // Second attempt succeeds (sources was null, so loader is called again)
      await act(async () => {
        await result.current.open()
      })
      expect(result.current.isOpen).toBe(true)
      expect(result.current.sources).toEqual(mockSources)
      expect(loader).toHaveBeenCalledTimes(2)
    })
  })

  describe('sourceLoader change without remount', () => {
    it('uses stale cache when sourceLoader changes but sources are already loaded', async () => {
      // This documents the design trade-off: useCodeViewer caches sources in state.
      // When the sourceLoader prop changes, the cached sources remain because
      // the !sources guard prevents re-fetching. In practice, this is fine because
      // each AnimationCard remounts on navigation (resetting state), but this test
      // documents the behavior for consumers who might reuse the hook across loaders.
      const sources1: SourceTab[] = [{ label: 'V1', code: 'v1', language: 'tsx' }]
      const sources2: SourceTab[] = [{ label: 'V2', code: 'v2', language: 'tsx' }]
      const loader1 = vi.fn().mockResolvedValue(sources1)
      const loader2 = vi.fn().mockResolvedValue(sources2)

      const { result, rerender } = renderHook(({ loader }) => useCodeViewer(loader), {
        initialProps: { loader: loader1 },
      })

      // Load sources from loader1
      await act(async () => {
        await result.current.open()
      })
      expect(result.current.sources).toEqual(sources1)
      expect(loader1).toHaveBeenCalledOnce()

      // Close and switch loader
      act(() => {
        result.current.close()
      })
      rerender({ loader: loader2 })

      // Open again — should NOT call loader2 because sources are cached
      await act(async () => {
        await result.current.open()
      })
      expect(loader2).not.toHaveBeenCalled()
      expect(result.current.sources).toEqual(sources1) // still v1
    })
  })

  describe('unmount during loading', () => {
    it('does not crash when component unmounts while sourceLoader is pending', async () => {
      let resolveLoader!: (value: SourceTab[]) => void
      const loader = vi.fn().mockImplementation(
        () =>
          new Promise<SourceTab[]>((resolve) => {
            resolveLoader = resolve
          })
      )

      const { result, unmount } = renderHook(() => useCodeViewer(loader))

      // Start loading
      await act(async () => {
        // Fire the open call which starts the async loader
        void result.current.open()
        // Unmount immediately while the loader is still pending
        unmount()
        // Resolve the loader after unmount — React 19 handles state updates
        // on unmounted components gracefully (no-op), so this should not throw
        resolveLoader(mockSources)
      })
    })
  })
})
