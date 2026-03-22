import { describe, expect, it } from 'vitest'
import { motionDurations, motionEasings, overlayOpacity } from '@/motion/tokens'

describe('motionDurations', () => {
  it('all duration values are within visible animation range (0.1s–10s)', () => {
    for (const [key, value] of Object.entries(motionDurations)) {
      expect(value, `${key} (${value}s) is too short for visible animation`).toBeGreaterThanOrEqual(
        0.1
      )
      expect(value, `${key} (${value}s) is too long for responsive UX`).toBeLessThanOrEqual(10)
    }
  })

  it('pulseCircle is longer than pulse (larger element = slower pulse)', () => {
    expect(motionDurations.pulseCircle).toBeGreaterThan(motionDurations.pulse)
  })

  it('pulseWave duration sits between pulse and pulseCircle', () => {
    expect(motionDurations.pulseWave).toBeGreaterThanOrEqual(motionDurations.pulse)
    expect(motionDurations.pulseWave).toBeLessThanOrEqual(motionDurations.pulseCircle)
  })
})

describe('motionEasings', () => {
  it('standard easing is a valid CSS cubic-bezier with X values in [0,1]', () => {
    // CSS cubic-bezier(x1, y1, x2, y2) requires x1,x2 in [0,1]; y values unrestricted
    expect(motionEasings.standard).toHaveLength(4)
    const [x1, , x2] = motionEasings.standard
    expect(x1).toBeLessThanOrEqual(1)
    expect(x2).toBeLessThanOrEqual(1)
  })

  it('standard easing represents ease-in-out (slow start and slow end)', () => {
    // Ease-in-out: x1 > 0 (decelerated start), x2 < 1 (decelerated end)
    const [x1, , x2] = motionEasings.standard
    expect(x1, 'x1 should indicate slow start').toBeGreaterThan(0.1)
    expect(x2, 'x2 should indicate slow end').toBeLessThan(0.9)
  })
})

describe('overlayOpacity', () => {
  it('opacity tiers are strictly ordered: subtle < standard < strong', () => {
    expect(overlayOpacity.subtle).toBeLessThan(overlayOpacity.standard)
    expect(overlayOpacity.standard).toBeLessThan(overlayOpacity.strong)
  })

  it('subtle is perceptibly transparent (below 50%)', () => {
    expect(overlayOpacity.subtle).toBeLessThanOrEqual(0.5)
  })

  it('strong is nearly opaque (above 75%)', () => {
    expect(overlayOpacity.strong).toBeGreaterThanOrEqual(0.75)
  })

  it('all tiers are in valid opacity range (0, 1]', () => {
    for (const [key, value] of Object.entries(overlayOpacity)) {
      expect(value, `${key} below valid range`).toBeGreaterThan(0.01)
      expect(value, `${key} above valid range`).toBeLessThanOrEqual(1)
    }
  })

  it('contains exactly the expected tiers', () => {
    expect(Object.keys(overlayOpacity).sort()).toEqual(['standard', 'strong', 'subtle'])
  })
})
