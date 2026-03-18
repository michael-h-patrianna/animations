import { useScrollToGroup } from '@/hooks/useScrollToGroup'
import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/** Ref-shaped object for testing — avoids deprecated createRef in non-component code. */
const makeRef = () => ({ current: null as HTMLDivElement | null })

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('useScrollToGroup', () => {
  it('does nothing when currentGroupId is empty', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo')
    const appBarRef = makeRef()

    renderHook(() => useScrollToGroup({ currentGroupId: '', appBarRef }))

    vi.advanceTimersByTime(500)
    expect(scrollToSpy).not.toHaveBeenCalled()
  })

  it('scrolls to the target element using requestAnimationFrame', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    // Create a target element in the DOM
    const el = document.createElement('div')
    el.id = 'group-test-group-framer'
    el.getBoundingClientRect = () =>
      ({ top: 500, left: 0, right: 100, bottom: 600, width: 100, height: 100 }) as DOMRect
    document.body.appendChild(el)

    const appBarRef = makeRef()

    renderHook(() => useScrollToGroup({ currentGroupId: 'test-group-framer', appBarRef }))

    // requestAnimationFrame fires
    vi.advanceTimersByTime(16)

    expect(scrollToSpy).toHaveBeenCalled()

    // Clean up
    el.remove()
    scrollToSpy.mockRestore()
  })

  it('retries scroll after 360ms if element not found on first attempt', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const appBarRef = makeRef()

    renderHook(() => useScrollToGroup({ currentGroupId: 'missing-group', appBarRef }))

    // First attempt (rAF) - element not found
    vi.advanceTimersByTime(16)
    expect(scrollToSpy).not.toHaveBeenCalled()

    // Retry after 360ms - still no element
    vi.advanceTimersByTime(360)
    expect(scrollToSpy).not.toHaveBeenCalled()

    scrollToSpy.mockRestore()
  })

  it('cancels pending timers on unmount', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const appBarRef = makeRef()

    const { unmount } = renderHook(() =>
      useScrollToGroup({ currentGroupId: 'cleanup-group', appBarRef })
    )

    unmount()

    // Timers should have been cancelled
    vi.advanceTimersByTime(500)
    expect(scrollToSpy).not.toHaveBeenCalled()

    scrollToSpy.mockRestore()
  })

  it('scrolls successfully on retry when element appears after initial rAF', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const appBarRef = makeRef()

    renderHook(() => useScrollToGroup({ currentGroupId: 'delayed-group', appBarRef }))

    // First attempt (rAF) - element not found
    vi.advanceTimersByTime(16)
    expect(scrollToSpy).not.toHaveBeenCalled()

    // Now add the element before the retry fires
    const el = document.createElement('div')
    el.id = 'group-delayed-group'
    el.getBoundingClientRect = () =>
      ({ top: 300, left: 0, right: 100, bottom: 400, width: 100, height: 100 }) as DOMRect
    document.body.appendChild(el)

    // Retry at 360ms - element now found
    vi.advanceTimersByTime(360)
    expect(scrollToSpy).toHaveBeenCalled()

    el.remove()
    scrollToSpy.mockRestore()
  })

  it('does not scroll when already at the target position', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    const el = document.createElement('div')
    el.id = 'group-at-position'
    // Element is at top: 16 (with 16px EXTRA_OFFSET and 0 app bar, targetY = 0)
    // window.scrollY is 0, so difference is < 1
    el.getBoundingClientRect = () =>
      ({ top: 16, left: 0, right: 100, bottom: 116, width: 100, height: 100 }) as DOMRect
    document.body.appendChild(el)

    const appBarRef = makeRef()
    renderHook(() => useScrollToGroup({ currentGroupId: 'at-position', appBarRef }))

    vi.advanceTimersByTime(16)

    // Should NOT call scrollTo because the difference is < 1px
    expect(scrollToSpy).not.toHaveBeenCalled()

    el.remove()
    scrollToSpy.mockRestore()
  })

  it('accounts for app bar height in scroll position', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    // Create app bar element
    const appBar = document.createElement('div')
    appBar.setAttribute('data-app-shell', 'bar')
    appBar.getBoundingClientRect = () =>
      ({ top: 0, left: 0, right: 100, bottom: 60, width: 100, height: 60 }) as DOMRect
    document.body.appendChild(appBar)

    // Create target element
    const el = document.createElement('div')
    el.id = 'group-with-appbar-framer'
    el.getBoundingClientRect = () =>
      ({ top: 200, left: 0, right: 100, bottom: 300, width: 100, height: 100 }) as DOMRect
    document.body.appendChild(el)

    const appBarRef = makeRef()

    renderHook(() => useScrollToGroup({ currentGroupId: 'with-appbar-framer', appBarRef }))

    vi.advanceTimersByTime(16)

    expect(scrollToSpy).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'auto' }))

    // Clean up
    el.remove()
    appBar.remove()
    scrollToSpy.mockRestore()
  })
})
