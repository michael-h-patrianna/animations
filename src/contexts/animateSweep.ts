import type { Animation, NumberPropConfig } from '@/types/animation'

/** Animated values keyed by animationId → propName → current value. */
export type PerAnimationValues = Record<string, Record<string, number>>

/** Configuration for a single sweep timer derived from an animatable NumberPropConfig. */
export interface SweepConfig {
  propName: string
  min: number
  max: number
  step: number
  pause: number
  duration: number
  style: 'steps' | 'linear'
}

function serializeSweepConfig(c: SweepConfig): string {
  return `${c.propName}|${c.min}|${c.max}|${c.step}|${c.pause}|${c.duration}|${c.style}`
}

/** Groups animations by identical sweep config so they can share a timer. */
export function collectSweepGroups(
  animations: Animation[] | undefined
): Map<string, { config: SweepConfig; animationIds: string[] }> {
  const groups = new Map<string, { config: SweepConfig; animationIds: string[] }>()
  if (!animations) return groups

  for (const anim of animations) {
    const animatableProps =
      anim.props?.filter((p): p is NumberPropConfig => p.type === 'number' && !!p.animatable) ?? []

    // An animation may declare multiple animatable number props; drive each
    // one through its own sweep config. Timers are deduplicated by config so
    // animations sharing identical sweeps still share a single timer.
    for (const prop of animatableProps) {
      const config: SweepConfig = {
        propName: prop.name,
        min: prop.min ?? 0,
        max: prop.max ?? 1,
        step: prop.step ?? 0.01,
        pause: prop.animatePause ?? 1200,
        duration: prop.animateDuration ?? 4000,
        style: prop.animateStyle ?? 'steps',
      }
      const key = serializeSweepConfig(config)
      const group = groups.get(key)
      if (group) {
        if (!group.animationIds.includes(anim.id)) group.animationIds.push(anim.id)
      } else {
        groups.set(key, { config, animationIds: [anim.id] })
      }
    }
  }

  return groups
}

/** Runs a stepped sweep with random discrete jumps. Returns cleanup function. */
export function runSteppedSweep(
  config: SweepConfig,
  animationIds: string[],
  emit: (update: PerAnimationValues) => void
): () => void {
  const { propName, min, max, step, pause } = config
  const range = max - min
  let timer: ReturnType<typeof setTimeout> | undefined
  let cancelled = false

  function broadcast(value: number) {
    const update: PerAnimationValues = {}
    for (const id of animationIds) update[id] = { [propName]: value }
    emit(update)
  }

  function generateSteps(): number[] {
    const steps: number[] = []
    let current = min
    while (current < max - step) {
      const increment = range * (0.08 + Math.random() * 0.25)
      current = Math.min(current + increment, max)
      const rounded = Math.round(current / step) * step
      steps.push(Math.min(rounded, max))
    }
    if (steps[steps.length - 1] !== max) steps.push(max)
    return steps
  }

  function advanceStep(steps: number[], index: number) {
    if (cancelled) return
    if (index < steps.length) {
      broadcast(steps[index]!)
      timer = setTimeout(() => advanceStep(steps, index + 1), 500 + Math.random() * 400)
      return
    }
    timer = setTimeout(() => {
      if (cancelled) return
      broadcast(min)
      timer = setTimeout(() => advanceStep(generateSteps(), 0), 600)
    }, pause)
  }

  broadcast(min)
  timer = setTimeout(() => advanceStep(generateSteps(), 0), 300)

  return () => {
    cancelled = true
    clearTimeout(timer)
  }
}

/** Runs a smooth linear sweep using requestAnimationFrame. Returns cleanup function. */
export function runLinearSweep(
  config: SweepConfig,
  animationIds: string[],
  emit: (update: PerAnimationValues) => void
): () => void {
  const { propName, min, max, step, pause, duration } = config
  const range = max - min
  let timer: ReturnType<typeof setTimeout> | undefined
  let raf: number | undefined
  let cancelled = false
  let startTime = 0
  let lastRounded = min

  function broadcast(value: number) {
    const update: PerAnimationValues = {}
    for (const id of animationIds) update[id] = { [propName]: value }
    emit(update)
  }

  function tick() {
    if (cancelled) return
    const elapsed = performance.now() - startTime
    const t = Math.min(1, elapsed / duration)
    const raw = min + range * t
    const rounded = Math.round(raw / step) * step
    const clamped = Math.min(rounded, max)

    if (clamped !== lastRounded) {
      lastRounded = clamped
      broadcast(clamped)
    }

    if (t < 1) {
      raf = requestAnimationFrame(tick)
    } else {
      timer = setTimeout(() => {
        if (cancelled) return
        lastRounded = min
        broadcast(min)
        timer = setTimeout(() => {
          if (cancelled) return
          startTime = performance.now()
          raf = requestAnimationFrame(tick)
        }, 600)
      }, pause)
    }
  }

  broadcast(min)
  timer = setTimeout(() => {
    startTime = performance.now()
    raf = requestAnimationFrame(tick)
  }, 300)

  return () => {
    cancelled = true
    clearTimeout(timer)
    if (raf != null) cancelAnimationFrame(raf)
  }
}
