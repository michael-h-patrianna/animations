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
})
