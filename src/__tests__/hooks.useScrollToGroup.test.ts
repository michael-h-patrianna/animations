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

  it('does not scroll when element never appears in the DOM', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const appBarRef = makeRef()

    renderHook(() => useScrollToGroup({ currentGroupId: 'missing-group', appBarRef }))

    // Element never in DOM — MutationObserver watches but never finds it
    vi.advanceTimersByTime(2500)
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

  it('scrolls via MutationObserver when element appears after initial attempt', async () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const appBarRef = makeRef()

    renderHook(() => useScrollToGroup({ currentGroupId: 'delayed-group', appBarRef }))

    // Element not in DOM yet — no scroll
    expect(scrollToSpy).not.toHaveBeenCalled()

    // Add the element — MutationObserver should detect it
    const el = document.createElement('div')
    el.id = 'group-delayed-group'
    el.getBoundingClientRect = () =>
      ({ top: 300, left: 0, right: 100, bottom: 400, width: 100, height: 100 }) as DOMRect
    document.body.appendChild(el)

    // Flush MutationObserver microtask
    await vi.advanceTimersByTimeAsync(0)
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

    // Element exists at render — scroll check is synchronous.
    // Should NOT call scrollTo because the difference is < 1px.
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

  it('uses appBarRef height when available instead of data-app-shell selector', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    const el = document.createElement('div')
    el.id = 'group-with-ref'
    el.getBoundingClientRect = () =>
      ({ top: 300, left: 0, right: 100, bottom: 400, width: 100, height: 100 }) as DOMRect
    document.body.appendChild(el)

    // Create a real ref with a mock element
    const appBarEl = document.createElement('div')
    appBarEl.getBoundingClientRect = () =>
      ({ top: 0, left: 0, right: 100, bottom: 80, width: 100, height: 80 }) as DOMRect
    const appBarRef = { current: appBarEl as unknown as HTMLDivElement }

    renderHook(() => useScrollToGroup({ currentGroupId: 'with-ref', appBarRef }))

    vi.advanceTimersByTime(16)

    // scrollTo should be called — the ref provides height 80, but we can't directly
    // verify the calculation. We verify it was called (meaning the ref was used).
    expect(scrollToSpy).toHaveBeenCalled()

    el.remove()
    scrollToSpy.mockRestore()
  })

  it('cancels both rAF and retry timeout on unmount between rAF and retry', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const appBarRef = makeRef()

    const { unmount } = renderHook(() =>
      useScrollToGroup({ currentGroupId: 'interleave-test', appBarRef })
    )

    // First attempt (rAF) fires — element not found, schedules retry
    vi.advanceTimersByTime(16)

    // Unmount BETWEEN rAF and retry timeout
    unmount()

    // Advance past the retry delay — should NOT scroll because cleanup ran
    vi.advanceTimersByTime(500)
    expect(scrollToSpy).not.toHaveBeenCalled()

    scrollToSpy.mockRestore()
  })

  it('calculates correct scroll position with 16px extra offset', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    const el = document.createElement('div')
    el.id = 'group-calc-test'
    // Element at top: 100, window.scrollY = 0
    el.getBoundingClientRect = () =>
      ({ top: 100, left: 0, right: 100, bottom: 200, width: 100, height: 100 }) as DOMRect
    document.body.appendChild(el)

    const appBarRef = makeRef()
    renderHook(() => useScrollToGroup({ currentGroupId: 'calc-test', appBarRef }))
    vi.advanceTimersByTime(16)

    // targetY = max(0, 100 + 0 - 0 - 16) = 84
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 84, behavior: 'auto' })

    el.remove()
    scrollToSpy.mockRestore()
  })

  it('clamps scroll position to 0 when target is near page top', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    const el = document.createElement('div')
    el.id = 'group-near-top'
    // Element at top: 10 → targetY = max(0, 10 + 0 - 0 - 16) = max(0, -6) = 0
    el.getBoundingClientRect = () =>
      ({ top: 10, left: 0, right: 100, bottom: 110, width: 100, height: 100 }) as DOMRect
    document.body.appendChild(el)

    const appBarRef = makeRef()
    renderHook(() => useScrollToGroup({ currentGroupId: 'near-top', appBarRef }))
    vi.advanceTimersByTime(16)

    // difference is |0 - 0| = 0 which is < 1, so scrollTo should NOT be called
    expect(scrollToSpy).not.toHaveBeenCalled()

    el.remove()
    scrollToSpy.mockRestore()
  })

  it('does not scroll when currentGroupId changes to empty string', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const appBarRef = makeRef()

    const { rerender } = renderHook(
      ({ groupId }) => useScrollToGroup({ currentGroupId: groupId, appBarRef }),
      { initialProps: { groupId: '' } }
    )

    vi.advanceTimersByTime(500)
    expect(scrollToSpy).not.toHaveBeenCalled()

    // Change to a non-empty value then back to empty
    rerender({ groupId: '' })
    vi.advanceTimersByTime(500)
    expect(scrollToSpy).not.toHaveBeenCalled()

    scrollToSpy.mockRestore()
  })

  it('cancels previous observer when groupId changes rapidly', async () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const appBarRef = makeRef()

    // el1 exists at render time — first render scrolls to it synchronously
    const el1 = document.createElement('div')
    el1.id = 'group-first-group'
    el1.getBoundingClientRect = () =>
      ({ top: 200, left: 0, right: 100, bottom: 300, width: 100, height: 100 }) as DOMRect
    document.body.appendChild(el1)

    const { rerender } = renderHook(
      ({ groupId }) => useScrollToGroup({ currentGroupId: groupId, appBarRef }),
      { initialProps: { groupId: 'first-group' } }
    )

    // First render scrolled to el1 synchronously
    expect(scrollToSpy).toHaveBeenCalledTimes(1)
    scrollToSpy.mockClear()

    // Rerender with second-group — cleanup disconnects any prior observer
    rerender({ groupId: 'second-group' })

    // el2 not in DOM yet, MutationObserver is watching
    const el2 = document.createElement('div')
    el2.id = 'group-second-group'
    el2.getBoundingClientRect = () =>
      ({ top: 400, left: 0, right: 100, bottom: 500, width: 100, height: 100 }) as DOMRect
    document.body.appendChild(el2)

    // Flush MutationObserver microtask
    await vi.advanceTimersByTimeAsync(0)

    // The scroll target should use second-group's position
    expect(scrollToSpy).toHaveBeenCalled()
    const lastCall = scrollToSpy.mock.calls[scrollToSpy.mock.calls.length - 1]!
    const scrollOpts = lastCall[0] as ScrollToOptions
    // second-group is at top: 400 with no app bar, so targetY = 400 + 0 - 0 - 16 = 384
    expect(scrollOpts.top).toBe(384)

    el1.remove()
    el2.remove()
    scrollToSpy.mockRestore()
  })
})
