import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import { fireEvent } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

describe('useKeyboardShortcut', () => {
  it('calls onClose when Escape is pressed while open', () => {
    const onClose = vi.fn()
    renderHook(() => useKeyboardShortcut({ isOpen: true, onClose }))

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does not call onClose when Escape is pressed while closed', () => {
    const onClose = vi.fn()
    renderHook(() => useKeyboardShortcut({ isOpen: false, onClose }))

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()
  })

  it('ignores non-Escape key presses', () => {
    const onClose = vi.fn()
    renderHook(() => useKeyboardShortcut({ isOpen: true, onClose }))

    fireEvent.keyDown(window, { key: 'Enter' })
    fireEvent.keyDown(window, { key: 'a' })
    fireEvent.keyDown(window, { key: 'Tab' })
    expect(onClose).not.toHaveBeenCalled()
  })

  it('removes listener when isOpen changes to false', () => {
    const onClose = vi.fn()
    const { rerender } = renderHook(({ isOpen }) => useKeyboardShortcut({ isOpen, onClose }), {
      initialProps: { isOpen: true },
    })

    rerender({ isOpen: false })

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()
  })

  it('removes listener on unmount', () => {
    const onClose = vi.fn()
    const { unmount } = renderHook(() => useKeyboardShortcut({ isOpen: true, onClose }))

    unmount()

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()
  })

  it('calls onClose exactly once per Escape press (no double-firing)', () => {
    const onClose = vi.fn()
    renderHook(() => useKeyboardShortcut({ isOpen: true, onClose }))

    fireEvent.keyDown(window, { key: 'Escape' })
    fireEvent.keyDown(window, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('responds to isOpen changes correctly across multiple toggles', () => {
    const onClose = vi.fn()
    const { rerender } = renderHook(({ isOpen }) => useKeyboardShortcut({ isOpen, onClose }), {
      initialProps: { isOpen: true },
    })

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)

    rerender({ isOpen: false })
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1) // No new call

    rerender({ isOpen: true })
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(2) // One more call
  })

  it('uses latest onClose callback reference', () => {
    const onClose1 = vi.fn()
    const onClose2 = vi.fn()
    const { rerender } = renderHook(
      ({ onClose }) => useKeyboardShortcut({ isOpen: true, onClose }),
      { initialProps: { onClose: onClose1 } }
    )

    rerender({ onClose: onClose2 })
    fireEvent.keyDown(window, { key: 'Escape' })

    expect(onClose1).not.toHaveBeenCalled()
    expect(onClose2).toHaveBeenCalledOnce()
  })

  it('multiple concurrent instances all fire on Escape (no listener clobbering)', () => {
    const onCloseA = vi.fn()
    const onCloseB = vi.fn()
    const onCloseC = vi.fn()

    renderHook(() => useKeyboardShortcut({ isOpen: true, onClose: onCloseA }))
    renderHook(() => useKeyboardShortcut({ isOpen: true, onClose: onCloseB }))
    renderHook(() => useKeyboardShortcut({ isOpen: true, onClose: onCloseC }))

    fireEvent.keyDown(window, { key: 'Escape' })

    // All three should fire — the hook uses addEventListener, not onkeydown assignment
    expect(onCloseA).toHaveBeenCalledOnce()
    expect(onCloseB).toHaveBeenCalledOnce()
    expect(onCloseC).toHaveBeenCalledOnce()
  })

  it('only active instances fire when some are closed', () => {
    const onCloseActive = vi.fn()
    const onCloseClosed = vi.fn()

    renderHook(() => useKeyboardShortcut({ isOpen: true, onClose: onCloseActive }))
    renderHook(() => useKeyboardShortcut({ isOpen: false, onClose: onCloseClosed }))

    fireEvent.keyDown(window, { key: 'Escape' })

    expect(onCloseActive).toHaveBeenCalledOnce()
    expect(onCloseClosed).not.toHaveBeenCalled()
  })

  it('does not respond to "Esc" (legacy IE key value)', () => {
    // The hook checks e.key === 'Escape' (standard), not 'Esc' (legacy)
    const onClose = vi.fn()
    renderHook(() => useKeyboardShortcut({ isOpen: true, onClose }))

    fireEvent.keyDown(window, { key: 'Esc' })
    expect(onClose).not.toHaveBeenCalled()

    // Standard 'Escape' still works
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does not respond to keyup events (only keydown)', () => {
    const onClose = vi.fn()
    renderHook(() => useKeyboardShortcut({ isOpen: true, onClose }))

    fireEvent.keyUp(window, { key: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()
  })
})
