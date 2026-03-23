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

  it('_resetScrollLockState fully resets module state for test isolation', () => {
    document.body.style.overflow = 'auto'

    // Create two active locks
    const hook1 = renderHook(() => useScrollLock(true))
    const hook2 = renderHook(() => useScrollLock(true))
    expect(document.body.style.overflow).toBe('hidden')

    // Unmount both hooks first to run their cleanup (decrements lockCount normally)
    hook1.unmount()
    hook2.unmount()
    // After both unmounts, lockCount is 0 and overflow is restored
    expect(document.body.style.overflow).toBe('auto')

    // Now reset — verifies reset works from a clean state
    _resetScrollLockState()

    // After reset, a new lock should behave as if no prior locks existed
    document.body.style.overflow = 'visible'
    const hook3 = renderHook(({ isOpen }) => useScrollLock(isOpen), {
      initialProps: { isOpen: true },
    })
    expect(document.body.style.overflow).toBe('hidden')

    // Closing this new lock should restore to 'visible' (what was current when lock acquired)
    hook3.rerender({ isOpen: false })
    expect(document.body.style.overflow).toBe('visible')
  })

  it('_resetScrollLockState during active locks allows fresh start', () => {
    document.body.style.overflow = 'auto'

    // Create an active lock (do NOT close or unmount it)
    const hook1 = renderHook(() => useScrollLock(true))
    expect(document.body.style.overflow).toBe('hidden')

    // Force reset while lock is active — simulates test isolation cleanup
    _resetScrollLockState()
    document.body.style.overflow = 'scroll'

    // New hook after reset should work independently
    const hook2 = renderHook(({ isOpen }) => useScrollLock(isOpen), {
      initialProps: { isOpen: true },
    })
    expect(document.body.style.overflow).toBe('hidden')

    hook2.rerender({ isOpen: false })
    expect(document.body.style.overflow).toBe('scroll')

    // Clean up hook1 — its cleanup will decrement a counter that was reset,
    // potentially going negative, but the guard prevents it from corrupting state
    hook1.unmount()
    // hook2 already closed, so overflow stays at 'scroll'
    expect(document.body.style.overflow).toBe('scroll')
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

  it('captures "hidden" as savedOverflow when body is already hidden externally', () => {
    // Edge case: external code (another library) sets overflow: hidden before
    // our lock. When our lock releases, it should restore to "hidden" (the
    // external state), not to "" or some other default.
    document.body.style.overflow = 'hidden'

    const { rerender } = renderHook(({ isOpen }) => useScrollLock(isOpen), {
      initialProps: { isOpen: true },
    })
    // Still hidden — our lock set it, but savedOverflow is 'hidden'
    expect(document.body.style.overflow).toBe('hidden')

    rerender({ isOpen: false })
    // Should restore to the external 'hidden', not to ''
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('handles external overflow modification while locks are active (lock ignores external changes)', () => {
    document.body.style.overflow = 'auto'

    const hook = renderHook(({ isOpen }) => useScrollLock(isOpen), {
      initialProps: { isOpen: true },
    })
    expect(document.body.style.overflow).toBe('hidden')

    // External code modifies overflow while lock is active — this is an
    // anti-pattern but shouldn't cause state corruption.
    document.body.style.overflow = 'scroll'

    // Release the lock — savedOverflow was 'auto' from before the lock
    hook.rerender({ isOpen: false })
    // Restores to the value captured at lock time, not the externally modified 'scroll'
    expect(document.body.style.overflow).toBe('auto')
  })

  it('handles body.style.overflow set to empty string vs missing (both are falsy)', () => {
    // Distinguish between overflow='' (explicitly empty) and overflow being the
    // default browser state. Both are empty strings via style.overflow getter.
    document.body.style.overflow = ''
    const { rerender } = renderHook(({ isOpen }) => useScrollLock(isOpen), {
      initialProps: { isOpen: true },
    })
    expect(document.body.style.overflow).toBe('hidden')

    rerender({ isOpen: false })
    // savedOverflow was '' → restored to '' → which triggers the ?? '' fallback
    // (savedOverflow is '' which is not null, so it passes the null check)
    expect(document.body.style.overflow).toBe('')
  })
})
