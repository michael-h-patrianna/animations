import { ModalContentListSoftStagger } from '@/components/dialogs/modal-content/ModalContentListSoftStagger'
import { withAnimationCard } from '@/test/utils/animationTestUtils'
import { act, render } from '@testing-library/react'

describe('Dialogs • ModalContentListSoftStagger', () => {
  it('applies staggered animation delays to list items and buttons; Replay remounts', () => {
    const ui = withAnimationCard(<ModalContentListSoftStagger />, {
      id: 'dialogs__modal-content-soft-stagger',
      title: 'Content Soft Stagger',
      description: 'Staggered content for modal',
    })

    const { container } = render(ui)

    const items = Array.from(container.querySelectorAll('.modal-content-list-item')) as HTMLElement[]
    expect(items.length).toBeGreaterThanOrEqual(5)

    // First three items should have increasing delays 300ms, 360ms, 420ms
    expect(items[0].style.animation).toContain('300ms')
    expect(items[1].style.animation).toContain('360ms')
    expect(items[2].style.animation).toContain('420ms')

    // Buttons should have delays 550ms and 620ms respectively
    const buttons = Array.from(container.querySelectorAll('.modal-content-button')) as HTMLElement[]
    expect(buttons.length).toBe(2)
    expect(buttons[0].style.animation).toContain('550ms')
    expect(buttons[1].style.animation).toContain('620ms')

    // Replay should keep content mounted and reset animation key
    const replay = container.querySelector('[data-role="replay"]') as HTMLButtonElement
    act(() => {
      replay.click()
    })
    const itemsAfter = Array.from(container.querySelectorAll('.modal-content-list-item'))
    expect(itemsAfter.length).toBe(items.length)
  })
})
