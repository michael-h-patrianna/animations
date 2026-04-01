/**
 * Demo cycling wrappers for data-driven animations.
 *
 * These wrappers drive component props over time to demonstrate reactive
 * animations in the catalog. They replace the cycling loops that were
 * previously embedded inside the animation components themselves.
 *
 * Each wrapper manages its own timer state and passes changing props
 * (items, visible) to the wrapped animation component.
 */

/* eslint-disable @eslint-react/web-api/no-leaked-timeout -- All timeouts are tracked in a Set and cleared in the effect cleanup function via timeouts.forEach(clearTimeout). The linter cannot trace through the schedule() helper. */
/* eslint-disable @eslint-react/set-state-in-effect -- setState calls in cycling effects are intentional: they drive the demo animation loop at controlled intervals, not on every render. */

import { memo, useEffect, useRef, useState } from 'react'

import type { RankedEntry } from '@/components/realtime/realtime-data/SharedTypes'

// ── Default data (matches component defaults) ────────────────────────────

const LEADERBOARD_ITEMS: RankedEntry[] = [
  { id: 'phoenix', label: 'Phoenix', score: 2450 },
  { id: 'shadow', label: 'Shadow', score: 2380 },
  { id: 'nova', label: 'Nova', score: 2320 },
  { id: 'apex', label: 'Apex', score: 2290 },
]

const SCORE_ITEMS: RankedEntry[] = [
  { id: 'phoenix', label: 'Phoenix', score: 1450 },
  { id: 'shadow', label: 'Shadow', score: 1320 },
]

const SCORE_INCREMENT = 120
const PAUSE_MS = 2000

// ── ListRotateDemo ───────────────────────────────────────────────────────

/**
 * Cycles a ranked list by moving the top entry to the bottom in a single
 * atomic update. The demoted item receives a versioned key so AnimatePresence
 * treats it as a simultaneous exit (old key) + enter (new key). This keeps
 * the item count constant at all times, preventing container height jumps.
 *
 * Resets via key-remount after one full rotation.
 */
function ListRotateDemoComponent({
  Component,
  controlProps,
}: {
  Component: React.ComponentType<Record<string, unknown>>
  controlProps: Record<string, unknown>
}) {
  const baseItems = (controlProps.items as RankedEntry[] | undefined) ?? LEADERBOARD_ITEMS
  const [items, setItems] = useState<RankedEntry[]>(() => [...baseItems])
  const [resetKey, setResetKey] = useState(0)
  const itemsRef = useRef(items)
  const versionRef = useRef(0)
  const cycleCountRef = useRef(0)

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  useEffect(() => {
    const timeouts = new Set<ReturnType<typeof setTimeout>>()
    let mounted = true

    const schedule = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        timeouts.delete(id)
        fn()
      }, ms)
      timeouts.add(id)
    }

    const cycle = () => {
      if (!mounted) return
      const current = itemsRef.current
      if (current.length < 2) return

      const demoted = current[0]!
      versionRef.current += 1

      // Single atomic reorder: top item moves to bottom with a new key.
      // AnimatePresence sees old key exit + new key enter simultaneously,
      // so the item count in flow stays constant (no height jump).
      const baseId = demoted.id.replace(/-v\d+$/, '')
      setItems([
        ...current.slice(1),
        { ...demoted, id: `${baseId}-v${versionRef.current}`, score: demoted.score - 50 },
      ])

      schedule(() => {
        if (!mounted) return
        cycleCountRef.current += 1

        if (cycleCountRef.current >= baseItems.length) {
          // Full rotation — remount for clean reset
          cycleCountRef.current = 0
          versionRef.current = 0
          setItems([...baseItems])
          setResetKey((k) => k + 1)
          schedule(cycle, 500)
        } else {
          schedule(cycle, PAUSE_MS)
        }
      }, PAUSE_MS)
    }

    schedule(cycle, PAUSE_MS)

    return () => {
      mounted = false
      timeouts.forEach(clearTimeout)
      timeouts.clear()
    }
  }, [baseItems, resetKey])

  return <Component key={resetKey} {...controlProps} items={items} />
}

export const ListRotateDemo = memo(ListRotateDemoComponent)

// ── ScorePulseDemo ───────────────────────────────────────────────────────

/**
 * Periodically increments scores in the items array to trigger count-up
 * animations. Resets via key-remount after several cycles.
 */
function ScorePulseDemoComponent({
  Component,
  controlProps,
}: {
  Component: React.ComponentType<Record<string, unknown>>
  controlProps: Record<string, unknown>
}) {
  const baseItems = (controlProps.items as RankedEntry[] | undefined) ?? SCORE_ITEMS
  const duration = (controlProps.duration as number | undefined) ?? 800
  const [items, setItems] = useState<RankedEntry[]>(() => [...baseItems])
  const [resetKey, setResetKey] = useState(0)
  const cycleCountRef = useRef(0)

  useEffect(() => {
    const timeouts = new Set<ReturnType<typeof setTimeout>>()
    let mounted = true

    const schedule = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        timeouts.delete(id)
        fn()
      }, ms)
      timeouts.add(id)
    }

    const cycle = () => {
      if (!mounted) return

      // Increment all scores
      setItems((prev) => prev.map((item) => ({ ...item, score: item.score + SCORE_INCREMENT })))

      schedule(() => {
        if (!mounted) return
        cycleCountRef.current += 1

        if (cycleCountRef.current >= 4) {
          // Reset after 4 cycles to prevent scores growing too large
          cycleCountRef.current = 0
          setItems([...baseItems])
          setResetKey((k) => k + 1)
          schedule(cycle, PAUSE_MS)
        } else {
          schedule(cycle, PAUSE_MS)
        }
      }, duration)
    }

    schedule(cycle, PAUSE_MS)

    return () => {
      mounted = false
      timeouts.forEach(clearTimeout)
      timeouts.clear()
    }
  }, [baseItems, duration, resetKey])

  return <Component key={resetKey} {...controlProps} items={items} />
}

export const ScorePulseDemo = memo(ScorePulseDemoComponent)

// ── VisibilityCycleDemo ──────────────────────────────────────────────────

/**
 * Toggles a `visible` prop on and off to demonstrate entrance/exit animations.
 */
function VisibilityCycleDemoComponent({
  Component,
  controlProps,
}: {
  Component: React.ComponentType<Record<string, unknown>>
  controlProps: Record<string, unknown>
}) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timeouts = new Set<ReturnType<typeof setTimeout>>()
    let mounted = true

    const schedule = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        timeouts.delete(id)
        fn()
      }, ms)
      timeouts.add(id)
    }

    const cycle = () => {
      if (!mounted) return
      setVisible(true)

      schedule(() => {
        if (!mounted) return
        setVisible(false)
        schedule(cycle, PAUSE_MS)
      }, 1500)
    }

    cycle()

    return () => {
      mounted = false
      timeouts.forEach(clearTimeout)
      timeouts.clear()
    }
  }, [])

  return <Component {...controlProps} visible={visible} />
}

export const VisibilityCycleDemo = memo(VisibilityCycleDemoComponent)

// ── CombatTextDemo ──────────────────────────────────────────────────────

interface CombatTextInstance {
  id: number
  value: string
  type: string
  x: number
  y: number
  createdAt: number
}

// eslint-disable-next-line animation-rules/no-hardcoded-colors -- 'gold' is a game mechanic identifier, not a CSS color value
const COMBAT_TYPES = ['damage', 'heal', 'gold', 'critical'] as const
const COMBAT_SPAWN_MS = 800
const COMBAT_LIFETIME_MS = 1200
const COMBAT_MAX_INSTANCES = 8

function randomCombatValue(type: string): string {
  switch (type) {
    case 'heal':
      return `+${Math.floor(Math.random() * 45) + 5}`
    case 'gold': // eslint-disable-line animation-rules/no-hardcoded-colors -- game mechanic identifier
      return `+${Math.floor(Math.random() * 490) + 10}`
    case 'critical':
      return `-${Math.floor(Math.random() * 850) + 150}`
    default:
      return `-${Math.floor(Math.random() * 88) + 12}`
  }
}

/**
 * Spawns multiple floating combat text instances at random positions
 * within the card, cycling through damage/heal/gold/critical types.
 */
function CombatTextDemoComponent({
  Component,
  controlProps,
}: {
  Component: React.ComponentType<Record<string, unknown>>
  controlProps: Record<string, unknown>
}) {
  const [instances, setInstances] = useState<CombatTextInstance[]>([])
  const nextIdRef = useRef(0)
  const typeIndexRef = useRef(0)

  useEffect(() => {
    const timeouts = new Set<ReturnType<typeof setTimeout>>()
    let mounted = true

    const schedule = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        timeouts.delete(id)
        fn()
      }, ms)
      timeouts.add(id)
    }

    const spawn = () => {
      if (!mounted) return

      const now = Date.now()
      const type = COMBAT_TYPES[typeIndexRef.current % COMBAT_TYPES.length]!
      typeIndexRef.current += 1

      setInstances((prev) => {
        const alive = prev
          .filter((inst) => now - inst.createdAt < COMBAT_LIFETIME_MS)
          .slice(-COMBAT_MAX_INSTANCES + 1)

        return [
          ...alive,
          {
            id: nextIdRef.current++,
            value: randomCombatValue(type),
            type,
            x: Math.random() * 60 + 20,
            y: Math.random() * 30 + 35,
            createdAt: now,
          },
        ]
      })

      schedule(spawn, COMBAT_SPAWN_MS)
    }

    schedule(spawn, 400)

    return () => {
      mounted = false
      timeouts.forEach(clearTimeout)
      timeouts.clear()
    }
  }, [])

  return (
    <div
      style={{ position: 'relative', width: '100%', minHeight: 120 }}
      data-testid="demo-combat-text"
    >
      {instances.map((inst) => (
        <div
          key={inst.id}
          style={{
            position: 'absolute',
            left: `${inst.x}%`,
            top: `${inst.y}%`,
          }}
        >
          <Component {...controlProps} value={inst.value} type={inst.type} />
        </div>
      ))}
    </div>
  )
}

export const CombatTextDemo = memo(CombatTextDemoComponent)
