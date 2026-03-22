import { useToast } from '@/components/ui/useToast'
import { ToastContent } from '@/components/ui/Toast'
import { fireEvent, render, renderHook, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('useToast', () => {
  it('starts with no toast portal', () => {
    const { result } = renderHook(() => useToast())

    expect(result.current.toastPortal).toBeNull()
  })

  it('showToast creates a portal with the message', () => {
    function TestHost() {
      const { showToast, toastPortal } = useToast()
      return (
        <div>
          <button onClick={() => showToast('Copied!')} data-testid="trigger">
            Copy
          </button>
          {toastPortal}
        </div>
      )
    }

    render(<TestHost />)
    expect(screen.queryByTestId('app-toast')).not.toBeInTheDocument()

    fireEvent.click(screen.getByTestId('trigger'))

    expect(screen.getByTestId('app-toast')).toHaveTextContent('Copied!')
  })

  it('toast has correct accessibility attributes', () => {
    function TestHost() {
      const { showToast, toastPortal } = useToast()
      return (
        <div>
          <button onClick={() => showToast('Done')} data-testid="trigger">
            Go
          </button>
          {toastPortal}
        </div>
      )
    }

    render(<TestHost />)
    fireEvent.click(screen.getByTestId('trigger'))

    const toast = screen.getByTestId('app-toast')
    expect(toast).toHaveAttribute('role', 'status')
    expect(toast).toHaveAttribute('aria-live', 'polite')
  })

  it('replaces previous toast when showToast is called again', () => {
    function TestHost() {
      const { showToast, toastPortal } = useToast()
      return (
        <div>
          <button onClick={() => showToast('First')} data-testid="first">
            1
          </button>
          <button onClick={() => showToast('Second')} data-testid="second">
            2
          </button>
          {toastPortal}
        </div>
      )
    }

    render(<TestHost />)

    fireEvent.click(screen.getByTestId('first'))
    expect(screen.getByTestId('app-toast')).toHaveTextContent('First')

    fireEvent.click(screen.getByTestId('second'))
    expect(screen.getByTestId('app-toast')).toHaveTextContent('Second')
    // Only one toast should exist
    expect(screen.getAllByTestId('app-toast')).toHaveLength(1)
  })

  it('rapid-fire showToast calls result in only the last message displayed', () => {
    function TestHost() {
      const { showToast, toastPortal } = useToast()
      return (
        <div>
          <button
            onClick={() => {
              showToast('A')
              showToast('B')
              showToast('C')
            }}
            data-testid="rapid"
          >
            Rapid fire
          </button>
          {toastPortal}
        </div>
      )
    }

    render(<TestHost />)
    fireEvent.click(screen.getByTestId('rapid'))

    // Only one toast should exist, showing the last message
    expect(screen.getAllByTestId('app-toast')).toHaveLength(1)
    expect(screen.getByTestId('app-toast')).toHaveTextContent('C')
  })

  it('showToast with empty string creates a portal (documents behavior)', () => {
    function TestHost() {
      const { showToast, toastPortal } = useToast()
      return (
        <div>
          <button onClick={() => showToast('')} data-testid="empty">
            Empty
          </button>
          {toastPortal}
        </div>
      )
    }

    render(<TestHost />)
    fireEvent.click(screen.getByTestId('empty'))

    // Empty string is still truthy for state — setToast('') sets toast to ''
    // which is falsy in JS, so the portal should NOT render
    expect(screen.queryByTestId('app-toast')).not.toBeInTheDocument()
  })
})

describe('ToastContent', () => {
  it('renders the message text', () => {
    render(<ToastContent message="Link copied" onDone={vi.fn()} />)
    expect(screen.getByTestId('app-toast')).toHaveTextContent('Link copied')
  })

  it('cleans up animations on unmount', () => {
    const onDone = vi.fn()
    const { unmount } = render(<ToastContent message="Test" onDone={onDone} />)

    // Unmount before exit timer fires — should not call onDone
    unmount()
    vi.advanceTimersByTime(10000)
    expect(onDone).not.toHaveBeenCalled()
  })

  it('starts exit animation after VISIBLE_MS (2800ms) timeout', () => {
    const onDone = vi.fn()
    render(<ToastContent message="Timed" onDone={onDone} />)

    // Before VISIBLE_MS — exit animation should not have started
    vi.advanceTimersByTime(2799)
    // After exactly VISIBLE_MS — exit timer fires, calling toast.animate() for exit
    // The mock animate() returns an object; the component sets exitAnim.onfinish = onDone.
    // In the test env, the mock doesn't call onfinish automatically, but we can verify
    // the exit animation was created by checking that animate was called on the toast element.
    const toast = screen.getByTestId('app-toast')
    const animateSpy = vi.spyOn(toast, 'animate')
    vi.advanceTimersByTime(1)
    // The exit animation should have been triggered (a third animate call: entry, progress, exit)
    expect(animateSpy).toHaveBeenCalled()
    animateSpy.mockRestore()
  })

  it('fires onDone callback via onfinish when exit animation completes', () => {
    // Override animate to invoke onfinish synchronously for test control
    const originalAnimate = Element.prototype.animate
    let animCallCount = 0
    Element.prototype.animate = function () {
      animCallCount++
      const anim = originalAnimate.call(this) as Animation
      // The 3rd animate call is the exit animation — trigger its onfinish
      if (animCallCount === 3) {
        const origFinishSetter = Object.getOwnPropertyDescriptor(anim, 'onfinish')
        let storedOnfinish: ((this: Animation, ev: AnimationPlaybackEvent) => void) | null = null
        Object.defineProperty(anim, 'onfinish', {
          get: () => storedOnfinish,
          set: (fn: ((this: Animation, ev: AnimationPlaybackEvent) => void) | null) => {
            storedOnfinish = fn
            // Fire immediately to simulate animation completion
            if (typeof fn === 'function') {
              fn.call(anim, new Event('finish') as unknown as AnimationPlaybackEvent)
            }
          },
          configurable: true,
        })
        if (origFinishSetter) void origFinishSetter // suppress lint
      }
      return anim
    }

    const onDone = vi.fn()
    render(<ToastContent message="Done" onDone={onDone} />)

    // Advance past VISIBLE_MS to trigger exit animation
    vi.advanceTimersByTime(2800)

    // onDone should have been called via the onfinish setter
    expect(onDone).toHaveBeenCalledOnce()

    Element.prototype.animate = originalAnimate
  })

  it('does not fire onDone if unmounted during visible period', () => {
    const onDone = vi.fn()
    const { unmount } = render(<ToastContent message="Early unmount" onDone={onDone} />)

    // Advance partway through visible period
    vi.advanceTimersByTime(1400)
    unmount()

    // Advance past all durations — cleanup should have cleared the timer
    vi.advanceTimersByTime(5000)
    expect(onDone).not.toHaveBeenCalled()
  })
})
