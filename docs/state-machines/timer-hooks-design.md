# Timer Effect Hooks Design

**Status:** Design Complete - Ready for Implementation
**Date:** October 13, 2025
**Related:** Style Guide Audit S2 Violation
**Priority:** MODERATE

---

## Problem Statement

`TimerEffectsPillCountdownStrong.tsx` contains a **47-line useEffect hook** mixing three concerns:

1. **Countdown Timer:** setInterval logic, pause/resume, completion
2. **Color Transitions:** Background color changes at time thresholds
3. **Snap Animations:** Scale/opacity effects on time changes

**Issues:**
- Single useEffect doing too much (violates Single Responsibility)
- Difficult to test individual concerns
- Hard to reuse timer logic in other components
- Cleanup logic is complex and error-prone

---

## Proposed Solution

Split the complex useEffect into **3 custom hooks**, each with a single responsibility:

1. **useCountdownTimer:** Core timer logic (setInterval, pause, complete)
2. **useColorTransition:** Color changes based on time thresholds
3. **useSnapAnimation:** Scale/opacity effects on time changes

---

## Hook 1: useCountdownTimer

### Purpose
Manages countdown timer state, interval, and pause/resume logic.

### Interface

```typescript
/**
 * Countdown timer hook with pause/resume support.
 *
 * @param {Object} config - Timer configuration
 * @param {number} config.initialTime - Starting time in seconds
 * @param {number} config.interval - Update interval in milliseconds (default: 100)
 * @param {boolean} config.paused - Whether timer is paused
 * @param {() => void} [config.onComplete] - Callback when timer reaches zero
 * @param {(time: number) => void} [config.onTick] - Callback on each tick
 *
 * @returns {Object} Timer state and controls
 * @returns {number} timeRemaining - Current time remaining in seconds
 * @returns {boolean} isComplete - Whether timer has completed
 * @returns {() => void} reset - Reset timer to initial time
 * @returns {() => void} pause - Pause the timer
 * @returns {() => void} resume - Resume the timer
 * @returns {(time: number) => void} setTime - Manually set time
 *
 * @example
 * ```tsx
 * const { timeRemaining, isComplete, reset } = useCountdownTimer({
 *   initialTime: 10,
 *   interval: 100,
 *   paused: false,
 *   onComplete: () => console.log('Timer complete!'),
 * })
 * ```
 */
export function useCountdownTimer(config: CountdownTimerConfig) {
  const [timeRemaining, setTimeRemaining] = useState(config.initialTime)
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (config.paused || isComplete) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const next = Math.max(0, prev - config.interval / 1000)

        if (config.onTick) {
          config.onTick(next)
        }

        if (next === 0) {
          setIsComplete(true)
          if (config.onComplete) {
            config.onComplete()
          }
        }

        return next
      })
    }, config.interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [config.paused, config.interval, isComplete])

  const reset = useCallback(() => {
    setTimeRemaining(config.initialTime)
    setIsComplete(false)
  }, [config.initialTime])

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const resume = useCallback(() => {
    // Will be handled by useEffect
  }, [])

  const setTime = useCallback((time: number) => {
    setTimeRemaining(time)
    setIsComplete(time === 0)
  }, [])

  return {
    timeRemaining,
    isComplete,
    reset,
    pause,
    resume,
    setTime,
  }
}
```

### Tests

```typescript
describe('useCountdownTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('counts down from initial time', () => {
    const { result } = renderHook(() =>
      useCountdownTimer({ initialTime: 10, interval: 1000, paused: false })
    )

    expect(result.current.timeRemaining).toBe(10)

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.timeRemaining).toBe(9)

    act(() => {
      vi.advanceTimersByTime(9000)
    })

    expect(result.current.timeRemaining).toBe(0)
    expect(result.current.isComplete).toBe(true)
  })

  it('calls onComplete when timer reaches zero', () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() =>
      useCountdownTimer({ initialTime: 1, interval: 1000, paused: false, onComplete })
    )

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('pauses timer when paused prop is true', () => {
    const { result, rerender } = renderHook(
      ({ paused }) => useCountdownTimer({ initialTime: 10, interval: 1000, paused }),
      { initialProps: { paused: false } }
    )

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(result.current.timeRemaining).toBe(8)

    rerender({ paused: true })

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.timeRemaining).toBe(8) // Still paused
  })

  it('resets timer to initial time', () => {
    const { result } = renderHook(() =>
      useCountdownTimer({ initialTime: 10, interval: 1000, paused: false })
    )

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.timeRemaining).toBe(5)

    act(() => {
      result.current.reset()
    })

    expect(result.current.timeRemaining).toBe(10)
    expect(result.current.isComplete).toBe(false)
  })
})
```

---

## Hook 2: useColorTransition

### Purpose
Manages color transitions based on time thresholds (e.g., green → yellow → red).

### Interface

```typescript
/**
 * Color transition hook based on time thresholds.
 *
 * @param {Object} config - Color transition configuration
 * @param {number} config.currentTime - Current time value
 * @param {Array<{threshold: number, color: string}>} config.thresholds - Color thresholds
 * @param {string} config.defaultColor - Default color
 *
 * @returns {Object} Current color state
 * @returns {string} color - Current color
 * @returns {boolean} hasTransitioned - Whether a transition just occurred
 *
 * @example
 * ```tsx
 * const { color } = useColorTransition({
 *   currentTime: 5,
 *   thresholds: [
 *     { threshold: 3, color: '#ef4444' },  // Red < 3s
 *     { threshold: 7, color: '#f59e0b' },  // Orange < 7s
 *   ],
 *   defaultColor: '#10b981',  // Green >= 7s
 * })
 * ```
 */
export function useColorTransition(config: ColorTransitionConfig) {
  const [color, setColor] = useState(config.defaultColor)
  const [hasTransitioned, setHasTransitioned] = useState(false)
  const prevTimeRef = useRef(config.currentTime)

  useEffect(() => {
    // Find the appropriate color for current time
    const sortedThresholds = [...config.thresholds].sort((a, b) => a.threshold - b.threshold)

    let newColor = config.defaultColor
    for (const { threshold, color: thresholdColor } of sortedThresholds) {
      if (config.currentTime < threshold) {
        newColor = thresholdColor
        break
      }
    }

    if (newColor !== color) {
      setColor(newColor)
      setHasTransitioned(true)

      // Reset transition flag after animation
      const timeout = setTimeout(() => setHasTransitioned(false), 300)
      return () => clearTimeout(timeout)
    }

    prevTimeRef.current = config.currentTime
  }, [config.currentTime, config.thresholds, config.defaultColor])

  return {
    color,
    hasTransitioned,
  }
}
```

### Tests

```typescript
describe('useColorTransition', () => {
  it('returns default color when above all thresholds', () => {
    const { result } = renderHook(() =>
      useColorTransition({
        currentTime: 10,
        thresholds: [
          { threshold: 3, color: '#ef4444' },
          { threshold: 7, color: '#f59e0b' },
        ],
        defaultColor: '#10b981',
      })
    )

    expect(result.current.color).toBe('#10b981')
  })

  it('transitions to orange at 7s threshold', () => {
    const { result, rerender } = renderHook(
      ({ time }) =>
        useColorTransition({
          currentTime: time,
          thresholds: [
            { threshold: 3, color: '#ef4444' },
            { threshold: 7, color: '#f59e0b' },
          ],
          defaultColor: '#10b981',
        }),
      { initialProps: { time: 10 } }
    )

    expect(result.current.color).toBe('#10b981')

    rerender({ time: 6 })

    expect(result.current.color).toBe('#f59e0b')
    expect(result.current.hasTransitioned).toBe(true)
  })

  it('transitions to red at 3s threshold', () => {
    const { result, rerender } = renderHook(
      ({ time }) =>
        useColorTransition({
          currentTime: time,
          thresholds: [
            { threshold: 3, color: '#ef4444' },
            { threshold: 7, color: '#f59e0b' },
          ],
          defaultColor: '#10b981',
        }),
      { initialProps: { time: 6 } }
    )

    expect(result.current.color).toBe('#f59e0b')

    rerender({ time: 2 })

    expect(result.current.color).toBe('#ef4444')
  })

  it('resets hasTransitioned after delay', async () => {
    vi.useFakeTimers()

    const { result, rerender } = renderHook(
      ({ time }) =>
        useColorTransition({
          currentTime: time,
          thresholds: [{ threshold: 5, color: '#ef4444' }],
          defaultColor: '#10b981',
        }),
      { initialProps: { time: 10 } }
    )

    rerender({ time: 4 })

    expect(result.current.hasTransitioned).toBe(true)

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current.hasTransitioned).toBe(false)

    vi.restoreAllMocks()
  })
})
```

---

## Hook 3: useSnapAnimation

### Purpose
Triggers scale/opacity animations on value changes.

### Interface

```typescript
/**
 * Snap animation hook for scale/opacity effects on value changes.
 *
 * @param {Object} config - Animation configuration
 * @param {number} config.value - Value to watch for changes
 * @param {number} config.duration - Animation duration in ms (default: 200)
 *
 * @returns {Object} Animation state
 * @returns {boolean} isAnimating - Whether animation is active
 * @returns {MotionValue<number>} scale - Animated scale value
 * @returns {MotionValue<number>} opacity - Animated opacity value
 *
 * @example
 * ```tsx
 * const { isAnimating, scale, opacity } = useSnapAnimation({
 *   value: timeRemaining,
 *   duration: 200,
 * })
 *
 * <motion.div style={{ scale, opacity }}>
 *   {timeRemaining}
 * </motion.div>
 * ```
 */
export function useSnapAnimation(config: SnapAnimationConfig) {
  const [isAnimating, setIsAnimating] = useState(false)
  const scale = useMotionValue(1)
  const opacity = useMotionValue(1)
  const prevValueRef = useRef(config.value)

  useEffect(() => {
    if (config.value !== prevValueRef.current) {
      setIsAnimating(true)

      // Snap animation: scale up + fade, then back
      const animation = animate(
        [
          [scale, [1, 1.1, 1], { duration: config.duration / 1000 }],
          [opacity, [1, 0.7, 1], { duration: config.duration / 1000 }],
        ],
        { duration: config.duration / 1000 }
      )

      animation.then(() => setIsAnimating(false))

      prevValueRef.current = config.value

      return () => animation.stop()
    }
  }, [config.value, config.duration])

  return {
    isAnimating,
    scale,
    opacity,
  }
}
```

### Tests

```typescript
describe('useSnapAnimation', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('triggers animation on value change', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useSnapAnimation({ value, duration: 200 }),
      { initialProps: { value: 10 } }
    )

    expect(result.current.isAnimating).toBe(false)

    rerender({ value: 9 })

    expect(result.current.isAnimating).toBe(true)
  })

  it('resets isAnimating after duration', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useSnapAnimation({ value, duration: 200 }),
      { initialProps: { value: 10 } }
    )

    rerender({ value: 9 })

    expect(result.current.isAnimating).toBe(true)

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current.isAnimating).toBe(false)
  })

  it('does not animate when value stays the same', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useSnapAnimation({ value, duration: 200 }),
      { initialProps: { value: 10 } }
    )

    expect(result.current.isAnimating).toBe(false)

    rerender({ value: 10 })

    expect(result.current.isAnimating).toBe(false)
  })
})
```

---

## Composing the Hooks

### Updated TimerEffectsPillCountdownStrong.tsx

**Before (47-line useEffect):**
```tsx
useEffect(() => {
  // ... 47 lines of complex logic ...
}, [/* complex dependencies */])
```

**After (3 composed hooks):**
```tsx
// Timer logic
const { timeRemaining, isComplete, reset } = useCountdownTimer({
  initialTime: 10,
  interval: 100,
  paused: false,
  onComplete: () => console.log('Complete!'),
})

// Color transitions
const { color } = useColorTransition({
  currentTime: timeRemaining,
  thresholds: [
    { threshold: 3, color: '#ef4444' },  // Red
    { threshold: 7, color: '#f59e0b' },  // Orange
  ],
  defaultColor: '#10b981',  // Green
})

// Snap animations
const { scale, opacity } = useSnapAnimation({
  value: timeRemaining,
  duration: 200,
})

return (
  <motion.div
    style={{ backgroundColor: color, scale, opacity }}
    className="timer-pill"
  >
    {Math.ceil(timeRemaining)}s
  </motion.div>
)
```

---

## Benefits

### Before (1 complex useEffect)
❌ 47 lines mixing 3 concerns
❌ Difficult to test individual logic
❌ Cannot reuse timer/color/animation separately
❌ Complex cleanup logic
❌ Hard to modify one concern without affecting others

### After (3 focused hooks)
✅ Each hook has single responsibility
✅ Easy to test with fake timers
✅ Reusable across timer components
✅ Simple cleanup per hook
✅ Modify concerns independently

---

## Migration Checklist

- [ ] Create `src/hooks/useCountdownTimer.ts` with tests
- [ ] Create `src/hooks/useColorTransition.ts` with tests
- [ ] Create `src/hooks/useSnapAnimation.ts` with tests
- [ ] Update `TimerEffectsPillCountdownStrong.tsx` to use hooks
- [ ] Remove complex useEffect from timer component
- [ ] Run tests with `vi.useFakeTimers()` for deterministic results
- [ ] Document hooks with JSDoc and examples
- [ ] Consider extracting to shared timer package

---

## Future Enhancements

1. **useTimerPresets:** Pre-configured timer/color combos
2. **useTimerHistory:** Track time history for analytics
3. **useTimerSync:** Synchronize multiple timers
4. **useTimerPersistence:** Save/restore timer state

---

*This design provides clear separation of concerns and comprehensive test coverage for timer components.*
