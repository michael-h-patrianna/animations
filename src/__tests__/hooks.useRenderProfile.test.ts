import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useRenderProfile } from '@/hooks/useRenderProfile'
import { useLayoutStore } from '@/demo-ui/stores/layoutStore'

describe('useRenderProfile', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    useLayoutStore.setState({ showProfiler: false })
  })

  it('returns null profile when profiler is off', () => {
    useLayoutStore.setState({ showProfiler: false })
    const { result } = renderHook(() => useRenderProfile())

    expect(result.current.profile).toBeNull()
  })

  it('returns noop onRender that does not crash when profiler is off', () => {
    useLayoutStore.setState({ showProfiler: false })
    const { result } = renderHook(() => useRenderProfile())

    // Should be a stable noop — not throw
    result.current.onRender('test', 'mount', 5.0, 10.0)
    expect(result.current.profile).toBeNull()
  })

  it('skips near-zero renders (actualDuration < 0.01 && baseDuration < 0.01)', () => {
    useLayoutStore.setState({ showProfiler: true })
    vi.setSystemTime(1000)

    const { result, rerender } = renderHook(() => useRenderProfile())

    // onRender with near-zero values should be skipped
    result.current.onRender('test', 'mount', 0.001, 0.001)
    rerender()

    expect(result.current.profile).toBeNull()
  })

  it('returns different onRender reference based on profiler state', () => {
    useLayoutStore.setState({ showProfiler: false })
    const { result, rerender } = renderHook(() => useRenderProfile())

    const noopFn = result.current.onRender

    useLayoutStore.setState({ showProfiler: true })
    rerender()

    const activeFn = result.current.onRender

    // The noop and active callbacks should be different references
    expect(noopFn).not.toBe(activeFn)
  })
})
