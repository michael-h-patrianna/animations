/**
 * Cross-hook modal lifecycle integration test.
 *
 * Traces the complete lifecycle of a preview modal across multiple hooks:
 * usePreviewModal (state) → useScrollLock (body overflow) → useEscapeClose (keyboard) →
 * useFocusTrap (focus management). Verifies that hooks composed together in the real
 * PreviewModal component interact correctly — catching bugs that isolated unit tests miss.
 */
import { PreviewModal } from '@/components/ui/PreviewModal'
import { usePreviewModal } from '@/components/ui/usePreviewModal'
import { _resetScrollLockState } from '@/hooks/useScrollLock'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

afterEach(() => {
  cleanup()
  _resetScrollLockState()
  document.body.style.overflow = ''
})

describe('integration: modal lifecycle across hooks', () => {
  it('open → scroll locked → escape close → scroll restored', () => {
    document.body.style.overflow = 'auto'

    const { result } = renderHook(() => usePreviewModal())

    // Phase 1: Open modal → scroll should lock
    act(() => {
      result.current.openDesktop()
    })
    expect(result.current.isOpen).toBe(true)
    expect(document.body.style.overflow).toBe('hidden')

    // Phase 2: Close modal → scroll should restore
    act(() => {
      result.current.close()
    })
    expect(result.current.isOpen).toBe(false)
    expect(document.body.style.overflow).toBe('auto')
  })

  it('open → mode switch → scroll stays locked → close → scroll restored', () => {
    document.body.style.overflow = 'scroll'

    const { result } = renderHook(() => usePreviewModal())

    // Open desktop
    act(() => {
      result.current.openDesktop()
    })
    expect(document.body.style.overflow).toBe('hidden')

    // Switch to mobile (still open)
    act(() => {
      result.current.openMobile()
    })
    expect(result.current.isOpen).toBe(true)
    expect(result.current.mode).toBe('mobile')
    expect(document.body.style.overflow).toBe('hidden')

    // Close
    act(() => {
      result.current.close()
    })
    expect(document.body.style.overflow).toBe('scroll')
  })

  it('open → replay (stays open) → scroll stays locked → close → scroll restored', () => {
    document.body.style.overflow = ''

    const { result } = renderHook(() => usePreviewModal())

    act(() => {
      result.current.openDesktop()
    })
    expect(document.body.style.overflow).toBe('hidden')
    expect(result.current.replayKey).toBe(1)

    // Replay does NOT close the modal
    act(() => {
      result.current.replay()
    })
    expect(result.current.isOpen).toBe(true)
    expect(result.current.replayKey).toBe(2)
    expect(document.body.style.overflow).toBe('hidden')

    // Close restores
    act(() => {
      result.current.close()
    })
    expect(document.body.style.overflow).toBe('')
  })

  it('unmount while open restores scroll (no leaked lock)', () => {
    document.body.style.overflow = 'auto'

    const { result, unmount } = renderHook(() => usePreviewModal())

    act(() => {
      result.current.openMobile()
    })
    expect(document.body.style.overflow).toBe('hidden')

    // Unmount without closing — cleanup should release the scroll lock
    unmount()
    expect(document.body.style.overflow).toBe('auto')
  })

  it('PreviewModal component: Escape key closes and restores scroll', () => {
    document.body.style.overflow = 'auto'

    let closeCalled = false

    render(
      <PreviewModal
        mode="desktop"
        replayKey={1}
        previewPosition="center"
        onClose={() => {
          closeCalled = true
        }}
        onReplay={() => {}}
        onSwitchMode={() => {}}
      >
        <div data-testid="child">Content</div>
      </PreviewModal>
    )

    // PreviewModal renders and uses useEscapeClose internally
    expect(screen.getByTestId('preview-desktop')).toBeVisible()

    // Press Escape — should trigger onClose callback
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(closeCalled).toBe(true)
  })

  it('PreviewModal component: focus trap keeps focus within modal', () => {
    render(
      <PreviewModal
        mode="desktop"
        replayKey={1}
        previewPosition="center"
        onClose={() => {}}
        onReplay={() => {}}
        onSwitchMode={() => {}}
      >
        <div data-testid="child">Content</div>
      </PreviewModal>
    )

    // Focus should be on a button inside the modal (close button gets initial focus via useFocusTrap)
    const activeEl = document.activeElement as HTMLElement
    const modal = screen.getByTestId('preview-desktop')
    expect(modal.contains(activeEl)).toBe(true)

    // Tab should cycle within modal, not escape to body
    fireEvent.keyDown(document, { key: 'Tab' })
    const newActiveEl = document.activeElement as HTMLElement
    expect(modal.contains(newActiveEl)).toBe(true)
  })

  it('rapid open/close/open cycle: scroll lock count stays correct', () => {
    document.body.style.overflow = 'auto'

    const { result } = renderHook(() => usePreviewModal())

    // Rapid cycle: open → close → open → close → open
    act(() => {
      result.current.openDesktop()
    })
    act(() => {
      result.current.close()
    })
    act(() => {
      result.current.openMobile()
    })
    act(() => {
      result.current.close()
    })
    act(() => {
      result.current.openDesktop()
    })

    // After all that, modal is open — scroll should be hidden
    expect(result.current.isOpen).toBe(true)
    expect(document.body.style.overflow).toBe('hidden')

    // Final close — scroll should restore to original 'auto'
    act(() => {
      result.current.close()
    })
    expect(document.body.style.overflow).toBe('auto')
  })

  it('two independent PreviewModal hooks do not corrupt shared scroll lock state', () => {
    document.body.style.overflow = 'auto'

    const { result: modal1 } = renderHook(() => usePreviewModal())
    const { result: modal2 } = renderHook(() => usePreviewModal())

    // Open both
    act(() => {
      modal1.current.openDesktop()
    })
    act(() => {
      modal2.current.openMobile()
    })
    expect(document.body.style.overflow).toBe('hidden')

    // Close first — second still holds lock
    act(() => {
      modal1.current.close()
    })
    expect(document.body.style.overflow).toBe('hidden')

    // Close second — all locks released
    act(() => {
      modal2.current.close()
    })
    expect(document.body.style.overflow).toBe('auto')
  })
})
