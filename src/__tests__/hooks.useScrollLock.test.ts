import { useScrollLock, _resetScrollLockState } from '@/hooks/useScrollLock'
import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

describe('useScrollLock', () => {
  afterEach(() => {
    _resetScrollLockState()
    document.body.style.overflow = ''
  })

  it('sets body overflow to hidden when open', () => {
    renderHook(() => useScrollLock(true))
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('does not set overflow when closed', () => {
    document.body.style.overflow = ''
    renderHook(() => useScrollLock(false))
    expect(document.body.style.overflow).toBe('')
  })

  it('restores previous overflow value when closed', () => {
    document.body.style.overflow = 'auto'

    const { rerender } = renderHook(({ isOpen }) => useScrollLock(isOpen), {
      initialProps: { isOpen: true },
    })

    expect(document.body.style.overflow).toBe('hidden')

    rerender({ isOpen: false })
    expect(document.body.style.overflow).toBe('auto')
  })

  it('restores overflow on unmount', () => {
    document.body.style.overflow = 'scroll'

    const { unmount } = renderHook(() => useScrollLock(true))
    expect(document.body.style.overflow).toBe('hidden')

    unmount()
    expect(document.body.style.overflow).toBe('scroll')
  })

  it('handles rapid open/close/open toggling without losing original overflow', () => {
    document.body.style.overflow = 'auto'

    const { rerender } = renderHook(({ isOpen }) => useScrollLock(isOpen), {
      initialProps: { isOpen: true },
    })
    expect(document.body.style.overflow).toBe('hidden')

    rerender({ isOpen: false })
    expect(document.body.style.overflow).toBe('auto')

    rerender({ isOpen: true })
    expect(document.body.style.overflow).toBe('hidden')

    rerender({ isOpen: false })
    // Should restore to the value captured just before the second open ('auto'),
    // not the original 'auto' from before the first open — this is correct because
    // the effect captures `prev` at the time it runs.
    expect(document.body.style.overflow).toBe('auto')
  })

  it('does not set overflow when initialized as closed then never opened', () => {
    document.body.style.overflow = 'visible'

    const { unmount } = renderHook(() => useScrollLock(false))
    expect(document.body.style.overflow).toBe('visible')

    unmount()
    expect(document.body.style.overflow).toBe('visible')
  })

  it('captures the correct previous overflow when body style changes externally', () => {
    document.body.style.overflow = 'auto'

    const { rerender } = renderHook(({ isOpen }) => useScrollLock(isOpen), {
      initialProps: { isOpen: false },
    })

    // External code changes overflow while lock is not active
    document.body.style.overflow = 'scroll'

    rerender({ isOpen: true })
    expect(document.body.style.overflow).toBe('hidden')

    rerender({ isOpen: false })
    // Should restore to 'scroll' (the value at the time the lock was acquired)
    expect(document.body.style.overflow).toBe('scroll')
  })

  it('handles concurrent usage from two hooks correctly — second close restores original overflow', () => {
    document.body.style.overflow = 'auto'

    // Simulate drawer opening
    const hook1 = renderHook(({ isOpen }) => useScrollLock(isOpen), {
      initialProps: { isOpen: true },
    })
    expect(document.body.style.overflow).toBe('hidden')

    // Simulate modal opening while drawer is already open
    const hook2 = renderHook(({ isOpen }) => useScrollLock(isOpen), {
      initialProps: { isOpen: true },
    })
    expect(document.body.style.overflow).toBe('hidden')

    // Close the drawer (first lock released)
    hook1.rerender({ isOpen: false })
    // Body should still be hidden because modal (hook2) is still open
    expect(document.body.style.overflow).toBe('hidden')

    // Close the modal (last lock released) — should restore original 'auto'
    hook2.rerender({ isOpen: false })
    expect(document.body.style.overflow).toBe('auto')
  })

  it('handles 3 concurrent locks with non-LIFO release order', () => {
    document.body.style.overflow = 'visible'

    const hookA = renderHook(({ isOpen }) => useScrollLock(isOpen), {
      initialProps: { isOpen: true },
    })
    const hookB = renderHook(({ isOpen }) => useScrollLock(isOpen), {
      initialProps: { isOpen: true },
    })
    const hookC = renderHook(({ isOpen }) => useScrollLock(isOpen), {
      initialProps: { isOpen: true },
    })
    expect(document.body.style.overflow).toBe('hidden')

    // Release B first (middle) — still locked by A and C
    hookB.rerender({ isOpen: false })
    expect(document.body.style.overflow).toBe('hidden')

    // Release A — still locked by C
    hookA.rerender({ isOpen: false })
    expect(document.body.style.overflow).toBe('hidden')

    // Release C (last lock) — should restore original
    hookC.rerender({ isOpen: false })
    expect(document.body.style.overflow).toBe('visible')
  })

  it('handles rapid mount/unmount of multiple lock holders without counter corruption', () => {
    document.body.style.overflow = 'auto'

    // Mount 3 hooks that all lock
    const hook1 = renderHook(() => useScrollLock(true))
    const hook2 = renderHook(() => useScrollLock(true))
    const hook3 = renderHook(() => useScrollLock(true))
    expect(document.body.style.overflow).toBe('hidden')

    // Unmount them all rapidly
    hook1.unmount()
    expect(document.body.style.overflow).toBe('hidden')
    hook2.unmount()
    expect(document.body.style.overflow).toBe('hidden')
    hook3.unmount()
    expect(document.body.style.overflow).toBe('auto')
  })

  it('handles lock holder reopening after another holder was unmounted', () => {
    document.body.style.overflow = 'auto'

    const hookA = renderHook(({ isOpen }) => useScrollLock(isOpen), {
      initialProps: { isOpen: true },
    })
    const hookB = renderHook(({ isOpen }) => useScrollLock(isOpen), {
      initialProps: { isOpen: true },
    })

    // Close A
    hookA.rerender({ isOpen: false })
    expect(document.body.style.overflow).toBe('hidden') // B still open

    // Reopen A while B is still open
    hookA.rerender({ isOpen: true })
    expect(document.body.style.overflow).toBe('hidden')

    // Close B
    hookB.rerender({ isOpen: false })
    expect(document.body.style.overflow).toBe('hidden') // A still open

    // Close A — all locks released
    hookA.rerender({ isOpen: false })
    expect(document.body.style.overflow).toBe('auto')
  })

  it('handles empty string overflow (default browser value) as saved state', () => {
    // Empty string is the browser default for document.body.style.overflow
    document.body.style.overflow = ''

    const { rerender } = renderHook(({ isOpen }) => useScrollLock(isOpen), {
      initialProps: { isOpen: true },
    })
    expect(document.body.style.overflow).toBe('hidden')

    rerender({ isOpen: false })
    // Should restore to empty string (the default), not null or undefined
    expect(document.body.style.overflow).toBe('')
  })

  it('does not decrement lockCount below zero on double close', () => {
    document.body.style.overflow = 'auto'

    const { rerender } = renderHook(({ isOpen }) => useScrollLock(isOpen), {
      initialProps: { isOpen: true },
    })

    // Close once (lockCount goes from 1 to 0)
    rerender({ isOpen: false })
    expect(document.body.style.overflow).toBe('auto')

    // Open another lock after the first was fully released
    const hook2 = renderHook(({ isOpen }) => useScrollLock(isOpen), {
      initialProps: { isOpen: true },
    })
    expect(document.body.style.overflow).toBe('hidden')

    // Release it — should restore correctly without being confused by prior release
    hook2.rerender({ isOpen: false })
    expect(document.body.style.overflow).toBe('auto')
  })

  it('external overflow modification between two lock sessions is captured correctly', () => {
    document.body.style.overflow = 'auto'

    // First session
    const hook1 = renderHook(({ isOpen }) => useScrollLock(isOpen), {
      initialProps: { isOpen: true },
    })
    hook1.rerender({ isOpen: false })
    expect(document.body.style.overflow).toBe('auto')

    // External code changes overflow between sessions
    document.body.style.overflow = 'scroll'

    // Second session should capture 'scroll' as the saved value
    const hook2 = renderHook(({ isOpen }) => useScrollLock(isOpen), {
      initialProps: { isOpen: true },
    })
    expect(document.body.style.overflow).toBe('hidden')

    hook2.rerender({ isOpen: false })
    expect(document.body.style.overflow).toBe('scroll')
  })

  it('restores empty string overflow correctly (savedOverflow="" is not null)', () => {
    // Empty string is the browser default for document.body.style.overflow
    // The cleanup checks `savedOverflow !== null` — empty string passes this check
    // This verifies the distinction between null (no saved state) and '' (saved empty state)
    document.body.style.overflow = ''

    const { rerender } = renderHook(({ isOpen }) => useScrollLock(isOpen), {
      initialProps: { isOpen: true },
    })

    // savedOverflow should be '' (captured from document.body.style.overflow)
    expect(document.body.style.overflow).toBe('hidden')

    rerender({ isOpen: false })
    // Restores to '' — the empty string, not null or undefined
    expect(document.body.style.overflow).toBe('')
  })

  it('handles interleaved open/close across 4 concurrent hooks without counter drift', () => {
    document.body.style.overflow = 'auto'

    const hooks = Array.from({ length: 4 }, () =>
      renderHook(({ isOpen }) => useScrollLock(isOpen), {
        initialProps: { isOpen: true },
      })
    )

    // All 4 locked → hidden
    expect(document.body.style.overflow).toBe('hidden')

    // Release in shuffled order: 2, 0, 3, 1
    hooks[2]!.rerender({ isOpen: false })
    expect(document.body.style.overflow).toBe('hidden')

    hooks[0]!.rerender({ isOpen: false })
    expect(document.body.style.overflow).toBe('hidden')

    hooks[3]!.rerender({ isOpen: false })
    expect(document.body.style.overflow).toBe('hidden')

    hooks[1]!.rerender({ isOpen: false })
    // All released — restored
    expect(document.body.style.overflow).toBe('auto')
  })
})
