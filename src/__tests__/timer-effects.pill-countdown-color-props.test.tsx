import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TimerEffectsPillCountdownGlitch as CssGlitch } from '@/components/realtime/timer-effects/css/TimerEffectsPillCountdownGlitch'
import { TimerEffectsPillCountdownHeartbeat as CssHeartbeat } from '@/components/realtime/timer-effects/css/TimerEffectsPillCountdownHeartbeat'
import { TimerEffectsPillCountdownGlitch as FramerGlitch } from '@/components/realtime/timer-effects/framer/TimerEffectsPillCountdownGlitch'
import { TimerEffectsPillCountdownHeartbeat as FramerHeartbeat } from '@/components/realtime/timer-effects/framer/TimerEffectsPillCountdownHeartbeat'

const NORMAL_COLOR = '#123456'
const WARNING_COLOR = '#b45309'
const CRITICAL_COLOR = '#dc2626'

type VariantCase = {
  label: string
  selector: string
  renderPill: (startSeconds: number) => HTMLElement
}

function buildTimerProps(startSeconds: number) {
  return {
    startSeconds,
    normalColor: NORMAL_COLOR,
    warningColor: WARNING_COLOR,
    criticalColor: CRITICAL_COLOR,
  }
}

function getPill(container: HTMLElement, selector: string): HTMLElement {
  const pill = container.querySelector(selector)
  if (pill == null) throw new Error(`Pill element not found: ${selector}`)
  return pill as HTMLElement
}

function expectThemedSurfaceStyle(pill: HTMLElement, expectedColor: string) {
  const inlineStyle = pill.getAttribute('style') ?? ''

  expect(inlineStyle).toContain('background: linear-gradient(')
  expect(inlineStyle).toContain(expectedColor)
  expect(inlineStyle).toContain('--glow-color')
}

const cases: VariantCase[] = [
  {
    label: 'CSS heartbeat',
    selector: '.pf-pill-countdown-heartbeat',
    renderPill: (startSeconds) =>
      getPill(
        render(<CssHeartbeat {...buildTimerProps(startSeconds)} />).container,
        '.pf-pill-countdown-heartbeat'
      ),
  },
  {
    label: 'Framer heartbeat',
    selector: '.pf-pill-countdown-heartbeat',
    renderPill: (startSeconds) =>
      getPill(
        render(<FramerHeartbeat {...buildTimerProps(startSeconds)} />).container,
        '.pf-pill-countdown-heartbeat'
      ),
  },
  {
    label: 'CSS glitch',
    selector: '.pf-pill-countdown-glitch',
    renderPill: (startSeconds) =>
      getPill(
        render(<CssGlitch {...buildTimerProps(startSeconds)} />).container,
        '.pf-pill-countdown-glitch'
      ),
  },
  {
    label: 'Framer glitch',
    selector: '.pf-pill-countdown-glitch',
    renderPill: (startSeconds) =>
      getPill(
        render(<FramerGlitch {...buildTimerProps(startSeconds)} />).container,
        '.pf-pill-countdown-glitch'
      ),
  },
]

describe('timer effect pill countdown color props', () => {
  it.each(cases)('applies themed pill surfaces for %s across urgency phases', ({ renderPill }) => {
    expectThemedSurfaceStyle(renderPill(60), NORMAL_COLOR)
    expectThemedSurfaceStyle(renderPill(20), WARNING_COLOR)
    expectThemedSurfaceStyle(renderPill(5), CRITICAL_COLOR)
  })

  it.each(cases.filter((testCase) => testCase.selector === '.pf-pill-countdown-glitch'))(
    'themes glitch copy colors alongside the selected phase color for %s',
    ({ renderPill }) => {
      const inlineStyle = renderPill(5).getAttribute('style') ?? ''

      expect(inlineStyle).toContain('--timer-effects-pill-countdown-glitch-color-1')
      expect(inlineStyle).toContain('--timer-effects-pill-countdown-glitch-bg-1-ff')
      expect(inlineStyle).toContain(CRITICAL_COLOR)
    }
  )
})
