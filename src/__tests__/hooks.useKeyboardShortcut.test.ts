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
})
