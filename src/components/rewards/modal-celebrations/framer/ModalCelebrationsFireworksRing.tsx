/**
 * Chrysanthemum Ring — embers converge to form a ring, ignite, then explode outward.
 *
 * Copy-paste files: this file + ../SharedFireworksRingModel.ts + ../SharedCelebrationTypes.ts + ../utils.ts + ../shared.css
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { memo, useEffect, useMemo } from 'react'

import type { CelebrationBaseProps } from '@/components/rewards/modal-celebrations/SharedCelebrationTypes'
import {
  BURST_TIMES,
  DURATION,
  TIMES,
  makeBursts,
  makeEmbers,
  makeShimmers,
  makeSparkles,
  type Burst,
  type Ember,
  type Shimmer,
  type Sparkle,
} from '@/components/rewards/modal-celebrations/SharedFireworksRingModel'

/* ─── Props ─── */

interface ModalCelebrationsFireworksRingProps extends CelebrationBaseProps {
  /** Total ember particles converging to the ring. Default 22. */
  particleCount?: number
}

/* ─── Sub-components ─── */

/**
 * Glowing ember dot or its ghost tail.
 * Primary embers have a filter drop-shadow glow; tails are smaller and dimmer.
 */
function EmberDot({ e, isTail }: { e: Ember; isTail?: boolean }) {
  const size = isTail ? e.tailSize : e.size
  const delay = isTail ? e.delay + 0.05 : e.delay
  const opacities = isTail ? e.tailOpacities : e.opacities

  return (
    <m.span
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: e.color,
        filter: isTail ? undefined : `drop-shadow(0 0 ${Math.round(size * 1.5) + 2}px ${e.color})`,
        pointerEvents: 'none',
        willChange: 'transform, opacity',
      }}
      initial={{ x: e.xs[0], y: e.ys[0], scale: 0, opacity: 0 }}
      animate={{ x: e.xs, y: e.ys, scale: e.scales, opacity: opacities }}
      transition={{
        duration: DURATION,
        delay,
        times: TIMES,
        x: { duration: DURATION, delay, times: TIMES, ease: 'linear' },
        y: { duration: DURATION, delay, times: TIMES, ease: 'linear' },
        scale: { duration: DURATION, delay, times: TIMES, ease: 'linear' },
        opacity: { duration: DURATION, delay, times: TIMES, ease: 'linear' },
      }}
    />
  )
}

/** Renders both tails and primary dots for a set of embers. */
function EmberLayer({ embers }: { embers: Ember[] }) {
  return (
    <>
      {embers.map((e) => (
        <EmberDot key={`t-${e.id}`} e={e} isTail />
      ))}
      {embers.map((e) => (
        <EmberDot key={`e-${e.id}`} e={e} />
      ))}
    </>
  )
}

/** Shimmer dot on ring — appears during hold phase, fades at explosion. */
function ShimmerDot({ s }: { s: Shimmer }) {
  return (
    <m.span
      style={{
        position: 'absolute',
        left: '50%',
        marginLeft: s.x,
        top: '50%',
        marginTop: s.y,
        width: `${s.size}px`,
        height: `${s.size}px`,
        borderRadius: '50%',
        background: s.color,
        filter: `drop-shadow(0 0 5px ${s.color})`,
        pointerEvents: 'none',
        willChange: 'transform, opacity',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [0, 0, 0.5, 1.2, 1.5, 0.3, 0, 0],
        opacity: [0, 0, 0.5, 0.8, 1.0, 0.15, 0, 0],
      }}
      transition={{
        duration: DURATION,
        delay: s.delay,
        times: TIMES,
        scale: { duration: DURATION, delay: s.delay, times: TIMES, ease: 'linear' },
        opacity: { duration: DURATION, delay: s.delay, times: TIMES, ease: 'linear' },
      }}
    />
  )
}

/** Burst confetti piece — erupts from ring at ignition moment. */
function BurstPiece({ b, maxW, maxH }: { b: Burst; maxW: number; maxH: number }) {
  return (
    <m.span
      className={
        b.imageUrl !== undefined
          ? undefined
          : `pf-celebration__confetti pf-celebration__confetti--${b.shape}`
      }
      style={{
        left: '50%',
        marginLeft: b.startX,
        top: '50%',
        marginTop: b.startY,
        ...(b.imageUrl !== undefined ? { width: maxW, height: maxH } : { background: b.color }),
        animation: 'none',
      }}
      initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 0 }}
      animate={{
        x: b.xs,
        y: b.ys,
        scale: b.scales,
        opacity: b.opacities,
        rotate: [0, b.rotZ],
      }}
      transition={{
        duration: b.dur,
        delay: b.delay,
        times: BURST_TIMES,
        x: { duration: b.dur, delay: b.delay, times: BURST_TIMES, ease: 'linear' },
        y: { duration: b.dur, delay: b.delay, times: BURST_TIMES, ease: 'linear' },
        scale: { duration: b.dur, delay: b.delay, times: BURST_TIMES, ease: 'linear' },
        opacity: { duration: b.dur, delay: b.delay, times: BURST_TIMES, ease: 'linear' },
        rotate: { duration: b.dur, delay: b.delay, ease: 'linear' },
      }}
    >
      {b.imageUrl !== undefined && (
        <img
          src={b.imageUrl}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
      )}
    </m.span>
  )
}

function SparkleDot({ s }: { s: Sparkle }) {
  return (
    <m.span
      className="pf-celebration__sparkle"
      style={{
        left: '50%',
        marginLeft: s.x,
        top: '50%',
        marginTop: s.y,
        width: `${s.size}px`,
        height: `${s.size}px`,
        animation: 'none',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.3, 0.4, 1.0, 0], opacity: [0, 0.9, 0.25, 0.6, 0] }}
      transition={{ duration: 0.9, delay: s.delay, times: [0, 0.2, 0.5, 0.75, 1], ease: 'easeOut' }}
    />
  )
}

function CenterFlash() {
  return (
    <m.div
      className="pf-celebration__flash"
      style={{ left: '50%', top: '50%', animation: 'none' }}
      initial={{ x: '-50%', y: '-50%', scale: 0, opacity: 0 }}
      animate={{
        x: '-50%',
        y: '-50%',
        scale: [0, 0, 0, 0.2, 1.5, 0.7, 0.15, 0],
        opacity: [0, 0, 0, 0.15, 0.9, 0.35, 0.05, 0],
      }}
      transition={{
        duration: DURATION,
        times: TIMES,
        scale: { duration: DURATION, times: TIMES, ease: 'linear' },
        opacity: { duration: DURATION, times: TIMES, ease: 'linear' },
      }}
    />
  )
}

function CenterGlow() {
  return (
    <m.div
      className="pf-celebration__glow"
      style={{ left: '50%', top: '50%', animation: 'none' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.05, 0.3, 0.2, 0.55, 0.25, 0.08, 0] }}
      transition={{
        duration: DURATION,
        times: TIMES,
        opacity: { duration: DURATION, times: TIMES, ease: 'linear' },
      }}
    />
  )
}

/* ─── Main ─── */

/**
 * Chrysanthemum Ring — embers fly inward from all directions to form a
 * glowing ring, the ring ignites with a pulse of light, then everything
 * explodes outward with burst confetti and sparkle aftermath.
 */
function ModalCelebrationsFireworksRingComponent({
  particleCount = 22,
  particleImages = [],
  particleMaxWidth = 24,
  particleMaxHeight = 24,
  onComplete,
}: ModalCelebrationsFireworksRingProps) {
  const embers = useMemo(() => makeEmbers(particleCount), [particleCount])
  const shimmers = useMemo(makeShimmers, [])
  const bursts = useMemo(() => makeBursts(particleImages), [particleImages])
  const sparkles = useMemo(makeSparkles, [])
  const bgEmbers = useMemo(() => embers.filter((e) => e.layer === 'bg'), [embers])
  const fgEmbers = useMemo(() => embers.filter((e) => e.layer === 'fg'), [embers])

  useEffect(() => {
    if (onComplete === undefined) return
    const maxTime = Math.max(
      DURATION + 0.22,
      ...bursts.map((b) => b.delay + b.dur),
      ...sparkles.map((s) => s.delay + 0.9)
    )
    const timer = setTimeout(onComplete, maxTime * 1000 + 50)
    return () => clearTimeout(timer)
  }, [bursts, sparkles, onComplete])

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__fireworks-ring">
      <CenterGlow />
      <CenterFlash />
      <div className="pf-celebration__depth-bg">
        <EmberLayer embers={bgEmbers} />
      </div>
      <div className="pf-celebration__effects">
        {shimmers.map((s) => (
          <ShimmerDot key={s.id} s={s} />
        ))}
      </div>
      <div className="pf-celebration__depth-fg">
        <EmberLayer embers={fgEmbers} />
        {bursts.map((b) => (
          <BurstPiece key={b.id} b={b} maxW={particleMaxWidth} maxH={particleMaxHeight} />
        ))}
      </div>
      <div className="pf-celebration__layer">
        {sparkles.map((s) => (
          <SparkleDot key={s.id} s={s} />
        ))}
      </div>
    </div>
  )
}

export const ModalCelebrationsFireworksRing = memo(ModalCelebrationsFireworksRingComponent)
