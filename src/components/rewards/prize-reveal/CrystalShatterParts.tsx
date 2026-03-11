import * as m from 'motion/react-m'
import type { CSSProperties } from 'react'

import {
  crystalShatterDustImage,
  crystalShatterEnergyMoteImage,
  crystalShatterPrismaticRingImage,
  crystalShatterShard1Image,
  crystalShatterShard2Image,
  crystalShatterShard3Image,
  crystalShatterShard4Image,
  crystalShatterSparkleImage,
} from '@/assets'

/* ─── Shared types ─── */

/**
 *
 */
export type ShatterPhase = 'descent' | 'charge' | 'shatter' | 'reveal' | 'idle'

/**
 *
 */
export type FragmentData = {
  id: number
  angle: number
  distance: number
  rotation: number
  shardIndex: number
}

/**
 *
 */
export type MoteData = {
  id: number
  startX: number
  startY: number
  midX: number
  midY: number
  size: number
  delay: number
}

/**
 *
 */
export type DustData = {
  id: number
  angle: number
  distance: number
  speed: number
  size: number
}

/**
 *
 */
export type OrbitDustData = {
  id: number
  angle: number
  radius: number
  size: number
}

/* ─── Constants ─── */

const SHARD_IMAGES = [
  crystalShatterShard1Image,
  crystalShatterShard2Image,
  crystalShatterShard3Image,
  crystalShatterShard4Image,
]

/* ═══════════════════════════════════════════════════
   AMBIENT DUST — floating background particles
   ═══════════════════════════════════════════════════ */

/**
 *
 */
export function AmbientDust() {
  const particles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 280,
    y: (Math.random() - 0.5) * 260,
    size: 2 + Math.random() * 3,
    duration: 4 + Math.random() * 4,
    delay: Math.random() * 3,
  }))

  return (
    <div className="pf-crystal-shatter__ambient-dust">
      {particles.map((p) => (
        <m.img
          key={p.id}
          src={crystalShatterDustImage}
          alt=""
          aria-hidden="true"
          className="pf-crystal-shatter__ambient-mote"
          style={{
            '--x': `${p.x}px`,
            '--y': `${p.y}px`,
            '--size': `${p.size}px`,
          } as CSSProperties}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.4, 0.3, 0.4, 0],
            x: [p.x, p.x + 15, p.x - 10, p.x + 5, p.x],
            y: [p.y, p.y - 10, p.y + 8, p.y - 5, p.y],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   LANDING RING — dust ring on crystal arrival
   ═══════════════════════════════════════════════════ */

/**
 *
 */
export function LandingRing() {
  return (
    <m.div
      className="pf-crystal-shatter__landing-ring"
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: [0, 0.8, 0], scale: [0.3, 1.5, 1.8] }}
      transition={{
        duration: 0.4,
        delay: 0.8,
        times: [0, 0.4, 1] as const,
        ease: 'easeOut',
      }}
    />
  )
}

/* ═══════════════════════════════════════════════════
   ENERGY MOTES — converge inward during charge
   ═══════════════════════════════════════════════════ */

/**
 *
 */
export function EnergyMotes({ motes }: { motes: MoteData[] }) {
  return (
    <div className="pf-crystal-shatter__motes-container">
      {motes.map((mote) => (
        <m.img
          key={mote.id}
          src={crystalShatterEnergyMoteImage}
          alt=""
          aria-hidden="true"
          className="pf-crystal-shatter__energy-mote"
          style={{ '--mote-size': `${mote.size}px` } as CSSProperties}
          initial={{ x: mote.startX, y: mote.startY, scale: 1, opacity: 0 }}
          animate={{
            x: [mote.startX, mote.midX, 0],
            y: [mote.startY, mote.midY, 0],
            scale: [1, 0.6, 0.2],
            opacity: [0, 0.9, 0],
          }}
          transition={{
            duration: 0.7,
            delay: mote.delay,
            times: [0, 0.5, 1] as const,
            ease: [0.4, 0, 0.2, 1] as const,
          }}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   SHATTER EFFECTS — flash, ring, fragments, dust
   ═══════════════════════════════════════════════════ */

/**
 *
 */
export function ShatterFlash() {
  return (
    <m.img
      src={crystalShatterSparkleImage}
      alt=""
      aria-hidden="true"
      className="pf-crystal-shatter__flash"
      initial={{ scale: 0, opacity: 0.8 }}
      animate={{ scale: [0, 2, 2.5], opacity: [0.8, 0.5, 0] }}
      transition={{
        duration: 0.25,
        times: [0, 0.3, 1] as const,
        ease: 'easeOut',
      }}
    />
  )
}

/**
 *
 */
export function PrismaticRingBurst() {
  return (
    <m.img
      src={crystalShatterPrismaticRingImage}
      alt=""
      aria-hidden="true"
      className="pf-crystal-shatter__prismatic-ring"
      initial={{ scale: 0.1, opacity: 0.8 }}
      animate={{ scale: [0.1, 2.5], opacity: [0.8, 0] }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    />
  )
}

/**
 *
 */
export function CrystalFragments({ fragments }: { fragments: FragmentData[] }) {
  return (
    <div className="pf-crystal-shatter__fragments">
      {fragments.map((f) => {
        const endX = Math.cos(f.angle) * f.distance
        const endY = Math.sin(f.angle) * f.distance
        return (
          <m.div
            key={f.id}
            className="pf-crystal-shatter__shard"
            style={{
              backgroundImage: `url(${SHARD_IMAGES[f.shardIndex]})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
            initial={{ x: 0, y: 0, scale: 1.2, opacity: 1, rotate: 0 }}
            animate={{
              x: [0, endX * 0.4, endX],
              y: [0, endY * 0.4, endY],
              scale: [1.2, 0.9, 0.3],
              opacity: [1, 1, 0],
              rotate: [0, f.rotation * 0.5, f.rotation],
            }}
            transition={{
              duration: 1.2,
              times: [0, 0.35, 1] as const,
              ease: [0.2, 0, 0.1, 1] as const,
            }}
          />
        )
      })}
    </div>
  )
}

/**
 *
 */
export function DustSpray({ particles }: { particles: DustData[] }) {
  return (
    <div className="pf-crystal-shatter__dust-spray">
      {particles.map((p) => {
        const endX = Math.cos(p.angle) * p.distance
        const endY = Math.sin(p.angle) * p.distance
        return (
          <m.img
            key={p.id}
            src={crystalShatterDustImage}
            alt=""
            aria-hidden="true"
            className="pf-crystal-shatter__dust-particle"
            style={{ '--dust-size': `${p.size}px` } as CSSProperties}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: endX,
              y: endY,
              opacity: [1, 0.6, 0],
              scale: [1, 0.5, 0.2],
            }}
            transition={{
              duration: 0.4 + p.speed * 0.3,
              delay: Math.random() * 0.15,
              ease: 'easeOut',
            }}
          />
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   CLAIM BUTTON — crystal-themed
   ═══════════════════════════════════════════════════ */

/**
 *
 */
export function ClaimButton({ onClaim }: { onClaim: () => void }) {
  return (
    <m.button
      className="pf-crystal-shatter__claim-btn"
      type="button"
      onClick={onClaim}
      initial={{ scale: 0.85, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      CLAIM
    </m.button>
  )
}

/* ═══════════════════════════════════════════════════
   CLAIM BURST — flash when prizes are collected
   ═══════════════════════════════════════════════════ */

/**
 *
 */
export function ClaimBurst() {
  return (
    <m.div
      className="pf-crystal-shatter__claim-burst"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: [0, 0.6, 0], scale: [0.5, 2, 2.5] }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    />
  )
}
