import { useLazyAnimations } from '@/hooks/useLazyAnimations'
import { resetLazyTestState } from '@/__tests__/helpers/lazyCatalog'
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
  })

  it('propagates metadata fields after a group loads', async () => {
    const { result } = renderHook(() => useLazyAnimations())

    await act(async () => {
      await result.current.loadGroup('lights-framer')
    })

    const animations = result.current.currentGroup?.animations ?? []

    expect(animations.length).toBeGreaterThanOrEqual(1)
    expect(animations.some((animation) => animation.controls === 'lights')).toBe(true)
  })

  it('surfaces loader errors for unknown groups', async () => {
    const { result } = renderHook(() => useLazyAnimations())

    await act(async () => {
      await result.current.loadGroup('does-not-exist-framer')
    })

    await waitFor(() => {
      expect(result.current.error?.message).toContain('does-not-exist-framer')
    })
  })
})
