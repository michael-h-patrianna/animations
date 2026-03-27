import { useFocusTrap, useEscapeClose } from '@/hooks/useModalAccessibility'
import { fireEvent, render, screen } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import { useRef } from 'react'
import { describe, expect, it, vi } from 'vitest'

// ── useFocusTrap ─────────────────────────────────────────────────────────

describe('useFocusTrap', () => {
  it('moves focus to initialFocusRef on mount', () => {
    function TestComponent() {
      const containerRef = useRef<HTMLDivElement>(null)
      const initialFocusRef = useRef<HTMLButtonElement>(null)
      useFocusTrap(containerRef, initialFocusRef)
      return (
        <div ref={containerRef}>
          <button ref={initialFocusRef} data-testid="initial">
            Initial
          </button>
          <button data-testid="other">Other</button>
        </div>
      )
    }

    render(<TestComponent />)
    expect(document.activeElement).toBe(screen.getByTestId('initial'))
  })

  it('restores focus to previously focused element on unmount', () => {
    const outerButton = document.createElement('button')
    outerButton.textContent = 'Outer'
    document.body.appendChild(outerButton)
    outerButton.focus()
    expect(document.activeElement).toBe(outerButton)

    function TestComponent() {
      const containerRef = useRef<HTMLDivElement>(null)
      const initialFocusRef = useRef<HTMLButtonElement>(null)
      useFocusTrap(containerRef, initialFocusRef)
      return (
        <div ref={containerRef}>
          <button ref={initialFocusRef}>Modal button</button>
        </div>
      )
    }

    const { unmount } = render(<TestComponent />)
    // Focus moved to modal
    expect(document.activeElement).not.toBe(outerButton)

    unmount()
    // Focus restored
    expect(document.activeElement).toBe(outerButton)

    outerButton.remove()
  })

  it('traps Tab focus at the last element — wraps to first', () => {
    function TestComponent() {
      const containerRef = useRef<HTMLDivElement>(null)
      const initialFocusRef = useRef<HTMLButtonElement>(null)
      useFocusTrap(containerRef, initialFocusRef)
      return (
        <div ref={containerRef} data-testid="container">
          <button ref={initialFocusRef} data-testid="first">
            First
          </button>
          <button data-testid="middle">Middle</button>
          <button data-testid="last">Last</button>
        </div>
      )
    }

    render(<TestComponent />)

    // Focus the last button
    screen.getByTestId('last').focus()
    expect(document.activeElement).toBe(screen.getByTestId('last'))

    // Press Tab on last element — should wrap to first
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement).toBe(screen.getByTestId('first'))
  })

  it('traps Shift+Tab focus at the first element — wraps to last', () => {
    function TestComponent() {
      const containerRef = useRef<HTMLDivElement>(null)
      const initialFocusRef = useRef<HTMLButtonElement>(null)
      useFocusTrap(containerRef, initialFocusRef)
      return (
        <div ref={containerRef}>
          <button ref={initialFocusRef} data-testid="first">
            First
          </button>
          <button data-testid="last">Last</button>
        </div>
      )
    }

    render(<TestComponent />)

    // Focus is on first element (from initialFocusRef)
    expect(document.activeElement).toBe(screen.getByTestId('first'))

    // Press Shift+Tab on first element — should wrap to last
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(screen.getByTestId('last'))
  })

  it('does not trap non-Tab keys', () => {
    function TestComponent() {
      const containerRef = useRef<HTMLDivElement>(null)
      const initialFocusRef = useRef<HTMLButtonElement>(null)
      useFocusTrap(containerRef, initialFocusRef)
      return (
        <div ref={containerRef}>
          <button ref={initialFocusRef} data-testid="only">
            Only
          </button>
        </div>
      )
    }

    render(<TestComponent />)

    // Pressing non-Tab keys should not cause errors
    fireEvent.keyDown(document, { key: 'Enter' })
    fireEvent.keyDown(document, { key: 'Escape' })
    fireEvent.keyDown(document, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(screen.getByTestId('only'))
  })

  it('handles container with no focusable elements gracefully', () => {
    function TestComponent() {
      const containerRef = useRef<HTMLDivElement>(null)
      const initialFocusRef = useRef<HTMLButtonElement>(null)
      useFocusTrap(containerRef, initialFocusRef)
      return (
        <div ref={containerRef}>
          <span>No focusable elements here</span>
          {/* initialFocusRef is not attached to any element in the DOM */}
        </div>
      )
    }

    // Should not throw
    expect(() => render(<TestComponent />)).not.toThrow()
    // Tab should not throw
    fireEvent.keyDown(document, { key: 'Tab' })
  })

  it('skips disabled buttons in focus trap cycling', () => {
    function TestComponent() {
      const containerRef = useRef<HTMLDivElement>(null)
      const initialFocusRef = useRef<HTMLButtonElement>(null)
      useFocusTrap(containerRef, initialFocusRef)
      return (
        <div ref={containerRef}>
          <button ref={initialFocusRef} data-testid="first">
            First
          </button>
          <button disabled data-testid="disabled">
            Disabled
          </button>
          <button data-testid="last">Last</button>
        </div>
      )
    }

    render(<TestComponent />)

    // Focus the last button (which is the last focusable, since middle is disabled)
    screen.getByTestId('last').focus()

    // Tab from last should go to first (skipping disabled)
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement).toBe(screen.getByTestId('first'))
  })

  it('removes keydown listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

    function TestComponent() {
      const containerRef = useRef<HTMLDivElement>(null)
      const initialFocusRef = useRef<HTMLButtonElement>(null)
      useFocusTrap(containerRef, initialFocusRef)
      return (
        <div ref={containerRef}>
          <button ref={initialFocusRef}>Button</button>
        </div>
      )
    }

    const { unmount } = render(<TestComponent />)
    unmount()

    const keydownRemovals = removeEventListenerSpy.mock.calls.filter(
      (call) => call[0] === 'keydown'
    )
    expect(keydownRemovals.length).toBeGreaterThanOrEqual(1)

    removeEventListenerSpy.mockRestore()
  })

  it('includes dynamically added focusable elements in focus cycling', () => {
    // The focus trap queries focusable elements on each keydown, not at mount time.
    // This means dynamically added buttons are included in the trap cycle.
    function DynamicTrapComponent() {
      const containerRef = useRef<HTMLDivElement>(null)
      const initialFocusRef = useRef<HTMLButtonElement>(null)
      useFocusTrap(containerRef, initialFocusRef)
      return (
        <div ref={containerRef} data-testid="trap-container">
          <button ref={initialFocusRef} data-testid="first">
            First
          </button>
          <button data-testid="last">Last</button>
        </div>
      )
    }

    const { container } = render(<DynamicTrapComponent />)

    // Dynamically add a button to the container
    const dynamicBtn = document.createElement('button')
    dynamicBtn.textContent = 'Dynamic'
    dynamicBtn.setAttribute('data-testid', 'dynamic')
    container.querySelector('[data-testid="trap-container"]')!.appendChild(dynamicBtn)

    // Focus the dynamic button (now the last focusable element)
    dynamicBtn.focus()
    expect(document.activeElement).toBe(dynamicBtn)

    // Tab from dynamic (now last) should wrap to first
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement).toBe(screen.getByTestId('first'))
  })

  it('handles container with a single focusable element (Tab stays on it)', () => {
    function TestComponent() {
      const containerRef = useRef<HTMLDivElement>(null)
      const initialFocusRef = useRef<HTMLButtonElement>(null)
      useFocusTrap(containerRef, initialFocusRef)
      return (
        <div ref={containerRef}>
          <button ref={initialFocusRef} data-testid="only-btn">
            Only
          </button>
        </div>
      )
    }

    render(<TestComponent />)
    expect(document.activeElement).toBe(screen.getByTestId('only-btn'))

    // Tab on the only element — first === last, so it wraps back to itself
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement).toBe(screen.getByTestId('only-btn'))

    // Shift+Tab also wraps to itself
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(screen.getByTestId('only-btn'))
  })

  it('includes elements with tabindex="0" in focus trap cycle', () => {
    function TestComponent() {
      const containerRef = useRef<HTMLDivElement>(null)
      const initialFocusRef = useRef<HTMLDivElement>(null)
      useFocusTrap(containerRef, initialFocusRef)
      return (
        <div ref={containerRef}>
          <div ref={initialFocusRef} tabIndex={0} data-testid="first">
            Custom focusable
          </div>
          <button data-testid="last">Button</button>
        </div>
      )
    }

    render(<TestComponent />)
    // Initial focus goes to the tabIndex=0 div
    expect(document.activeElement).toBe(screen.getByTestId('first'))

    // Tab from last should wrap to first (the tabIndex=0 element)
    screen.getByTestId('last').focus()
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement).toBe(screen.getByTestId('first'))
  })

  it('handles null containerRef (ref never attached to DOM)', () => {
    // If containerRef.current stays null (e.g., conditional rendering),
    // the keydown handler should not be attached and no errors should occur.
    function TestComponent() {
      const containerRef = useRef<HTMLDivElement>(null)
      const initialFocusRef = useRef<HTMLButtonElement>(null)
      // Do NOT attach containerRef to any element
      useFocusTrap(containerRef, initialFocusRef)
      return <div>No container ref attached</div>
    }

    expect(() => render(<TestComponent />)).not.toThrow()
    // Tab and Shift+Tab should not cause errors
    fireEvent.keyDown(document, { key: 'Tab' })
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
  })

  it('excludes elements with tabindex="-1" from focus trap cycle', () => {
    function TestComponent() {
      const containerRef = useRef<HTMLDivElement>(null)
      const initialFocusRef = useRef<HTMLButtonElement>(null)
      useFocusTrap(containerRef, initialFocusRef)
      return (
        <div ref={containerRef}>
          <button ref={initialFocusRef} data-testid="first">
            First
          </button>
          <div tabIndex={-1} data-testid="excluded">
            Not focusable via Tab
          </div>
          <button data-testid="last">Last</button>
        </div>
      )
    }

    render(<TestComponent />)

    // Focus the last button, then Tab — should wrap to first, skipping tabindex="-1"
    screen.getByTestId('last').focus()
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement).toBe(screen.getByTestId('first'))
  })
})

// ── useEscapeClose ───────────────────────────────────────────────────────

describe('useEscapeClose', () => {
  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn()
    renderHook(() => useEscapeClose(onClose))

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does not call onClose for non-Escape keys', () => {
    const onClose = vi.fn()
    renderHook(() => useEscapeClose(onClose))

    fireEvent.keyDown(document, { key: 'Enter' })
    fireEvent.keyDown(document, { key: 'Tab' })
    fireEvent.keyDown(document, { key: 'a' })
    expect(onClose).not.toHaveBeenCalled()
  })

  it('removes listener on unmount', () => {
    const onClose = vi.fn()
    const { unmount } = renderHook(() => useEscapeClose(onClose))

    unmount()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()
  })

  it('uses latest onClose callback reference', () => {
    const onClose1 = vi.fn()
    const onClose2 = vi.fn()

    const { rerender } = renderHook(({ onClose }) => useEscapeClose(onClose), {
      initialProps: { onClose: onClose1 },
    })

    rerender({ onClose: onClose2 })
    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose1).not.toHaveBeenCalled()
    expect(onClose2).toHaveBeenCalledOnce()
  })

  it('listens on document (not window)', () => {
    const onClose = vi.fn()
    renderHook(() => useEscapeClose(onClose))

    // The hook attaches to document, not window
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })
})
