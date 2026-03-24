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
      // Error state exposes the failure message for UI display
      expect(result.current.error).toBe('network failure')
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
      expect(result.current.error).toBe('first failure')

      // Second attempt succeeds (sources was null, so loader is called again)
      await act(async () => {
        await result.current.open()
      })
      expect(result.current.isOpen).toBe(true)
      expect(result.current.sources).toEqual(mockSources)
      // Error is cleared on successful load
      expect(result.current.error).toBeNull()
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

  describe('sourceLoader returning null or undefined', () => {
    it('sourceLoader returning null causes open to re-fetch on every call (known limitation)', async () => {
      // KNOWN BEHAVIOR: If sourceLoader resolves with null, setSources(null) is called.
      // On the next open(), !sources is still true, so the loader is called again.
      // This creates a retry loop — each open() call invokes the loader.
      // This documents the behavior rather than asserting it should be fixed,
      // because in practice all sourceLoaders return SourceTab[] arrays.
      const loader = vi.fn().mockResolvedValue(null)
      const { result } = renderHook(() => useCodeViewer(loader))

      // First open: loads and sets sources to null
      await act(async () => {
        await result.current.open()
      })
      expect(loader).toHaveBeenCalledTimes(1)
      // isOpen is set to true because the load "succeeded" (no error thrown)
      expect(result.current.isOpen).toBe(true)
      // sources is null because the loader returned null
      expect(result.current.sources).toBeNull()

      // Close
      act(() => {
        result.current.close()
      })

      // Second open: !sources is still true → loader is called again
      await act(async () => {
        await result.current.open()
      })
      expect(loader).toHaveBeenCalledTimes(2)
    })

    it('sourceLoader returning undefined behaves like null (re-fetches each open)', async () => {
      const loader = vi.fn().mockResolvedValue(undefined)
      const { result } = renderHook(() => useCodeViewer(loader))

      await act(async () => {
        await result.current.open()
      })
      // undefined is falsy → !sources is true → would re-fetch
      expect(result.current.isOpen).toBe(true)
      // setSources(undefined) produces a falsy sources value, so re-open will re-fetch.
      // The behavioral proof is at the end: loader is called twice.

      act(() => {
        result.current.close()
      })

      await act(async () => {
        await result.current.open()
      })
      // Loader called again because sources is still falsy
      expect(loader).toHaveBeenCalledTimes(2)
    })
  })

  describe('open while already open', () => {
    it('calling open() while already open with cached sources is a no-op (no re-fetch)', async () => {
      const loader = vi.fn().mockResolvedValue(mockSources)
      const { result } = renderHook(() => useCodeViewer(loader))

      // First open: loads sources
      await act(async () => {
        await result.current.open()
      })
      expect(loader).toHaveBeenCalledOnce()
      expect(result.current.isOpen).toBe(true)

      // Second open while already open: sources are cached, should not re-fetch
      await act(async () => {
        await result.current.open()
      })
      expect(loader).toHaveBeenCalledOnce() // still 1
      expect(result.current.isOpen).toBe(true)
    })
  })

  describe('concurrent resolution ordering', () => {
    it('first-to-resolve wins when two concurrent open() calls race', async () => {
      // When two open() calls race, both call the loader (documented behavior).
      // The last setSources call wins. Both resolve with the same data in practice,
      // but this test verifies no state corruption when they resolve in different orders.
      const sources1: SourceTab[] = [{ label: 'First', code: 'first', language: 'tsx' }]
      const sources2: SourceTab[] = [{ label: 'Second', code: 'second', language: 'tsx' }]

      let resolveFirst!: (value: SourceTab[]) => void
      let resolveSecond!: (value: SourceTab[]) => void
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
      act(() => {
        void result.current.open()
        void result.current.open()
      })

      // Resolve second before first (out of order)
      await act(async () => {
        resolveSecond(sources2)
      })

      // First resolution arrives late
      await act(async () => {
        resolveFirst(sources1)
      })

      // Modal should be open — last setSources call wins (sources1, resolved second)
      expect(result.current.isOpen).toBe(true)
      expect(result.current.sources).toEqual(sources1)
    })
  })

  describe('close during load', () => {
    it('close() before loader resolves keeps modal closed but caches the sources', async () => {
      // close() invalidates the pending open(), so when the loader resolves
      // the modal stays closed. Sources are still cached for the next open().
      let resolveLoader!: (value: SourceTab[]) => void
      const loader = vi.fn().mockImplementation(
        () =>
          new Promise<SourceTab[]>((resolve) => {
            resolveLoader = resolve
          })
      )

      const { result } = renderHook(() => useCodeViewer(loader))

      // Start open (loader is pending)
      act(() => {
        void result.current.open()
      })

      // Close before loader resolves
      act(() => {
        result.current.close()
      })
      expect(result.current.isOpen).toBe(false)

      // Loader resolves — sources are cached but modal stays closed
      await act(async () => {
        resolveLoader(mockSources)
      })

      expect(result.current.isOpen).toBe(false)
      expect(result.current.sources).toEqual(mockSources)

      // Next open() uses cached sources and opens immediately
      await act(async () => {
        await result.current.open()
      })
      expect(result.current.isOpen).toBe(true)
      expect(result.current.sources).toEqual(mockSources)
      expect(loader).toHaveBeenCalledTimes(1)
    })
  })
})
