import { describe, expect, it } from 'vitest'
import {
  createLoopTransition,
  createOverlayStyle,
  loopTransition,
  overlayStyles,
} from '@/motion/primitives'
import { motionDurations, motionEasings, overlayOpacity } from '@/motion/tokens'

describe('createLoopTransition', () => {
  it('creates a transition with the given duration and infinite repeat', () => {
    const t = createLoopTransition(2.5)
    expect(t.duration).toBe(2.5)
    expect(t.repeat).toBe(Infinity)
    expect(t.repeatType).toBe('loop')
  })

  it('uses standard easing from tokens', () => {
    const t = createLoopTransition(1)
    expect(t.ease).toEqual(motionEasings.standard)
  })

  it('defaults delay to 0 when not provided', () => {
    const t = createLoopTransition(1)
    expect(t.delay).toBe(0)
  })

  it('accepts a custom delay', () => {
    const t = createLoopTransition(1, 0.5)
    expect(t.delay).toBe(0.5)
  })

  it('produces a complete infinite-loop transition from a single call', () => {
    const t = createLoopTransition(3, 0.2)
    expect(t).toEqual({
      duration: 3,
      delay: 0.2,
      ease: motionEasings.standard,
      repeat: Infinity,
      repeatType: 'loop',
    })
  })
})

describe('loopTransition', () => {
  it('uses the pulse duration token', () => {
    expect(loopTransition.duration).toBe(motionDurations.pulse)
  })

  it('has no delay', () => {
    expect(loopTransition.delay).toBe(0)
  })

  it('loops infinitely', () => {
    expect(loopTransition.repeat).toBe(Infinity)
  })
})

describe('createOverlayStyle', () => {
  it('produces a CSSProperties object with --overlay-opacity as string', () => {
    const style = createOverlayStyle(0.5)
    expect((style as Record<string, string>)['--overlay-opacity']).toBe('0.5')
  })

  it('handles boundary value 0', () => {
    const style = createOverlayStyle(0)
    expect((style as Record<string, string>)['--overlay-opacity']).toBe('0')
  })

  it('handles boundary value 1', () => {
    const style = createOverlayStyle(1)
    expect((style as Record<string, string>)['--overlay-opacity']).toBe('1')
  })

  it('converts float to exact string representation', () => {
    const style = createOverlayStyle(0.68)
    expect((style as Record<string, string>)['--overlay-opacity']).toBe('0.68')
  })
})

describe('overlayStyles', () => {
  it('subtle uses the subtle token value', () => {
    expect((overlayStyles.subtle as Record<string, string>)['--overlay-opacity']).toBe(
      overlayOpacity.subtle.toString()
    )
  })

  it('standard uses the standard token value', () => {
    expect((overlayStyles.standard as Record<string, string>)['--overlay-opacity']).toBe(
      overlayOpacity.standard.toString()
    )
  })

  it('strong uses the strong token value', () => {
    expect((overlayStyles.strong as Record<string, string>)['--overlay-opacity']).toBe(
      overlayOpacity.strong.toString()
    )
  })

  it('all three presets produce unique values', () => {
    const values = new Set([
      (overlayStyles.subtle as Record<string, string>)['--overlay-opacity'],
      (overlayStyles.standard as Record<string, string>)['--overlay-opacity'],
      (overlayStyles.strong as Record<string, string>)['--overlay-opacity'],
    ])
    expect(values.size).toBe(3)
  })
})
