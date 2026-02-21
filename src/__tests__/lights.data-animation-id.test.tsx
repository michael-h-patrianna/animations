import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import CssLightsCircleStatic1 from '@/components/rewards/lights/css/LightsCircleStatic1'
import CssLightsCircleStatic2 from '@/components/rewards/lights/css/LightsCircleStatic2'
import CssLightsCircleStatic3 from '@/components/rewards/lights/css/LightsCircleStatic3'
import CssLightsCircleStatic4 from '@/components/rewards/lights/css/LightsCircleStatic4'
import CssLightsCircleStatic5 from '@/components/rewards/lights/css/LightsCircleStatic5'
import CssLightsCircleStatic6 from '@/components/rewards/lights/css/LightsCircleStatic6'
import CssLightsCircleStatic7 from '@/components/rewards/lights/css/LightsCircleStatic7'
import CssLightsCircleStatic8 from '@/components/rewards/lights/css/LightsCircleStatic8'
import FramerLightsCircleStatic1 from '@/components/rewards/lights/framer/LightsCircleStatic1'
import FramerLightsCircleStatic2 from '@/components/rewards/lights/framer/LightsCircleStatic2'
import FramerLightsCircleStatic3 from '@/components/rewards/lights/framer/LightsCircleStatic3'
import FramerLightsCircleStatic4 from '@/components/rewards/lights/framer/LightsCircleStatic4'
import FramerLightsCircleStatic5 from '@/components/rewards/lights/framer/LightsCircleStatic5'
import FramerLightsCircleStatic6 from '@/components/rewards/lights/framer/LightsCircleStatic6'
import FramerLightsCircleStatic7 from '@/components/rewards/lights/framer/LightsCircleStatic7'
import FramerLightsCircleStatic8 from '@/components/rewards/lights/framer/LightsCircleStatic8'

function expectAnimationIdPresent(Component: () => JSX.Element, animationId: string) {
  const { container } = render(<Component />)
  expect(container.querySelector(`[data-animation-id="${animationId}"]`)).toBeInTheDocument()
}

describe('lights components expose data-animation-id', () => {
  const suites: Array<{ name: string; component: () => JSX.Element; id: string }> = [
    { name: 'CSS circle-static-1', component: CssLightsCircleStatic1, id: 'lights__circle-static-1' },
    { name: 'CSS circle-static-2', component: CssLightsCircleStatic2, id: 'lights__circle-static-2' },
    { name: 'CSS circle-static-3', component: CssLightsCircleStatic3, id: 'lights__circle-static-3' },
    { name: 'CSS circle-static-4', component: CssLightsCircleStatic4, id: 'lights__circle-static-4' },
    { name: 'CSS circle-static-5', component: CssLightsCircleStatic5, id: 'lights__circle-static-5' },
    { name: 'CSS circle-static-6', component: CssLightsCircleStatic6, id: 'lights__circle-static-6' },
    { name: 'CSS circle-static-7', component: CssLightsCircleStatic7, id: 'lights__circle-static-7' },
    { name: 'CSS circle-static-8', component: CssLightsCircleStatic8, id: 'lights__circle-static-8' },
    { name: 'Framer circle-static-1', component: FramerLightsCircleStatic1, id: 'lights__circle-static-1' },
    { name: 'Framer circle-static-2', component: FramerLightsCircleStatic2, id: 'lights__circle-static-2' },
    { name: 'Framer circle-static-3', component: FramerLightsCircleStatic3, id: 'lights__circle-static-3' },
    { name: 'Framer circle-static-4', component: FramerLightsCircleStatic4, id: 'lights__circle-static-4' },
    { name: 'Framer circle-static-5', component: FramerLightsCircleStatic5, id: 'lights__circle-static-5' },
    { name: 'Framer circle-static-6', component: FramerLightsCircleStatic6, id: 'lights__circle-static-6' },
    { name: 'Framer circle-static-7', component: FramerLightsCircleStatic7, id: 'lights__circle-static-7' },
    { name: 'Framer circle-static-8', component: FramerLightsCircleStatic8, id: 'lights__circle-static-8' },
  ]

  for (const suite of suites) {
    it(`for ${suite.name}`, () => {
      expectAnimationIdPresent(suite.component, suite.id)
    })
  }
})
