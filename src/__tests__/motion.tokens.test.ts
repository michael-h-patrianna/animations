import { describe, expect, it } from 'vitest'
import { motionDurations, motionEasings, overlayOpacity } from '@/motion/tokens'

describe('motion tokens', () => {
  describe('motionDurations', () => {
    it('pulse has the expected duration value', () => {
      expect(motionDurations.pulse).toBe(1.5)
    })

    it('pulseCircle is longer than pulse', () => {
      expect(motionDurations.pulseCircle).toBeGreaterThan(motionDurations.pulse)
    })

    it('all duration values are in a reasonable range (0.1s to 10s)', () => {
      for (const [key, value] of Object.entries(motionDurations)) {
        expect(value, `${key} is out of range`).toBeGreaterThanOrEqual(0.1)
        expect(value, `${key} is out of range`).toBeLessThanOrEqual(10)
      }
    })
  })

  describe('motionEasings', () => {
    it('standard easing has exactly 4 control points (cubic bezier)', () => {
      expect(motionEasings.standard).toHaveLength(4)
    })

    it('standard easing has the expected cubic bezier control points', () => {
      expect(motionEasings.standard).toEqual([0.4, 0, 0.6, 1])
    })
  })

  describe('overlayOpacity', () => {
    it('all values match expected opacity levels', () => {
      expect(overlayOpacity).toEqual({
        subtle: 0.4,
        standard: 0.68,
        strong: 0.85,
      })
    })

    it('subtle < standard < strong (increasing emphasis)', () => {
      expect(overlayOpacity.subtle).toBeLessThan(overlayOpacity.standard)
      expect(overlayOpacity.standard).toBeLessThan(overlayOpacity.strong)
    })

    it('subtle is below 50% (barely visible)', () => {
      expect(overlayOpacity.subtle).toBeLessThanOrEqual(0.5)
    })

    it('strong is above 75% (nearly opaque)', () => {
      expect(overlayOpacity.strong).toBeGreaterThanOrEqual(0.75)
    })
  })
})
