import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StandardEffectsBlink as CssStandardEffectsBlink } from '@/components/base/standard-effects/css/StandardEffectsBlink'
import { StandardEffectsBounce as CssStandardEffectsBounce } from '@/components/base/standard-effects/css/StandardEffectsBounce'
import { StandardEffectsFade as CssStandardEffectsFade } from '@/components/base/standard-effects/css/StandardEffectsFade'
import { StandardEffectsFlip as CssStandardEffectsFlip } from '@/components/base/standard-effects/css/StandardEffectsFlip'
import { StandardEffectsFloat as CssStandardEffectsFloat } from '@/components/base/standard-effects/css/StandardEffectsFloat'
import { StandardEffectsHeartbeat as CssStandardEffectsHeartbeat } from '@/components/base/standard-effects/css/StandardEffectsHeartbeat'
import { StandardEffectsJello as CssStandardEffectsJello } from '@/components/base/standard-effects/css/StandardEffectsJello'
import { StandardEffectsPop as CssStandardEffectsPop } from '@/components/base/standard-effects/css/StandardEffectsPop'
import { StandardEffectsPulse as CssStandardEffectsPulse } from '@/components/base/standard-effects/css/StandardEffectsPulse'
import { StandardEffectsPulseCircle as CssStandardEffectsPulseCircle } from '@/components/base/standard-effects/css/StandardEffectsPulseCircle'
import { StandardEffectsPulseWave as CssStandardEffectsPulseWave } from '@/components/base/standard-effects/css/StandardEffectsPulseWave'
import { StandardEffectsRadialPulse as CssStandardEffectsRadialPulse } from '@/components/base/standard-effects/css/StandardEffectsRadialPulse'
import { StandardEffectsRubberBand as CssStandardEffectsRubberBand } from '@/components/base/standard-effects/css/StandardEffectsRubberBand'
import { StandardEffectsScale as CssStandardEffectsScale } from '@/components/base/standard-effects/css/StandardEffectsScale'
import { StandardEffectsShake as CssStandardEffectsShake } from '@/components/base/standard-effects/css/StandardEffectsShake'
import { StandardEffectsSlide as CssStandardEffectsSlide } from '@/components/base/standard-effects/css/StandardEffectsSlide'
import { StandardEffectsSpin as CssStandardEffectsSpin } from '@/components/base/standard-effects/css/StandardEffectsSpin'
import { StandardEffectsSqueeze as CssStandardEffectsSqueeze } from '@/components/base/standard-effects/css/StandardEffectsSqueeze'
import { StandardEffectsSwing as CssStandardEffectsSwing } from '@/components/base/standard-effects/css/StandardEffectsSwing'
import { StandardEffectsTada as CssStandardEffectsTada } from '@/components/base/standard-effects/css/StandardEffectsTada'
import { StandardEffectsWiggle as CssStandardEffectsWiggle } from '@/components/base/standard-effects/css/StandardEffectsWiggle'
import { StandardEffectsBlink as FramerStandardEffectsBlink } from '@/components/base/standard-effects/framer/StandardEffectsBlink'
import { StandardEffectsBounce as FramerStandardEffectsBounce } from '@/components/base/standard-effects/framer/StandardEffectsBounce'
import { StandardEffectsFade as FramerStandardEffectsFade } from '@/components/base/standard-effects/framer/StandardEffectsFade'
import { StandardEffectsFlip as FramerStandardEffectsFlip } from '@/components/base/standard-effects/framer/StandardEffectsFlip'
import { StandardEffectsFloat as FramerStandardEffectsFloat } from '@/components/base/standard-effects/framer/StandardEffectsFloat'
import { StandardEffectsHeartbeat as FramerStandardEffectsHeartbeat } from '@/components/base/standard-effects/framer/StandardEffectsHeartbeat'
import { StandardEffectsJello as FramerStandardEffectsJello } from '@/components/base/standard-effects/framer/StandardEffectsJello'
import { StandardEffectsPop as FramerStandardEffectsPop } from '@/components/base/standard-effects/framer/StandardEffectsPop'
import { StandardEffectsPulse as FramerStandardEffectsPulse } from '@/components/base/standard-effects/framer/StandardEffectsPulse'
import { StandardEffectsPulseCircle as FramerStandardEffectsPulseCircle } from '@/components/base/standard-effects/framer/StandardEffectsPulseCircle'
import { StandardEffectsPulseWave as FramerStandardEffectsPulseWave } from '@/components/base/standard-effects/framer/StandardEffectsPulseWave'
import { StandardEffectsRadialPulse as FramerStandardEffectsRadialPulse } from '@/components/base/standard-effects/framer/StandardEffectsRadialPulse'
import { StandardEffectsRubberBand as FramerStandardEffectsRubberBand } from '@/components/base/standard-effects/framer/StandardEffectsRubberBand'
import { StandardEffectsScale as FramerStandardEffectsScale } from '@/components/base/standard-effects/framer/StandardEffectsScale'
import { StandardEffectsShake as FramerStandardEffectsShake } from '@/components/base/standard-effects/framer/StandardEffectsShake'
import { StandardEffectsSlide as FramerStandardEffectsSlide } from '@/components/base/standard-effects/framer/StandardEffectsSlide'
import { StandardEffectsSpin as FramerStandardEffectsSpin } from '@/components/base/standard-effects/framer/StandardEffectsSpin'
import { StandardEffectsSqueeze as FramerStandardEffectsSqueeze } from '@/components/base/standard-effects/framer/StandardEffectsSqueeze'
import { StandardEffectsSwing as FramerStandardEffectsSwing } from '@/components/base/standard-effects/framer/StandardEffectsSwing'
import { StandardEffectsTada as FramerStandardEffectsTada } from '@/components/base/standard-effects/framer/StandardEffectsTada'
import { StandardEffectsWiggle as FramerStandardEffectsWiggle } from '@/components/base/standard-effects/framer/StandardEffectsWiggle'

function expectAnimationIdPresent(Component: () => JSX.Element, animationId: string) {
  const { container } = render(<Component />)
  expect(container.querySelector(`[data-animation-id="${animationId}"]`)).toBeInTheDocument()
}

describe('standard-effects components expose data-animation-id', () => {
  const suites: Array<{ name: string; component: () => JSX.Element; id: string }> = [
    { name: 'CSS blink', component: CssStandardEffectsBlink, id: 'standard-effects__blink' },
    { name: 'CSS bounce', component: CssStandardEffectsBounce, id: 'standard-effects__bounce' },
    { name: 'CSS fade', component: CssStandardEffectsFade, id: 'standard-effects__fade' },
    { name: 'CSS flip', component: CssStandardEffectsFlip, id: 'standard-effects__flip' },
    { name: 'CSS float', component: CssStandardEffectsFloat, id: 'standard-effects__float' },
    { name: 'CSS heartbeat', component: CssStandardEffectsHeartbeat, id: 'standard-effects__heartbeat' },
    { name: 'CSS jello', component: CssStandardEffectsJello, id: 'standard-effects__jello' },
    { name: 'CSS pop', component: CssStandardEffectsPop, id: 'standard-effects__pop' },
    { name: 'CSS pulse', component: CssStandardEffectsPulse, id: 'standard-effects__pulse' },
    { name: 'CSS pulse circle', component: CssStandardEffectsPulseCircle, id: 'standard-effects__pulse-circle' },
    { name: 'CSS pulse wave', component: CssStandardEffectsPulseWave, id: 'standard-effects__pulse-wave' },
    { name: 'CSS radial pulse', component: CssStandardEffectsRadialPulse, id: 'standard-effects__radial-pulse' },
    { name: 'CSS rubber band', component: CssStandardEffectsRubberBand, id: 'standard-effects__rubber-band' },
    { name: 'CSS scale', component: CssStandardEffectsScale, id: 'standard-effects__scale' },
    { name: 'CSS shake', component: CssStandardEffectsShake, id: 'standard-effects__shake' },
    { name: 'CSS slide', component: CssStandardEffectsSlide, id: 'standard-effects__slide' },
    { name: 'CSS spin', component: CssStandardEffectsSpin, id: 'standard-effects__spin' },
    { name: 'CSS squeeze', component: CssStandardEffectsSqueeze, id: 'standard-effects__squeeze' },
    { name: 'CSS swing', component: CssStandardEffectsSwing, id: 'standard-effects__swing' },
    { name: 'CSS tada', component: CssStandardEffectsTada, id: 'standard-effects__tada' },
    { name: 'CSS wiggle', component: CssStandardEffectsWiggle, id: 'standard-effects__wiggle' },
    { name: 'Framer blink', component: FramerStandardEffectsBlink, id: 'standard-effects__blink' },
    { name: 'Framer bounce', component: FramerStandardEffectsBounce, id: 'standard-effects__bounce' },
    { name: 'Framer fade', component: FramerStandardEffectsFade, id: 'standard-effects__fade' },
    { name: 'Framer flip', component: FramerStandardEffectsFlip, id: 'standard-effects__flip' },
    { name: 'Framer float', component: FramerStandardEffectsFloat, id: 'standard-effects__float' },
    { name: 'Framer heartbeat', component: FramerStandardEffectsHeartbeat, id: 'standard-effects__heartbeat' },
    { name: 'Framer jello', component: FramerStandardEffectsJello, id: 'standard-effects__jello' },
    { name: 'Framer pop', component: FramerStandardEffectsPop, id: 'standard-effects__pop' },
    { name: 'Framer pulse', component: FramerStandardEffectsPulse, id: 'standard-effects__pulse' },
    { name: 'Framer pulse circle', component: FramerStandardEffectsPulseCircle, id: 'standard-effects__pulse-circle' },
    { name: 'Framer pulse wave', component: FramerStandardEffectsPulseWave, id: 'standard-effects__pulse-wave' },
    { name: 'Framer radial pulse', component: FramerStandardEffectsRadialPulse, id: 'standard-effects__radial-pulse' },
    { name: 'Framer rubber band', component: FramerStandardEffectsRubberBand, id: 'standard-effects__rubber-band' },
    { name: 'Framer scale', component: FramerStandardEffectsScale, id: 'standard-effects__scale' },
    { name: 'Framer shake', component: FramerStandardEffectsShake, id: 'standard-effects__shake' },
    { name: 'Framer slide', component: FramerStandardEffectsSlide, id: 'standard-effects__slide' },
    { name: 'Framer spin', component: FramerStandardEffectsSpin, id: 'standard-effects__spin' },
    { name: 'Framer squeeze', component: FramerStandardEffectsSqueeze, id: 'standard-effects__squeeze' },
    { name: 'Framer swing', component: FramerStandardEffectsSwing, id: 'standard-effects__swing' },
    { name: 'Framer tada', component: FramerStandardEffectsTada, id: 'standard-effects__tada' },
    { name: 'Framer wiggle', component: FramerStandardEffectsWiggle, id: 'standard-effects__wiggle' },
  ]

  for (const suite of suites) {
    it(`for ${suite.name}`, () => {
      expectAnimationIdPresent(suite.component, suite.id)
    })
  }
})
