import { useEscapeClose } from '@/hooks/useModalAccessibility'
import { fireEvent } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

describe('useEscapeClose with enabled parameter', () => {
  it('calls onClose when Escape is pressed while enabled', () => {
    const onClose = vi.fn()
    renderHook(() => useEscapeClose(onClose, true))

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does not call onClose when Escape is pressed while disabled', () => {
    const onClose = vi.fn()
    renderHook(() => useEscapeClose(onClose, false))

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()
  })

  it('ignores non-Escape key presses', () => {
    const onClose = vi.fn()
    renderHook(() => useEscapeClose(onClose, true))

    fireEvent.keyDown(document, { key: 'Enter' })
    fireEvent.keyDown(document, { key: 'a' })
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(onClose).not.toHaveBeenCalled()
  })

  it('removes listener when enabled changes to false', () => {
    const onClose = vi.fn()
    const { rerender } = renderHook(({ enabled }) => useEscapeClose(onClose, enabled), {
      initialProps: { enabled: true },
    })

    rerender({ enabled: false })

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()
  })

  it('removes listener on unmount', () => {
    const onClose = vi.fn()
    const { unmount } = renderHook(() => useEscapeClose(onClose, true))

    unmount()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()
  })

  it('calls onClose exactly once per Escape press (no double-firing)', () => {
    const onClose = vi.fn()
    renderHook(() => useEscapeClose(onClose, true))

    fireEvent.keyDown(document, { key: 'Escape' })
    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('responds to enabled changes correctly across multiple toggles', () => {
    const onClose = vi.fn()
    const { rerender } = renderHook(({ enabled }) => useEscapeClose(onClose, enabled), {
      initialProps: { enabled: true },
    })

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)

    rerender({ enabled: false })
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1) // No new call

    rerender({ enabled: true })
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(2) // One more call
  })

  it('uses latest onClose callback reference', () => {
    const onClose1 = vi.fn()
    const onClose2 = vi.fn()
    const { rerender } = renderHook(({ onClose }) => useEscapeClose(onClose, true), {
      initialProps: { onClose: onClose1 },
    })

    rerender({ onClose: onClose2 })
    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose1).not.toHaveBeenCalled()
    expect(onClose2).toHaveBeenCalledOnce()
  })

  it('multiple concurrent instances all fire on Escape (no listener clobbering)', () => {
    const onCloseA = vi.fn()
    const onCloseB = vi.fn()
    const onCloseC = vi.fn()

    renderHook(() => useEscapeClose(onCloseA, true))
    renderHook(() => useEscapeClose(onCloseB, true))
    renderHook(() => useEscapeClose(onCloseC, true))

    fireEvent.keyDown(document, { key: 'Escape' })

    // All three should fire — the hook uses addEventListener, not onkeydown assignment
    expect(onCloseA).toHaveBeenCalledOnce()
    expect(onCloseB).toHaveBeenCalledOnce()
    expect(onCloseC).toHaveBeenCalledOnce()
  })

  it('only enabled instances fire when some are disabled', () => {
    const onCloseActive = vi.fn()
    const onCloseClosed = vi.fn()

    renderHook(() => useEscapeClose(onCloseActive, true))
    renderHook(() => useEscapeClose(onCloseClosed, false))

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onCloseActive).toHaveBeenCalledOnce()
    expect(onCloseClosed).not.toHaveBeenCalled()
  })

  it('does not respond to "Esc" (legacy IE key value)', () => {
    // The hook checks e.key === 'Escape' (standard), not 'Esc' (legacy)
    const onClose = vi.fn()
    renderHook(() => useEscapeClose(onClose, true))

    fireEvent.keyDown(document, { key: 'Esc' })
    expect(onClose).not.toHaveBeenCalled()

    // Standard 'Escape' still works
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does not respond to keyup events (only keydown)', () => {
    const onClose = vi.fn()
    renderHook(() => useEscapeClose(onClose, true))

    fireEvent.keyUp(document, { key: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()
  })
})
