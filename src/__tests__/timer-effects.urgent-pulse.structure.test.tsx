import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TimerEffectsUrgentPulse as CssUrgentPulse } from '@/components/realtime/timer-effects/css/TimerEffectsUrgentPulse'
import cssUrgentPulseStyles from '@/components/realtime/timer-effects/css/TimerEffectsUrgentPulse.module.css'
import { TimerEffectsUrgentPulse as FramerUrgentPulse } from '@/components/realtime/timer-effects/framer/TimerEffectsUrgentPulse'
import fmUrgentPulseStyles from '@/components/realtime/timer-effects/framer/TimerEffectsUrgentPulse.module.css'

describe('timer-effects urgent-pulse DOM structure', () => {
  it('CSS variant renders with correct data-animation-id', () => {
    const { container } = render(<CssUrgentPulse />)
    expect(
      container.querySelector('[data-animation-id="timer-effects__urgent-pulse"]')
    ).toBeInTheDocument()
  })

  it('Framer variant renders with same data-animation-id', () => {
    const { container } = render(<FramerUrgentPulse />)
    expect(
      container.querySelector('[data-animation-id="timer-effects__urgent-pulse"]')
    ).toBeInTheDocument()
  })

  it('both variants render the urgent pulse timer display', () => {
    const css = render(<CssUrgentPulse />)
    const framer = render(<FramerUrgentPulse />)

    // Both should have the timer container class
    expect(
      css.container.querySelector(`.${cssUrgentPulseStyles['timer-urgent-pulse']}`)
    ).toBeInTheDocument()
    expect(
      framer.container.querySelector(`.${fmUrgentPulseStyles['timer-urgent-pulse-fm']}`)
    ).toBeInTheDocument()
  })
})
