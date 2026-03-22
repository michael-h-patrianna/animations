import { usePreviewModal } from '@/components/ui/usePreviewModal'
import { _resetScrollLockState } from '@/hooks/useScrollLock'
import { cleanup } from '@testing-library/react'
import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

afterEach(() => {
  // cleanup() unmounts all renderHook/render trees, running their useEffect cleanups.
  // This must happen BEFORE _resetScrollLockState so that lockCount decrements first.
  cleanup()
  _resetScrollLockState()
  document.body.style.overflow = ''
})

describe('usePreviewModal', () => {
  describe('initial state', () => {
    it('starts closed in desktop mode with replayKey 0', () => {
      const { result } = renderHook(() => usePreviewModal())

      expect(result.current.isOpen).toBe(false)
      expect(result.current.mode).toBe('desktop')
      expect(result.current.replayKey).toBe(0)
    })
  })

  describe('openDesktop', () => {
    it('opens modal in desktop mode and increments replayKey', () => {
      const { result } = renderHook(() => usePreviewModal())

      act(() => {
        result.current.openDesktop()
      })

      expect(result.current.isOpen).toBe(true)
      expect(result.current.mode).toBe('desktop')
      expect(result.current.replayKey).toBe(1)
    })
  })

  describe('openMobile', () => {
    it('opens modal in mobile mode and increments replayKey', () => {
      const { result } = renderHook(() => usePreviewModal())

      act(() => {
        result.current.openMobile()
      })

      expect(result.current.isOpen).toBe(true)
      expect(result.current.mode).toBe('mobile')
      expect(result.current.replayKey).toBe(1)
    })
  })

  describe('close', () => {
    it('closes the modal without changing mode or replayKey', () => {
      const { result } = renderHook(() => usePreviewModal())

      act(() => {
        result.current.openMobile()
      })
      expect(result.current.isOpen).toBe(true)
      const keyBefore = result.current.replayKey

      act(() => {
        result.current.close()
      })

      expect(result.current.isOpen).toBe(false)
      expect(result.current.mode).toBe('mobile') // mode preserved
      expect(result.current.replayKey).toBe(keyBefore) // key not incremented
    })
  })

  describe('replay', () => {
    it('increments replayKey without changing open state or mode', () => {
      const { result } = renderHook(() => usePreviewModal())

      act(() => {
        result.current.openDesktop()
      })
      expect(result.current.replayKey).toBe(1)

      act(() => {
        result.current.replay()
      })

      expect(result.current.replayKey).toBe(2)
      expect(result.current.isOpen).toBe(true)
      expect(result.current.mode).toBe('desktop')
    })
  })

  describe('mode switching', () => {
    it('switching from desktop to mobile changes mode', () => {
      const { result } = renderHook(() => usePreviewModal())

      act(() => {
        result.current.openDesktop()
      })
      expect(result.current.mode).toBe('desktop')

      act(() => {
        result.current.openMobile()
      })
      expect(result.current.mode).toBe('mobile')
      expect(result.current.isOpen).toBe(true)
    })

    it('each open call increments replayKey independently', () => {
      const { result } = renderHook(() => usePreviewModal())

      act(() => {
        result.current.openDesktop()
      })
      expect(result.current.replayKey).toBe(1)

      act(() => {
        result.current.openMobile()
      })
      expect(result.current.replayKey).toBe(2)

      act(() => {
        result.current.openDesktop()
      })
      expect(result.current.replayKey).toBe(3)
    })
  })

  describe('scroll lock integration', () => {
    it('locks scroll when modal is open', () => {
      document.body.style.overflow = ''
      const { result } = renderHook(() => usePreviewModal())

      act(() => {
        result.current.openDesktop()
      })

      expect(document.body.style.overflow).toBe('hidden')
    })

    it('restores scroll when modal is closed', () => {
      document.body.style.overflow = 'auto'
      const { result } = renderHook(() => usePreviewModal())

      act(() => {
        result.current.openDesktop()
      })
      expect(document.body.style.overflow).toBe('hidden')

      act(() => {
        result.current.close()
      })
      expect(document.body.style.overflow).toBe('auto')
    })

    it('restores scroll on unmount while open', () => {
      document.body.style.overflow = 'scroll'
      const { result, unmount } = renderHook(() => usePreviewModal())

      act(() => {
        result.current.openMobile()
      })
      expect(document.body.style.overflow).toBe('hidden')

      unmount()
      expect(document.body.style.overflow).toBe('scroll')
    })
  })

  describe('callback stability', () => {
    it('action functions maintain stable references across re-renders', () => {
      const { result, rerender } = renderHook(() => usePreviewModal())

      const first = {
        openDesktop: result.current.openDesktop,
        openMobile: result.current.openMobile,
        close: result.current.close,
        replay: result.current.replay,
      }

      rerender()

      expect(result.current.openDesktop).toBe(first.openDesktop)
      expect(result.current.openMobile).toBe(first.openMobile)
      expect(result.current.close).toBe(first.close)
      expect(result.current.replay).toBe(first.replay)
    })
  })

  describe('rapid mode switching', () => {
    it('rapid desktop → mobile produces correct final state', () => {
      const { result } = renderHook(() => usePreviewModal())

      act(() => {
        result.current.openDesktop()
      })
      act(() => {
        result.current.openMobile()
      })

      expect(result.current.isOpen).toBe(true)
      expect(result.current.mode).toBe('mobile')
      // Each open call increments replayKey
      expect(result.current.replayKey).toBe(2)
    })

    it('close then open in different mode has correct state', () => {
      const { result } = renderHook(() => usePreviewModal())

      act(() => {
        result.current.openDesktop()
      })
      expect(result.current.mode).toBe('desktop')

      act(() => {
        result.current.close()
      })
      expect(result.current.isOpen).toBe(false)

      act(() => {
        result.current.openMobile()
      })
      expect(result.current.isOpen).toBe(true)
      expect(result.current.mode).toBe('mobile')
      expect(result.current.replayKey).toBe(2)
    })

    it('replay while closed does not affect isOpen', () => {
      const { result } = renderHook(() => usePreviewModal())

      // Replay while closed — should just increment key
      act(() => {
        result.current.replay()
      })

      expect(result.current.isOpen).toBe(false)
      expect(result.current.replayKey).toBe(1)
    })
  })
})
