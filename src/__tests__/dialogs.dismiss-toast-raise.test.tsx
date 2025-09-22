import { ModalDismissToastRaise } from '@/components/dialogs/modal-dismiss/ModalDismissToastRaise'
import { advanceRaf, withAnimationCard } from '@/test/utils/animationTestUtils'
import { act, render } from '@testing-library/react'

describe('Dialogs • ModalDismissToastRaise', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.useRealTimers()
  })

  it('mounts with initial styles, runs progress timer, and schedules exit; Replay remounts deterministically', async () => {
    const ui = withAnimationCard(<ModalDismissToastRaise />, {
      id: 'dialogs__toast-raise',
      title: 'Toast Raise',
      description: 'Auto-dismiss toast',
      infinite: true, // make visible immediately in card
    })

    const { container, unmount } = render(ui)

    const toast = container.querySelector('.pf-toast') as HTMLElement
    const progress = container.querySelector('.pf-toast__progress-bar') as HTMLElement
    expect(toast).toBeTruthy()
    expect(progress).toBeTruthy()

    // Initial styles are set on mount
    expect(toast.style.opacity).toBe('0')
    expect(toast.style.transform).toContain('translate3d(0, 120%')
    expect(progress.style.transform).toBe('scaleX(1)')

    // Progress bar is animated for 3600ms; advance time to near end
    await advanceRaf(3500)

    // Exit scheduled at 3600ms
    await act(async () => {
      jest.advanceTimersByTime(200)
    })

    // After scheduling exit, element remains mounted
    expect(container.querySelector('.pf-toast')).toBeTruthy()

    // Replay should not throw and keeps the toast present
    const replay = container.querySelector('[data-role="replay"]') as HTMLButtonElement
    expect(replay).toBeTruthy()
    await act(async () => {
      replay.click()
    })
    expect(container.querySelector('.pf-toast')).toBeTruthy()

    // Unmount should cancel animations without error
    expect(() => unmount()).not.toThrow()
  })
})
