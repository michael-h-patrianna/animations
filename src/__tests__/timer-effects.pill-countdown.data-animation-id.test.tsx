import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TimerEffectsPillCountdownGlitch as CssTimerEffectsPillCountdownGlitch } from '@/components/realtime/timer-effects/css/TimerEffectsPillCountdownGlitch'
import { TimerEffectsPillCountdownHeartbeat as CssTimerEffectsPillCountdownHeartbeat } from '@/components/realtime/timer-effects/css/TimerEffectsPillCountdownHeartbeat'
import { TimerEffectsPillCountdownGlitch as FramerTimerEffectsPillCountdownGlitch } from '@/components/realtime/timer-effects/framer/TimerEffectsPillCountdownGlitch'
import { TimerEffectsPillCountdownHeartbeat as FramerTimerEffectsPillCountdownHeartbeat } from '@/components/realtime/timer-effects/framer/TimerEffectsPillCountdownHeartbeat'

function expectAnimationIdPresent(Component: () => JSX.Element, animationId: string) {
  const { container } = render(<Component />)
  expect(container.querySelector(`[data-animation-id="${animationId}"]`)).toBeInTheDocument()
}

describe('timer-effects pill-countdown components expose data-animation-id', () => {
  it('for CSS glitch', () => {
    expectAnimationIdPresent(CssTimerEffectsPillCountdownGlitch, 'timer-effects__pill-countdown-glitch')
  })

  it('for CSS heartbeat', () => {
    expectAnimationIdPresent(CssTimerEffectsPillCountdownHeartbeat, 'timer-effects__pill-countdown-heartbeat')
  })

  it('for Framer glitch', () => {
    expectAnimationIdPresent(FramerTimerEffectsPillCountdownGlitch, 'timer-effects__pill-countdown-glitch')
  })

  it('for Framer heartbeat', () => {
    expectAnimationIdPresent(FramerTimerEffectsPillCountdownHeartbeat, 'timer-effects__pill-countdown-heartbeat')
  })
})
