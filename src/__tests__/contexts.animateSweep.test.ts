import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Animation } from '@/types/animation'
import type { PerAnimationValues } from '@/contexts/animateSweep'
import {
  collectSweepGroups,
  runSteppedSweep,
  runLinearSweep,
  type SweepConfig,
} from '@/contexts/animateSweep'

// ---------------------------------------------------------------------------
// collectSweepGroups
// ---------------------------------------------------------------------------

function makeAnimation(
  id: string,
  animatable?: {
    name?: string
    min?: number
    max?: number
    step?: number
    animateDuration?: number
    animatePause?: number
    animateStyle?: 'steps' | 'linear'
  }
): Animation {
  return {
    id,
    title: id,
    description: '',
    categoryId: 'test' as Animation['categoryId'],
    groupId: 'test-framer' as Animation['groupId'],
    urlSlugFramer: '',
    urlSlugCss: '',
    props: animatable
      ? [
          {
            type: 'number' as const,
            name: animatable.name ?? 'progress',
            label: 'Progress',
            animatable: true,
            min: animatable.min ?? 0,
            max: animatable.max ?? 100,
            step: animatable.step ?? 1,
            animateDuration: animatable.animateDuration,
            animatePause: animatable.animatePause,
            animateStyle: animatable.animateStyle,
          },
        ]
      : undefined,
  }
}

describe('collectSweepGroups', () => {
  it('returns empty map for undefined animations', () => {
    const result = collectSweepGroups(undefined)
    expect(result.size).toBe(0)
  })

  it('returns empty map for animations without animatable props', () => {
    const result = collectSweepGroups([makeAnimation('a1')])
    expect(result.size).toBe(0)
  })

  it('groups animations with identical sweep config', () => {
    const a1 = makeAnimation('a1', { min: 0, max: 100, step: 1 })
    const a2 = makeAnimation('a2', { min: 0, max: 100, step: 1 })
    const result = collectSweepGroups([a1, a2])

    expect(result.size).toBe(1)
    const group = [...result.values()][0]!
    expect(group.animationIds).toEqual(['a1', 'a2'])
    expect(group.config.propName).toBe('progress')
    expect(group.config.min).toBe(0)
    expect(group.config.max).toBe(100)
  })

  it('separates animations with different sweep configs', () => {
    const a1 = makeAnimation('a1', { min: 0, max: 100, step: 1 })
    const a2 = makeAnimation('a2', { min: 0, max: 50, step: 1 })
    const result = collectSweepGroups([a1, a2])

    expect(result.size).toBe(2)
  })

  it('applies default values for unset config fields', () => {
    const a1 = makeAnimation('a1', { name: 'val' })
    const result = collectSweepGroups([a1])
    const config = [...result.values()][0]!.config

    expect(config.propName).toBe('val')
    expect(config.min).toBe(0)
    expect(config.max).toBe(100)
    expect(config.step).toBe(1)
    expect(config.pause).toBe(1200)
    expect(config.duration).toBe(4000)
    expect(config.style).toBe('steps')
  })

  it('respects explicit animateStyle and animateDuration', () => {
    const a1 = makeAnimation('a1', {
      animateStyle: 'linear',
      animateDuration: 2000,
      animatePause: 500,
    })
    const result = collectSweepGroups([a1])
    const config = [...result.values()][0]!.config

    expect(config.style).toBe('linear')
    expect(config.duration).toBe(2000)
    expect(config.pause).toBe(500)
  })

  it('skips non-animatable number props', () => {
    const anim: Animation = {
      id: 'a1' as Animation['id'],
      title: 'a1',
      description: '',
      categoryId: 'test' as Animation['categoryId'],
      groupId: 'test-framer' as Animation['groupId'],
      urlSlugFramer: '',
      urlSlugCss: '',
      props: [
        {
          type: 'number',
          name: 'duration',
          label: 'Duration',
          // animatable is falsy
        },
      ],
    }
    const result = collectSweepGroups([anim])
    expect(result.size).toBe(0)
  })

  it('drives every animatable number prop per animation', () => {
    // An animation declaring two animatable number props must produce two
    // sweep configs so both props receive values during the animate loop.
    const anim: Animation = {
      id: 'a1' as Animation['id'],
      title: 'a1',
      description: '',
      categoryId: 'test' as Animation['categoryId'],
      groupId: 'test-framer' as Animation['groupId'],
      urlSlugFramer: '',
      urlSlugCss: '',
      props: [
        {
          type: 'number',
          name: 'primary',
          label: 'Primary',
          animatable: true,
          min: 0,
          max: 100,
          step: 1,
        },
        {
          type: 'number',
          name: 'secondary',
          label: 'Secondary',
          animatable: true,
          min: 0,
          max: 50,
          step: 1,
        },
      ],
    }
    const result = collectSweepGroups([anim])
    expect(result.size).toBe(2)
    const propsDriven = [...result.values()].map((g) => g.config.propName).sort()
    expect(propsDriven).toEqual(['primary', 'secondary'])
    for (const group of result.values()) {
      expect(group.animationIds).toEqual(['a1'])
    }
  })

  it('reuses a single sweep group across animations sharing the same config even when they declare multiple animatable props', () => {
    const make = (id: string): Animation => ({
      id: id as Animation['id'],
      title: id,
      description: '',
      categoryId: 'test' as Animation['categoryId'],
      groupId: 'test-framer' as Animation['groupId'],
      urlSlugFramer: '',
      urlSlugCss: '',
      props: [
        {
          type: 'number',
          name: 'shared',
          label: 'Shared',
          animatable: true,
          min: 0,
          max: 10,
          step: 1,
        },
      ],
    })

    const result = collectSweepGroups([make('a1'), make('a2')])
    expect(result.size).toBe(1)
    expect([...result.values()][0]!.animationIds).toEqual(['a1', 'a2'])
  })
})

// ---------------------------------------------------------------------------
// runSteppedSweep
// ---------------------------------------------------------------------------

describe('runSteppedSweep', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const defaultConfig: SweepConfig = {
    propName: 'progress',
    min: 0,
    max: 100,
    step: 1,
    pause: 1200,
    duration: 4000,
    style: 'steps',
  }

  it('broadcasts min value immediately', () => {
    const emit = vi.fn()
    const cleanup = runSteppedSweep(defaultConfig, ['a1', 'a2'], emit)

    expect(emit).toHaveBeenCalledTimes(1)
    const firstCall = emit.mock.calls[0]![0] as PerAnimationValues
    expect(firstCall['a1']!['progress']).toBe(0)
    expect(firstCall['a2']!['progress']).toBe(0)

    cleanup()
  })

  it('advances through steps after initial delay', () => {
    const emit = vi.fn()
    const cleanup = runSteppedSweep(defaultConfig, ['a1'], emit)

    // Initial broadcast at min
    expect(emit).toHaveBeenCalledTimes(1)

    // Advance past initial 300ms delay
    vi.advanceTimersByTime(300)

    // Should have at least one step broadcast beyond the initial min
    expect(emit.mock.calls.length).toBeGreaterThan(1)

    // Second broadcast must be above min (sweep advanced) and within range
    const secondVal = (emit.mock.calls[1]![0] as PerAnimationValues)['a1']!['progress']!
    expect(secondVal).toBeGreaterThan(defaultConfig.min)
    expect(secondVal).toBeLessThanOrEqual(defaultConfig.max)

    cleanup()
  })

  it('cleanup stops further broadcasts', () => {
    const emit = vi.fn()
    const cleanup = runSteppedSweep(defaultConfig, ['a1'], emit)

    const countBefore = emit.mock.calls.length
    cleanup()

    // Advance time significantly
    vi.advanceTimersByTime(20000)

    // No new broadcasts after cleanup
    expect(emit.mock.calls.length).toBe(countBefore)
  })

  it('broadcasts values rounded to step', () => {
    const config: SweepConfig = { ...defaultConfig, step: 10 }
    const emit = vi.fn()
    const cleanup = runSteppedSweep(config, ['a1'], emit)

    // Advance through several steps
    vi.advanceTimersByTime(5000)

    for (const call of emit.mock.calls) {
      const val = (call[0] as PerAnimationValues)['a1']!['progress']!
      expect(val % 10).toBe(0) // Must be a multiple of step
    }

    cleanup()
  })

  it('eventually resets to min and restarts', () => {
    const emit = vi.fn()
    const cleanup = runSteppedSweep(defaultConfig, ['a1'], emit)

    // Advance enough time for a full cycle + pause + reset
    vi.advanceTimersByTime(30000)

    const values = emit.mock.calls.map((c) => (c[0] as PerAnimationValues)['a1']!['progress']!)

    // Should have hit max at some point
    expect(values.some((v) => v === 100)).toBe(true)
    // Should have reset to min at some point after hitting max
    const maxIndex = values.indexOf(100)
    const resetValues = values.slice(maxIndex + 1)
    expect(resetValues.some((v) => v === 0)).toBe(true)

    cleanup()
  })
})

// ---------------------------------------------------------------------------
// runLinearSweep
// ---------------------------------------------------------------------------

describe('runLinearSweep', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    let now = 0
    vi.spyOn(performance, 'now').mockImplementation(() => now)
    // Mock requestAnimationFrame to advance time
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      now += 16 // ~60fps
      return setTimeout(() => cb(now), 0)
    })
    vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  const defaultConfig: SweepConfig = {
    propName: 'progress',
    min: 0,
    max: 100,
    step: 1,
    pause: 1200,
    duration: 4000,
    style: 'linear',
  }

  it('broadcasts min value immediately', () => {
    const emit = vi.fn()
    const cleanup = runLinearSweep(defaultConfig, ['a1'], emit)

    expect(emit).toHaveBeenCalledTimes(1)
    const firstCall = emit.mock.calls[0]![0] as PerAnimationValues
    expect(firstCall['a1']!['progress']).toBe(0)

    cleanup()
  })

  it('cleanup cancels all timers and rAFs', () => {
    const emit = vi.fn()
    const cleanup = runLinearSweep(defaultConfig, ['a1'], emit)

    const countBefore = emit.mock.calls.length
    cleanup()

    vi.advanceTimersByTime(20000)
    expect(emit.mock.calls.length).toBe(countBefore)
  })

  it('broadcasts to all animation IDs', () => {
    const emit = vi.fn()
    const cleanup = runLinearSweep(defaultConfig, ['a1', 'a2', 'a3'], emit)

    const firstCall = emit.mock.calls[0]![0] as PerAnimationValues
    expect(Object.keys(firstCall)).toEqual(['a1', 'a2', 'a3'])

    cleanup()
  })

  it('sweeps from min toward max over time', () => {
    const emit = vi.fn()
    const cleanup = runLinearSweep(defaultConfig, ['a1'], emit)

    // Advance past initial 300ms delay + some rAF ticks
    vi.advanceTimersByTime(1000)

    // First broadcast is min; subsequent should increase
    const firstVal = (emit.mock.calls[0]![0] as PerAnimationValues)['a1']!['progress']!
    expect(firstVal).toBe(0)

    // At least one broadcast with a value above min
    const allValues = emit.mock.calls.map((c) => (c[0] as PerAnimationValues)['a1']!['progress']!)
    expect(allValues.some((v) => v > 0)).toBe(true)
    // No value exceeds max
    expect(allValues.every((v) => v <= 100)).toBe(true)

    cleanup()
  })

  it('values are rounded to step', () => {
    const config: SweepConfig = { ...defaultConfig, step: 5 }
    const emit = vi.fn()
    const cleanup = runLinearSweep(config, ['a1'], emit)

    vi.advanceTimersByTime(5000)

    for (const call of emit.mock.calls) {
      const val = (call[0] as PerAnimationValues)['a1']!['progress']!
      expect(val % 5).toBe(0)
    }

    cleanup()
  })
})
