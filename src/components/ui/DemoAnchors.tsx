import { assertNever } from '@/utils/assertNever'
import { memo, useMemo, type CSSProperties, type Ref, type RefObject } from 'react'
import './DemoAnchors.css'

type AnchorMode = 'burst' | 'magnet' | 'trail' | 'fountain'

interface DemoAnchorsProps {
  fromRef: RefObject<HTMLDivElement | null>
  toRef: RefObject<HTMLDivElement | null>
  /** Layout mode determines anchor positioning constraints. */
  mode: AnchorMode
}

/** Minimum distance between from and to anchors (percentage of container). */
const MIN_DISTANCE_PCT = 30

/** Random number between min and max (inclusive). */
function rand(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

/** Euclidean distance in percentage space. */
function distPct(ax: number, ay: number, bx: number, by: number): number {
  const dx = ax - bx
  const dy = ay - by
  return Math.sqrt(dx * dx + dy * dy)
}

interface AnchorPositions {
  from: { left: string; top: string }
  to: { left: string; top: string }
}

/**
 * Generates random positions for from/to anchors per mode.
 * Called once per mount (replay = remount = new random positions).
 */
function generatePositions(mode: AnchorMode): AnchorPositions {
  switch (mode) {
    case 'burst': {
      // Single point — random within center region
      const x = rand(25, 75)
      const y = rand(30, 70)
      return {
        from: { left: `${x}%`, top: `${y}%` },
        to: { left: `${x}%`, top: `${y}%` },
      }
    }
    case 'fountain': {
      // Source at random horizontal position, always in bottom third
      const x = rand(20, 80)
      const y = rand(65, 85)
      return {
        from: { left: `${x}%`, top: `${y}%` },
        to: { left: `${x}%`, top: `${y}%` },
      }
    }
    case 'magnet':
    case 'trail': {
      // Two points with minimum distance
      let fromX = rand(10, 45)
      let fromY = rand(25, 75)
      let toX = rand(55, 90)
      let toY = rand(15, 65)

      // Ensure minimum distance — if too close, push target further away
      let attempts = 0
      while (distPct(fromX, fromY, toX, toY) < MIN_DISTANCE_PCT && attempts < 10) {
        toX = rand(55, 90)
        toY = rand(15, 65)
        attempts++
      }

      // Randomly swap from/to sides for variety
      if (Math.random() > 0.5) {
        ;[fromX, toX] = [toX, fromX]
        ;[fromY, toY] = [toY, fromY]
      }

      return {
        from: { left: `${fromX}%`, top: `${fromY}%` },
        to: { left: `${toX}%`, top: `${toY}%` },
      }
    }
    default:
      return assertNever(mode)
  }
}

/**
 * Demo anchor elements that visualize from/to points in the catalog.
 * Positions randomize on each mount (replay = remount via key toggle).
 * Consumers using the animation API provide their own from/to refs.
 */
function DemoAnchorsComponent({ fromRef, toRef, mode }: DemoAnchorsProps) {
  const showTo = mode !== 'burst' && mode !== 'fountain'
  const positions = useMemo(() => generatePositions(mode), [mode])

  return (
    <div className="pf-demo-anchors" data-mode={mode} data-testid="demo-anchors">
      <DemoAnchorPill ref={fromRef} label="Source" variant="from" style={positions.from} />
      {showTo && <DemoAnchorPill ref={toRef} label="Target" variant="to" style={positions.to} />}
    </div>
  )
}

interface DemoAnchorPillProps {
  ref?: Ref<HTMLDivElement>
  label: string
  variant: 'from' | 'to'
  style: CSSProperties
}

const DemoAnchorPill = memo(function DemoAnchorPill({
  ref,
  label,
  variant,
  style,
}: DemoAnchorPillProps) {
  return (
    <div
      ref={ref}
      className={`pf-demo-anchor pf-demo-anchor--${variant}`}
      style={style}
      aria-hidden="true"
      data-testid={`demo-anchor-${variant}`}
    >
      <span className="pf-demo-anchor__dot" />
      <span className="pf-demo-anchor__label" data-testid={`demo-anchor-${variant}-label`}>
        {label}
      </span>
    </div>
  )
})

export const DemoAnchors = memo(DemoAnchorsComponent)
