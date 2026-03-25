import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { TimerEffectsTimerFlash as CssTimerEffectsTimerFlash } from '@/components/realtime/timer-effects/css/TimerEffectsTimerFlash'
import {
  computeUrgencyColor,
  FLASH_CRITICAL_RGB,
  FLASH_NORMAL_RGB,
} from '@/components/realtime/timer-effects/SharedFormat'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

function readUrgencyStyles(pill: HTMLElement) {
  return {
    backgroundColor: pill.style.backgroundColor,
    pulseDurationSeconds: Number.parseFloat(
      pill.style.getPropertyValue('--timer-effects-timer-flash-pulse-duration')
    ),
    pulseScale: Number.parseFloat(
      pill.style.getPropertyValue('--timer-effects-timer-flash-pulse-scale')
    ),
    glowScale: Number.parseFloat(
      pill.style.getPropertyValue('--timer-effects-timer-flash-glow-scale')
    ),
    glowOpacity: Number.parseFloat(
      pill.style.getPropertyValue('--timer-effects-timer-flash-glow-opacity')
    ),
  }
}

describe('timer-effects timer-flash configurable urgency choreography', () => {
  it('derives initial CSS urgency choreography from configured startSeconds', () => {
    render(<CssTimerEffectsTimerFlash />)
    render(<CssTimerEffectsTimerFlash startSeconds={12} />)

    const [defaultPill, shortPill] = screen.getAllByTestId('timer-flash-pill')
    const defaultStyles = readUrgencyStyles(defaultPill)
    const shortStyles = readUrgencyStyles(shortPill)

    expect(defaultStyles.backgroundColor).toBe(
      computeUrgencyColor(32, 30, FLASH_NORMAL_RGB, FLASH_CRITICAL_RGB)
    )
    expect(defaultStyles.pulseDurationSeconds).toBeCloseTo(1, 2)
    expect(defaultStyles.pulseScale).toBeCloseTo(1, 2)
    expect(defaultStyles.glowScale).toBeCloseTo(0.95, 2)
    expect(defaultStyles.glowOpacity).toBeCloseTo(0, 2)

    expect(shortStyles.backgroundColor).toBe(
      computeUrgencyColor(12, 30, FLASH_NORMAL_RGB, FLASH_CRITICAL_RGB)
    )
    expect(shortStyles.pulseDurationSeconds).toBeLessThan(defaultStyles.pulseDurationSeconds)
    expect(shortStyles.pulseScale).toBeGreaterThan(defaultStyles.pulseScale)
    expect(shortStyles.glowScale).toBeGreaterThan(defaultStyles.glowScale)
    expect(shortStyles.glowOpacity).toBeGreaterThan(defaultStyles.glowOpacity)
  })

  it('updates CSS urgency choreography as the configured countdown enters warning', () => {
    render(<CssTimerEffectsTimerFlash startSeconds={12} warningThreshold={6} />)

    const pill = screen.getByTestId('timer-flash-pill')
    const initialStyles = readUrgencyStyles(pill)

    expect(initialStyles.backgroundColor).toBe(
      computeUrgencyColor(12, 6, FLASH_NORMAL_RGB, FLASH_CRITICAL_RGB)
    )
    expect(initialStyles.pulseDurationSeconds).toBeCloseTo(1, 2)
    expect(initialStyles.pulseScale).toBeCloseTo(1, 2)
    expect(initialStyles.glowOpacity).toBeCloseTo(0, 2)

    act(() => {
      vi.advanceTimersByTime(8000)
    })

    const warningStyles = readUrgencyStyles(pill)

    expect(warningStyles.backgroundColor).toBe(
      computeUrgencyColor(4, 6, FLASH_NORMAL_RGB, FLASH_CRITICAL_RGB)
    )
    expect(warningStyles.pulseDurationSeconds).toBeLessThan(initialStyles.pulseDurationSeconds)
    expect(warningStyles.pulseScale).toBeGreaterThan(initialStyles.pulseScale)
    expect(warningStyles.glowScale).toBeGreaterThan(initialStyles.glowScale)
    expect(warningStyles.glowOpacity).toBeGreaterThan(initialStyles.glowOpacity)
  })
})
