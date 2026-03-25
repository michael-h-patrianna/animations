import { useToastStore } from '@/demo-ui/stores/toastStore'
import { GlobalToast } from '@/components/ui/GlobalToast'
import { ToastContent } from '@/components/ui/Toast'
import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

beforeEach(() => {
  vi.useFakeTimers()
  // Reset store between tests
  useToastStore.setState({ message: null })
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('toastStore', () => {
  it('starts with no message', () => {
    expect(useToastStore.getState().message).toBeNull()
  })

  it('showToast sets the message', () => {
    act(() => {
      useToastStore.getState().showToast('Copied!')
    })
    expect(useToastStore.getState().message).toBe('Copied!')
  })

  it('clearToast resets the message', () => {
    act(() => {
      useToastStore.getState().showToast('Hello')
    })
    expect(useToastStore.getState().message).toBe('Hello')

    act(() => {
      useToastStore.getState().clearToast()
    })
    expect(useToastStore.getState().message).toBeNull()
  })
})

describe('GlobalToast', () => {
  it('renders nothing when no message', () => {
    render(<GlobalToast />)
    expect(screen.queryByTestId('app-toast')).not.toBeInTheDocument()
  })

  it('renders toast when showToast is called', () => {
    render(<GlobalToast />)
    expect(screen.queryByTestId('app-toast')).not.toBeInTheDocument()

    act(() => {
      useToastStore.getState().showToast('Copied!')
    })

    expect(screen.getByTestId('app-toast')).toHaveTextContent('Copied!')
  })

  it('toast has correct accessibility attributes', () => {
    render(<GlobalToast />)

    act(() => {
      useToastStore.getState().showToast('Done')
    })

    const toast = screen.getByTestId('app-toast')
    expect(toast).toHaveAttribute('role', 'status')
    expect(toast).toHaveAttribute('aria-live', 'polite')
  })

  it('replaces previous toast when showToast is called again', () => {
    render(<GlobalToast />)

    act(() => {
      useToastStore.getState().showToast('First')
    })
    expect(screen.getByTestId('app-toast')).toHaveTextContent('First')

    act(() => {
      useToastStore.getState().showToast('Second')
    })
    expect(screen.getByTestId('app-toast')).toHaveTextContent('Second')
    expect(screen.getAllByTestId('app-toast')).toHaveLength(1)
  })

  it('rapid-fire showToast calls result in only the last message displayed', () => {
    render(<GlobalToast />)

    act(() => {
      useToastStore.getState().showToast('A')
      useToastStore.getState().showToast('B')
      useToastStore.getState().showToast('C')
    })

    expect(screen.getAllByTestId('app-toast')).toHaveLength(1)
    expect(screen.getByTestId('app-toast')).toHaveTextContent('C')
  })

  it('rapid 10x showToast calls result in single toast with last message', () => {
    render(<GlobalToast />)

    act(() => {
      for (let i = 0; i < 10; i++) {
        useToastStore.getState().showToast(`Message ${i}`)
      }
    })

    expect(screen.getAllByTestId('app-toast')).toHaveLength(1)
    expect(screen.getByTestId('app-toast')).toHaveTextContent('Message 9')
  })

  it('showToast with empty string does not render a toast', () => {
    render(<GlobalToast />)

    act(() => {
      useToastStore.getState().showToast('')
    })

    // Empty string is falsy — GlobalToast returns null
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

    vi.advanceTimersByTime(2799)
    const toast = screen.getByTestId('app-toast')
    const animateSpy = vi.spyOn(toast, 'animate')
    vi.advanceTimersByTime(1)
    expect(animateSpy).toHaveBeenCalled()
    animateSpy.mockRestore()
  })

  it('fires onDone callback via onfinish when exit animation completes', () => {
    const originalAnimate = Element.prototype.animate
    let animCallCount = 0
    Element.prototype.animate = function () {
      animCallCount++
      const anim = originalAnimate.call(this) as Animation
      if (animCallCount === 3) {
        let storedOnfinish: ((this: Animation, ev: AnimationPlaybackEvent) => void) | null = null
        Object.defineProperty(anim, 'onfinish', {
          get: () => storedOnfinish,
          set: (fn: ((this: Animation, ev: AnimationPlaybackEvent) => void) | null) => {
            storedOnfinish = fn
            if (typeof fn === 'function') {
              fn.call(anim, new Event('finish') as unknown as AnimationPlaybackEvent)
            }
          },
          configurable: true,
        })
      }
      return anim
    }

    const onDone = vi.fn()
    render(<ToastContent message="Done" onDone={onDone} />)

    vi.advanceTimersByTime(2800)

    expect(onDone).toHaveBeenCalledOnce()

    Element.prototype.animate = originalAnimate
  })

  it('does not fire onDone if unmounted during visible period', () => {
    const onDone = vi.fn()
    const { unmount } = render(<ToastContent message="Early unmount" onDone={onDone} />)

    vi.advanceTimersByTime(1400)
    unmount()

    vi.advanceTimersByTime(5000)
    expect(onDone).not.toHaveBeenCalled()
  })
})

describe('toastStore race conditions', () => {
  it('showToast during exit animation replaces the toast', () => {
    render(<GlobalToast />)

    act(() => {
      useToastStore.getState().showToast('First')
    })
    expect(screen.getByTestId('app-toast')).toHaveTextContent('First')

    // Advance to exit animation phase
    vi.advanceTimersByTime(2801)

    act(() => {
      useToastStore.getState().showToast('Second')
    })

    const toasts = screen.getAllByTestId('app-toast')
    expect(toasts).toHaveLength(1)
    expect(toasts[0]).toHaveTextContent('Second')
  })

  it('showToast with same message as current toast still works', () => {
    render(<GlobalToast />)

    act(() => {
      useToastStore.getState().showToast('Same message')
    })
    expect(screen.getByTestId('app-toast')).toHaveTextContent('Same message')

    act(() => {
      useToastStore.getState().showToast('Same message')
    })
    expect(screen.getAllByTestId('app-toast')).toHaveLength(1)
    expect(screen.getByTestId('app-toast')).toHaveTextContent('Same message')
  })
})
