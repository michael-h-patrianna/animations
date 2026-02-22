import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ModalCelebrationsConfettiBurst as CssModalCelebrationsConfettiBurst } from '@/components/rewards/modal-celebrations/css/ModalCelebrationsConfettiBurst'
import { ModalCelebrationsConfettiBurst as FramerModalCelebrationsConfettiBurst } from '@/components/rewards/modal-celebrations/framer/ModalCelebrationsConfettiBurst'

const ANIMATION_ID = 'modal-celebrations__confetti-burst'
const ROOT_SELECTOR = `[data-animation-id="${ANIMATION_ID}"]`
const SCOPED_ROOT_SELECTOR = `[data-animation-id='${ANIMATION_ID}'].pf-celebration`
const SCOPED_LAYER_SELECTOR = `[data-animation-id='${ANIMATION_ID}'] .pf-celebration__layer`
const SCOPED_PARTICLE_SELECTOR = `[data-animation-id='${ANIMATION_ID}'] .pf-celebration__confetti`

function expectConfettiStructure(Component: () => JSX.Element) {
  const { container } = render(<Component />)
  const root = container.querySelector(ROOT_SELECTOR)

  expect(root).toBeInTheDocument()
  expect(root?.querySelectorAll('.pf-celebration__confetti')).toHaveLength(32)
}

function expectScopedSelectorsInFile(cssRelativePath: string) {
  const css = readFileSync(resolve(process.cwd(), cssRelativePath), 'utf8')

  expect(css).toContain(SCOPED_ROOT_SELECTOR)
  expect(css).toContain(SCOPED_LAYER_SELECTOR)
  expect(css).toContain(SCOPED_PARTICLE_SELECTOR)
}

describe('modal-celebrations confetti-burst', () => {
  it('renders 32 confetti particles in CSS variant', () => {
    expectConfettiStructure(CssModalCelebrationsConfettiBurst)
  })

  it('renders 32 confetti particles in Framer variant', () => {
    expectConfettiStructure(FramerModalCelebrationsConfettiBurst)
  })

  it('keeps confetti-burst selectors scoped in CSS variant stylesheet', () => {
    expectScopedSelectorsInFile(
      'src/components/rewards/modal-celebrations/css/ModalCelebrationsConfettiBurst.css'
    )
  })

  it('keeps confetti-burst selectors scoped in Framer variant stylesheet', () => {
    expectScopedSelectorsInFile(
      'src/components/rewards/modal-celebrations/framer/ModalCelebrationsConfettiBurst.css'
    )
  })
})
