import { formatTime } from '@/components/realtime/timer-effects/SharedFormat'
import { describe, expect, it } from 'vitest'

describe('formatTime', () => {
  it('formats zero as 00:00', () => {
    expect(formatTime(0)).toBe('00:00')
  })

  it('formats single-digit seconds with zero-padding', () => {
    expect(formatTime(5)).toBe('00:05')
  })

  it('formats double-digit seconds', () => {
    expect(formatTime(45)).toBe('00:45')
  })

  it('formats exactly 60 seconds as 01:00', () => {
    expect(formatTime(60)).toBe('01:00')
  })

  it('formats minutes and seconds correctly', () => {
    expect(formatTime(90)).toBe('01:30')
    expect(formatTime(125)).toBe('02:05')
  })

  it('formats large values (> 60 minutes)', () => {
    expect(formatTime(3661)).toBe('61:01')
  })

  it('clamps negative values to 00:00', () => {
    expect(formatTime(-1)).toBe('00:00')
    expect(formatTime(-100)).toBe('00:00')
  })

  it('handles boundary at 59 seconds', () => {
    expect(formatTime(59)).toBe('00:59')
  })

  it('handles boundary at 59 minutes 59 seconds', () => {
    expect(formatTime(3599)).toBe('59:59')
  })

  it('pads single-digit minutes', () => {
    expect(formatTime(65)).toBe('01:05')
    expect(formatTime(540)).toBe('09:00')
  })

  it('does not pad double-digit minutes', () => {
    expect(formatTime(600)).toBe('10:00')
    expect(formatTime(5999)).toBe('99:59')
  })

  it('handles fractional seconds (floor for minutes, modulo for seconds)', () => {
    // 10.7 → floor(10.7/60) = 0 minutes, 10.7 % 60 = 10.7 → padStart produces "10.7"
    // Actually: Math.floor(10.7/60) = 0, 10.7 % 60 = 10.7
    // toString().padStart(2, '0') on 10.7 gives "10.7"
    // This documents the behavior with fractional input
    const result = formatTime(10.7)
    // The function does not Math.floor the seconds — it passes the raw modulo result
    // 10.7 % 60 = 10.7, toString() = "10.7", padStart(2,'0') = "10.7" (already >=2 chars)
    expect(result).toBe('00:10.7')
  })

  it('handles very large values without overflow', () => {
    // 100 hours = 360000 seconds
    expect(formatTime(360000)).toBe('6000:00')
  })
})
