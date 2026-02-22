import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ModalCelebrationsCoinCascade as CssModalCelebrationsCoinCascade } from '@/components/rewards/modal-celebrations/css/ModalCelebrationsCoinCascade'
import { ModalCelebrationsCoinsArc as CssModalCelebrationsCoinsArc } from '@/components/rewards/modal-celebrations/css/ModalCelebrationsCoinsArc'
import { ModalCelebrationsCoinsSwirl as CssModalCelebrationsCoinsSwirl } from '@/components/rewards/modal-celebrations/css/ModalCelebrationsCoinsSwirl'
import { ModalCelebrationsConfettiBurst as CssModalCelebrationsConfettiBurst } from '@/components/rewards/modal-celebrations/css/ModalCelebrationsConfettiBurst'
import { ModalCelebrationsConfettiPulse as CssModalCelebrationsConfettiPulse } from '@/components/rewards/modal-celebrations/css/ModalCelebrationsConfettiPulse'
import { ModalCelebrationsConfettiRain as CssModalCelebrationsConfettiRain } from '@/components/rewards/modal-celebrations/css/ModalCelebrationsConfettiRain'
import { ModalCelebrationsConfettiSpiral as CssModalCelebrationsConfettiSpiral } from '@/components/rewards/modal-celebrations/css/ModalCelebrationsConfettiSpiral'
import { ModalCelebrationsFireworksRing as CssModalCelebrationsFireworksRing } from '@/components/rewards/modal-celebrations/css/ModalCelebrationsFireworksRing'
import { ModalCelebrationsFireworksTriple as CssModalCelebrationsFireworksTriple } from '@/components/rewards/modal-celebrations/css/ModalCelebrationsFireworksTriple'
import { ModalCelebrationsFirework as CssModalCelebrationsFirework } from '@/components/rewards/modal-celebrations/css/ModalCelebrationsFirework'
import { ModalCelebrationsTreasureParticles as CssModalCelebrationsTreasureParticles } from '@/components/rewards/modal-celebrations/css/ModalCelebrationsTreasureParticles'
import { ModalCelebrationsCoinCascade as FramerModalCelebrationsCoinCascade } from '@/components/rewards/modal-celebrations/framer/ModalCelebrationsCoinCascade'
import { ModalCelebrationsCoinsArc as FramerModalCelebrationsCoinsArc } from '@/components/rewards/modal-celebrations/framer/ModalCelebrationsCoinsArc'
import { ModalCelebrationsCoinsSwirl as FramerModalCelebrationsCoinsSwirl } from '@/components/rewards/modal-celebrations/framer/ModalCelebrationsCoinsSwirl'
import { ModalCelebrationsConfettiBurst as FramerModalCelebrationsConfettiBurst } from '@/components/rewards/modal-celebrations/framer/ModalCelebrationsConfettiBurst'
import { ModalCelebrationsConfettiPulse as FramerModalCelebrationsConfettiPulse } from '@/components/rewards/modal-celebrations/framer/ModalCelebrationsConfettiPulse'
import { ModalCelebrationsConfettiRain as FramerModalCelebrationsConfettiRain } from '@/components/rewards/modal-celebrations/framer/ModalCelebrationsConfettiRain'
import { ModalCelebrationsConfettiSpiral as FramerModalCelebrationsConfettiSpiral } from '@/components/rewards/modal-celebrations/framer/ModalCelebrationsConfettiSpiral'
import { ModalCelebrationsFireworksRing as FramerModalCelebrationsFireworksRing } from '@/components/rewards/modal-celebrations/framer/ModalCelebrationsFireworksRing'
import { ModalCelebrationsFireworksTriple as FramerModalCelebrationsFireworksTriple } from '@/components/rewards/modal-celebrations/framer/ModalCelebrationsFireworksTriple'
import { ModalCelebrationsFirework as FramerModalCelebrationsFirework } from '@/components/rewards/modal-celebrations/framer/ModalCelebrationsFirework'
import { ModalCelebrationsTreasureParticles as FramerModalCelebrationsTreasureParticles } from '@/components/rewards/modal-celebrations/framer/ModalCelebrationsTreasureParticles'

function expectAnimationIdPresent(Component: () => JSX.Element, animationId: string) {
  const { container } = render(<Component />)
  expect(container.querySelector(`[data-animation-id="${animationId}"]`)).toBeInTheDocument()
}

describe('modal-celebrations components expose data-animation-id', () => {
  const suites: Array<{ name: string; component: () => JSX.Element; id: string }> = [
    { name: 'CSS coin-cascade', component: CssModalCelebrationsCoinCascade, id: 'modal-celebrations__coin-cascade' },
    { name: 'CSS coins-arc', component: CssModalCelebrationsCoinsArc, id: 'modal-celebrations__coins-arc' },
    { name: 'CSS coins-swirl', component: CssModalCelebrationsCoinsSwirl, id: 'modal-celebrations__coins-swirl' },
    { name: 'CSS confetti-burst', component: CssModalCelebrationsConfettiBurst, id: 'modal-celebrations__confetti-burst' },
    { name: 'CSS confetti-pulse', component: CssModalCelebrationsConfettiPulse, id: 'modal-celebrations__confetti-pulse' },
    { name: 'CSS confetti-rain', component: CssModalCelebrationsConfettiRain, id: 'modal-celebrations__confetti-rain' },
    { name: 'CSS confetti-spiral', component: CssModalCelebrationsConfettiSpiral, id: 'modal-celebrations__confetti-spiral' },
    { name: 'CSS fireworks-ring', component: CssModalCelebrationsFireworksRing, id: 'modal-celebrations__fireworks-ring' },
    { name: 'CSS fireworks-triple', component: CssModalCelebrationsFireworksTriple, id: 'modal-celebrations__fireworks-triple' },
    { name: 'CSS firework', component: CssModalCelebrationsFirework, id: 'modal-celebrations__firework' },
    { name: 'CSS treasure-particles', component: CssModalCelebrationsTreasureParticles, id: 'modal-celebrations__treasure-particles' },
    { name: 'Framer coin-cascade', component: FramerModalCelebrationsCoinCascade, id: 'modal-celebrations__coin-cascade' },
    { name: 'Framer coins-arc', component: FramerModalCelebrationsCoinsArc, id: 'modal-celebrations__coins-arc' },
    { name: 'Framer coins-swirl', component: FramerModalCelebrationsCoinsSwirl, id: 'modal-celebrations__coins-swirl' },
    { name: 'Framer confetti-burst', component: FramerModalCelebrationsConfettiBurst, id: 'modal-celebrations__confetti-burst' },
    { name: 'Framer confetti-pulse', component: FramerModalCelebrationsConfettiPulse, id: 'modal-celebrations__confetti-pulse' },
    { name: 'Framer confetti-rain', component: FramerModalCelebrationsConfettiRain, id: 'modal-celebrations__confetti-rain' },
    { name: 'Framer confetti-spiral', component: FramerModalCelebrationsConfettiSpiral, id: 'modal-celebrations__confetti-spiral' },
    { name: 'Framer fireworks-ring', component: FramerModalCelebrationsFireworksRing, id: 'modal-celebrations__fireworks-ring' },
    { name: 'Framer fireworks-triple', component: FramerModalCelebrationsFireworksTriple, id: 'modal-celebrations__fireworks-triple' },
    { name: 'Framer firework', component: FramerModalCelebrationsFirework, id: 'modal-celebrations__firework' },
    {
      name: 'Framer treasure-particles',
      component: FramerModalCelebrationsTreasureParticles,
      id: 'modal-celebrations__treasure-particles',
    },
  ]

  for (const suite of suites) {
    it(`for ${suite.name}`, () => {
      expectAnimationIdPresent(suite.component, suite.id)
    })
  }
})
