import { useScrollLock } from '@/hooks/useScrollLock'
import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

describe('useScrollLock', () => {
  afterEach(() => {
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
})
