import * as m from 'motion/react-m'
import type { CSSProperties } from 'react'

import { arcanePortalRingImage } from '@/assets'

/* ─── Shared types (re-exported for main file) ─── */

/**
 *
 */
export type RevealPhase = 'materialize' | 'charge' | 'erupt'
/**
 *
 */
export type ParticleData = { id: number; startX: number; startY: number; size: number; delay: number }

/* ─── Constants ─── */

const RUNE_SYMBOLS = ['\u2726', '\u2727', '\u2728', '\u2736', '\u2737', '\u2738']
const RUNE_COUNT = 8

/* ═══════════════════════════════════════════════════
   PORTAL INTRO — ambient, particles, vortex, ring, runes
   ═══════════════════════════════════════════════════ */

/**
 *
 */
export function AmbientGlow() {
  return (
    <m.div
      className="pf-arcane-portal__ambient"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.7, 1] }}
      transition={{ duration: 0.6, times: [0, 0.5, 1] as const }}
    />
  )
}

/**
 *
 */
export function ConvergeParticles({ particles }: { particles: ParticleData[] }) {
  return (
    <div className="pf-arcane-portal__particles">
      {particles.map((p) => (
        <m.div
          key={p.id}
          className="pf-arcane-portal__particle"
          style={{ '--size': `${p.size}px` } as CSSProperties}
          initial={{ x: p.startX, y: p.startY, opacity: 0, scale: 0 }}
          animate={{ x: 0, y: 0, opacity: [0, 0.9, 1, 0], scale: [0, 1.3, 1, 0] }}
          transition={{ duration: 0.7, delay: p.delay, ease: [0.22, 1, 0.36, 1] as const }}
        />
      ))}
    </div>
  )
}

/**
 *
 */
export function InnerVortex({ phase }: { phase: RevealPhase }) {
  return (
    <m.div
      className="pf-arcane-portal__vortex"
      animate={{
        opacity: phase === 'erupt' ? 0 : phase === 'charge' ? 0.95 : 0.75,
        scale: phase === 'erupt' ? 2.5 : phase === 'charge' ? 1.15 : 1,
      }}
      transition={{
        duration: phase === 'erupt' ? 0.4 : 0.6,
        ease: 'easeOut',
      }}
    />
  )
}

/**
 *
 */
export function PortalRing({ phase }: { phase: RevealPhase }) {
  return (
    <m.div
      className="pf-arcane-portal__ring-wrap"
      initial={{ scale: 0, opacity: 0, rotate: -30 }}
      animate={{
        scale: phase === 'erupt' ? 0.4 : phase === 'charge' ? 1.08 : 1,
        opacity: phase === 'erupt' ? 0 : 1,
        rotate: phase === 'erupt' ? -12 : 0,
      }}
      transition={{
        duration: phase === 'erupt' ? 0.45 : phase === 'charge' ? 0.8 : 0.7,
        ease: phase === 'materialize' ? [0.16, 0.84, 0.32, 1] as const : 'easeInOut',
      }}
    >
      <m.div
        className="pf-arcane-portal__ring-glow"
        animate={{
          opacity: phase === 'erupt' ? 0 : phase === 'charge' ? 1 : 0.7,
        }}
        transition={{ duration: 0.5 }}
      />
      <m.img
        src={arcanePortalRingImage}
        alt=""
        aria-hidden="true"
        className="pf-arcane-portal__ring-image"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
    </m.div>
  )
}

/**
 *
 */
export function OrbitingRunes() {
  return (
    <>
      {Array.from({ length: RUNE_COUNT }, (_, i) => {
        const startAngle = (i / RUNE_COUNT) * 360
        const radius = 105
        return (
          <m.span
            key={i}
            className="pf-arcane-portal__rune"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.95, 0.95, 0],
              scale: [0, 1.1, 1, 0],
              x: [
                Math.cos((startAngle * Math.PI) / 180) * radius,
                Math.cos(((startAngle + 120) * Math.PI) / 180) * radius,
                Math.cos(((startAngle + 240) * Math.PI) / 180) * radius,
                Math.cos(((startAngle + 360) * Math.PI) / 180) * (radius * 0.15),
              ],
              y: [
                Math.sin((startAngle * Math.PI) / 180) * radius,
                Math.sin(((startAngle + 120) * Math.PI) / 180) * radius,
                Math.sin(((startAngle + 240) * Math.PI) / 180) * radius,
                Math.sin(((startAngle + 360) * Math.PI) / 180) * (radius * 0.15),
              ],
            }}
            exit={{
              opacity: 0,
              scale: 0,
              transition: { duration: 0.25 },
            }}
            transition={{
              duration: 2.4,
              delay: i * 0.05,
              times: [0, 0.1, 0.8, 1] as const,
              ease: 'linear',
            }}
          >
            {RUNE_SYMBOLS[i % RUNE_SYMBOLS.length]}
          </m.span>
        )
      })}
    </>
  )
}

/**
 *
 */
export function Shockwave() {
  return (
    <m.div
      className="pf-arcane-portal__shockwave"
      initial={{ scale: 0.3, opacity: 1 }}
      animate={{ scale: 5, opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 0.84, 0.32, 1] as const }}
    />
  )
}

/**
 *
 */
export function BurstFlash() {
  return (
    <m.div
      className="pf-arcane-portal__burst"
      initial={{ opacity: 0, scale: 0.1 }}
      animate={{ opacity: [0, 1, 0], scale: [0.1, 1.2, 2] }}
      transition={{ duration: 0.55, times: [0, 0.12, 1] as const, ease: 'easeOut' }}
    />
  )
}

/* ═══════════════════════════════════════════════════
   CLAIM — button + burst flash on collect
   ═══════════════════════════════════════════════════ */

/**
 *
 */
export function ClaimBurst() {
  return (
    <m.div
      className="pf-arcane-portal__claim-burst"
      initial={{ opacity: 0, scale: 0.2 }}
      animate={{ opacity: [0, 0.8, 0], scale: [0.2, 1.5, 2.5] }}
      transition={{ duration: 0.5, times: [0, 0.2, 1] as const, ease: 'easeOut' }}
    />
  )
}

/**
 *
 */
export function ClaimButton({ onClaim }: { onClaim: () => void }) {
  return (
    <m.button
      type="button"
      className="pf-arcane-portal__claim-btn"
      initial={{ opacity: 0, scale: 0.7, y: 20 }}
      animate={{ opacity: 1, scale: [0.7, 1.06, 1], y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: -10, transition: { duration: 0.25, ease: 'easeIn' } }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as const }}
      onClick={onClaim}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      CLAIM
    </m.button>
  )
}
