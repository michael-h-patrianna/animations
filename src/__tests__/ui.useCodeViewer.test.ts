import { useCodeViewer } from '@/components/ui/useCodeViewer'
import type { SourceTab } from '@/types/animation'
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const mockSources: SourceTab[] = [
  { label: 'Component (Motion)', code: 'const x = 1', language: 'tsx' },
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
    it('catches sourceLoader errors, logs them, and does not open the modal', async () => {
      const loader = vi.fn().mockRejectedValue(new Error('network failure'))
      const { result } = renderHook(() => useCodeViewer(loader))

      // The hook catches errors internally — no unhandled rejection
      await act(async () => {
        await result.current.open()
      })

      // Modal should NOT open after a failed load
      expect(result.current.isOpen).toBe(false)
      // Sources remain null after failed load
      expect(result.current.sources).toBeNull()
    })
  })
})
