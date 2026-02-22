import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ModalCelebrationsFirework as CssModalCelebrationsFirework } from '@/components/rewards/modal-celebrations/css/ModalCelebrationsFirework'
import { ModalCelebrationsFirework as FramerModalCelebrationsFirework } from '@/components/rewards/modal-celebrations/framer/ModalCelebrationsFirework'

const FIREWORK_SELECTOR = '[data-animation-id="modal-celebrations__firework"]'

function expectFireworkStructure(Component: () => JSX.Element) {
  const { container } = render(<Component />)
  const root = container.querySelector(FIREWORK_SELECTOR)

  expect(root).toBeInTheDocument()
  expect(root).toHaveClass('pf-celebration')
  expect(root?.querySelector('.pf-celebration__layer')).toBeInTheDocument()
  expect(root?.querySelectorAll('.mc-firework__particle').length).toBeGreaterThan(0)
}

describe('modal-celebrations firework structure', () => {
  it('renders structured firework layers in CSS variant', () => {
    const { container } = render(<CssModalCelebrationsFirework />)
    const firstParticle = container.querySelector('.mc-firework__particle') as HTMLElement | null

    expectFireworkStructure(CssModalCelebrationsFirework)
    expect(firstParticle?.style.animation).toContain('infinite')
    expect(firstParticle?.style.getPropertyValue('--fw-cycle-duration')).toContain('s')
  })

  it('renders structured firework layers in Framer variant', () => {
    expectFireworkStructure(FramerModalCelebrationsFirework)
  })
})
