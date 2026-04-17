import { useLazyAnimations } from '@/hooks/useLazyAnimations'
import { resetLazyTestState } from '@/__tests__/helpers/lazyCatalog'
import { declareCategoryGroups } from '@/lib/lazyGroupRegistry'
import type { GroupExport, GroupMetadata } from '@/types/animation'
import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

describe('useLazyAnimations', () => {
  afterEach(() => {
    resetLazyTestState()
  })

  it('returns the lazy nav catalog on first render', () => {
    const { result } = renderHook(() => useLazyAnimations())

    expect(result.current.navCatalog.categories.map((category) => category.id)).toEqual([
      'base',
      'dialogs',
      'progress',
      'realtime',
      'rewards',
    ])
  })

  it('loads a group on demand and caches it', async () => {
    const { result } = renderHook(() => useLazyAnimations())

    await act(async () => {
      await result.current.loadGroup('standard-effects-framer')
    })

    await waitFor(() => {
      expect(result.current.currentGroup?.id).toBe('standard-effects-framer')
    })

    expect(result.current.currentGroup?.animations.length).toBeGreaterThanOrEqual(1)
    expect(result.current.isGroupCached('standard-effects-framer')).toBe(true)
  }, 30_000)

  it('propagates metadata fields after a group loads', async () => {
    const { result } = renderHook(() => useLazyAnimations())

    await act(async () => {
      await result.current.loadGroup('lights-framer')
    })

    const animations = result.current.currentGroup?.animations ?? []

    expect(animations.length).toBeGreaterThanOrEqual(1)
    expect(animations.some((animation) => animation.controls === 'lights')).toBe(true)
  }, 30_000)

  it('surfaces loader errors for unknown groups', async () => {
    const { result } = renderHook(() => useLazyAnimations())

    await act(async () => {
      await result.current.loadGroup('does-not-exist-framer')
    })

    await waitFor(() => {
      expect(result.current.error?.message).toContain('does-not-exist-framer')
    })
  }, 30_000)

  it('clears error state after a successful reload', async () => {
    const { result } = renderHook(() => useLazyAnimations())

    await act(async () => {
      await result.current.loadGroup('does-not-exist-framer')
    })
    await waitFor(() => {
      expect(result.current.error?.message).toContain('does-not-exist-framer')
    })

    await act(async () => {
      await result.current.loadGroup('standard-effects-framer')
    })

    // After a successful reload, the hook exposes the new group and the prior
    // error is no longer reachable via `error?.message`.
    await waitFor(() => {
      expect(result.current.currentGroup?.id).toBe('standard-effects-framer')
      expect(result.current.error?.message ?? 'cleared').toBe('cleared')
    })
  }, 30_000)

  it('discards a stale response when the user navigates away mid-load', async () => {
    // Build two synthetic groups: "slow" resolves on demand, "fast" resolves immediately.
    // Call loadGroup('slow') first, then 'fast', then finally resolve 'slow'.
    // The hook must keep `fast` in state, not overwrite it with `slow`.
    const slowMeta: GroupMetadata = { id: 'race-slow', title: 'Slow' }
    const fastMeta: GroupMetadata = { id: 'race-fast', title: 'Fast' }
    let releaseSlow: ((value: { groupExport: GroupExport }) => void) | null = null

    declareCategoryGroups('__race-slow__', 'Race Slow', [
      {
        metadata: slowMeta,
        load: () =>
          new Promise<{ groupExport: GroupExport }>((resolve) => {
            releaseSlow = resolve
          }),
      },
    ])
    declareCategoryGroups('__race-fast__', 'Race Fast', [
      {
        metadata: fastMeta,
        load: () =>
          Promise.resolve({
            groupExport: { metadata: fastMeta, framer: {}, css: {} } as GroupExport,
          }),
      },
    ])

    const { result } = renderHook(() => useLazyAnimations())

    // Kick off the slow load without awaiting — the loader is pending.
    let slowPromise: Promise<void> = Promise.resolve()
    act(() => {
      slowPromise = result.current.loadGroup('race-slow-framer')
    })

    // Now fire the fast load. It resolves synchronously (cached path).
    await act(async () => {
      await result.current.loadGroup('race-fast-framer')
    })
    await waitFor(() => {
      expect(result.current.currentGroup?.id).toBe('race-fast-framer')
    })

    // Release the slow loader. Without the stale-response guard this would
    // race and overwrite currentGroup with 'race-slow-framer'.
    await act(async () => {
      releaseSlow!({
        groupExport: { metadata: slowMeta, framer: {}, css: {} } as GroupExport,
      })
      await slowPromise
    })

    // 'fast' must still be the active group.
    expect(result.current.currentGroup?.id).toBe('race-fast-framer')
  })
})
