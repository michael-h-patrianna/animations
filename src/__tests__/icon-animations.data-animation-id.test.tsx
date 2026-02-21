import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { IconAnimationsBounce as CssIconAnimationsBounce } from '@/components/rewards/icon-animations/css/IconAnimationsBounce'
import { IconAnimationsFloat as CssIconAnimationsFloat } from '@/components/rewards/icon-animations/css/IconAnimationsFloat'
import { IconAnimationsPulse as CssIconAnimationsPulse } from '@/components/rewards/icon-animations/css/IconAnimationsPulse'
import { IconAnimationsShake as CssIconAnimationsShake } from '@/components/rewards/icon-animations/css/IconAnimationsShake'
import { IconAnimationsBounce as FramerIconAnimationsBounce } from '@/components/rewards/icon-animations/framer/IconAnimationsBounce'
import { IconAnimationsFloat as FramerIconAnimationsFloat } from '@/components/rewards/icon-animations/framer/IconAnimationsFloat'
import { IconAnimationsPulse as FramerIconAnimationsPulse } from '@/components/rewards/icon-animations/framer/IconAnimationsPulse'
import { IconAnimationsShake as FramerIconAnimationsShake } from '@/components/rewards/icon-animations/framer/IconAnimationsShake'

function expectAnimationIdPresent(Component: () => JSX.Element, animationId: string) {
  const { container } = render(<Component />)
  expect(container.querySelector(`[data-animation-id="${animationId}"]`)).toBeInTheDocument()
}

describe('icon-animations components expose data-animation-id', () => {
  it('for CSS bounce', () => {
    expectAnimationIdPresent(CssIconAnimationsBounce, 'icon-animations__bounce')
  })

  it('for CSS float', () => {
    expectAnimationIdPresent(CssIconAnimationsFloat, 'icon-animations__float')
  })

  it('for CSS pulse', () => {
    expectAnimationIdPresent(CssIconAnimationsPulse, 'icon-animations__pulse')
  })

  it('for CSS shake', () => {
    expectAnimationIdPresent(CssIconAnimationsShake, 'icon-animations__shake')
  })

  it('for Framer bounce', () => {
    expectAnimationIdPresent(FramerIconAnimationsBounce, 'icon-animations__bounce')
  })

  it('for Framer float', () => {
    expectAnimationIdPresent(FramerIconAnimationsFloat, 'icon-animations__float')
  })

  it('for Framer pulse', () => {
    expectAnimationIdPresent(FramerIconAnimationsPulse, 'icon-animations__pulse')
  })

  it('for Framer shake', () => {
    expectAnimationIdPresent(FramerIconAnimationsShake, 'icon-animations__shake')
  })
})
