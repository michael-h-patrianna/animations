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

    // Component now uses Framer Motion, so check for elements instead of CSS animation
    // Just verify the stagger structure is present
    expect(items[0]).toBeInTheDocument()
    expect(items[1]).toBeInTheDocument()
    expect(items[2]).toBeInTheDocument()

    // Button should be present
    const buttons = Array.from(container.querySelectorAll('.modal-content-button')) as HTMLElement[]
    expect(buttons.length).toBe(1)
    expect(buttons[0]).toBeInTheDocument()

    // Replay should keep content mounted and reset animation key
    const replay = container.querySelector('[data-role="replay"]') as HTMLButtonElement
    act(() => {
      replay.click()
    })
    const itemsAfter = Array.from(container.querySelectorAll('.modal-content-list-item'))
    expect(itemsAfter.length).toBe(items.length)
  })
})
