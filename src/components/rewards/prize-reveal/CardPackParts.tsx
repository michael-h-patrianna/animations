import * as m from 'motion/react-m'
import { useMemo, type CSSProperties } from 'react'

import {
  cardPackBackImage,
  cardPackClosedImage,
  crystalShatterDustImage,
  crystalShatterEnergyMoteImage,
  crystalShatterPrismaticRingImage,
  crystalShatterSparkleImage,
} from '@/assets'

/* ─── Shared types ─── */

export type PackPhase = 'arrival' | 'anticipation' | 'burst' | 'fan' | 'flip' | 'idle'

export type CardRarity = 1 | 2 | 3 | 4 | 5

export type CardData = {
  id: number
  name: string
  rarity: CardRarity
  frontImage: string
}

export type FanPosition = { x: number; y: number; rotate: number }

export type ConvergeMoteData = {
  id: number
  startX: number
  startY: number
  midX: number
  midY: number
  size: number
  delay: number
}

export type ConfettiData = {
  id: number
  angle: number
  distance: number
  rotation: number
  size: number
}

/* ─── Constants ─── */

export const RARITY_COLORS: Record<CardRarity, { primary: string; glow: string }> = {
  1: { primary: 'rgb(180 195 210)', glow: 'rgb(180 195 210 / 40%)' },
  2: { primary: 'rgb(80 200 120)', glow: 'rgb(80 200 120 / 40%)' },
  3: { primary: 'rgb(160 90 255)', glow: 'rgb(160 90 255 / 40%)' },
  4: { primary: 'rgb(255 185 40)', glow: 'rgb(255 185 40 / 40%)' },
  5: { primary: 'rgb(255 100 180)', glow: 'rgb(255 100 180 / 40%)' },
}

export const FAN_POSITIONS: FanPosition[] = [
  { x: -116, y: 20, rotate: -12 },
  { x: -58, y: 6, rotate: -6 },
  { x: 0, y: -8, rotate: 0 },
  { x: 58, y: 6, rotate: 6 },
  { x: 116, y: 20, rotate: 12 },
]

/* Tear at the top seal — 16% amplitude, jagged rip at 20–36% from top */
const TEAR_FLAP_CLIP = 'polygon(0% 0%, 100% 0%, 100% 20%, 95% 36%, 89% 20%, 82% 36%, 75% 20%, 68% 36%, 61% 20%, 54% 36%, 47% 20%, 40% 36%, 33% 20%, 26% 36%, 19% 20%, 12% 36%, 5% 20%, 0% 36%)'
const TEAR_BODY_CLIP = 'polygon(0% 36%, 5% 20%, 12% 36%, 19% 20%, 26% 36%, 33% 20%, 40% 36%, 47% 20%, 54% 36%, 61% 20%, 68% 36%, 75% 20%, 82% 36%, 89% 20%, 95% 36%, 100% 20%, 100% 100%, 0% 100%)'

/* ═══════════════════════════════════════════════════
   ATMOSPHERE — floating dust particles (image-based)
   ═══════════════════════════════════════════════════ */

export function AmbientMotes() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 340,
    y: (Math.random() - 0.5) * 300,
    size: 3 + Math.random() * 4,
    duration: 5 + Math.random() * 5,
    delay: Math.random() * 3,
  }))

  return (
    <div className="pf-card-pack__ambient">
      {particles.map((p) => (
        <m.img
          key={p.id}
          src={crystalShatterDustImage}
          alt=""
          aria-hidden="true"
          className="pf-card-pack__ambient-mote"
          style={{ '--mote-size': `${p.size}px` } as CSSProperties}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.45, 0.25, 0.45, 0],
            x: [p.x, p.x + 14, p.x - 10, p.x + 8, p.x],
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
   PACK BODY — holographic shimmer + multi-layer glow
   ═══════════════════════════════════════════════════ */

export function PackBody({ phase }: { phase: PackPhase }) {
  const isShaking = phase === 'anticipation'
  const isVisible = phase === 'arrival' || phase === 'anticipation'

  if (!isVisible) return null

  return (
    <m.div
      className={`pf-card-pack__pack-body ${isShaking ? 'pf-card-pack__pack-body--shaking' : ''}`}
      initial={{ y: -180, scale: 0.5, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      transition={{
        y: { duration: 0.8, ease: [0.16, 0.84, 0.32, 1] },
        scale: { duration: 0.8, ease: [0.16, 0.84, 0.32, 1] },
        opacity: { duration: 0.4 },
      }}
    >
      <img src={cardPackClosedImage} alt="" aria-hidden="true" className="pf-card-pack__pack-image" />
      <m.div
        className="pf-card-pack__pack-glow"
        animate={
          isShaking
            ? { opacity: [0.4, 0.85, 0.4], scale: [1, 1.2, 1] }
            : { opacity: [0.2, 0.35, 0.2], scale: 1 }
        }
        transition={{ duration: isShaking ? 0.6 : 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="pf-card-pack__pack-ambient-glow" />
    </m.div>
  )
}

/* ═══════════════════════════════════════════════════
   LANDING PULSE
   ═══════════════════════════════════════════════════ */

export function LandingPulse() {
  return (
    <m.div
      className="pf-card-pack__landing-pulse"
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: [0, 0.7, 0], scale: [0.3, 1.6, 2.1] }}
      transition={{ duration: 0.5, delay: 0.75, times: [0, 0.35, 1] as const, ease: 'easeOut' }}
    />
  )
}

/* ═══════════════════════════════════════════════════
   SEAM LIGHT — horizontal glow at pack's tear line
   ═══════════════════════════════════════════════════ */

export function SeamLight({ phase }: { phase: PackPhase }) {
  if (phase !== 'anticipation') return null

  return (
    <m.div
      className="pf-card-pack__seam"
      initial={{ opacity: 0, scaleX: 0.2 }}
      animate={{ opacity: [0, 0.5, 1], scaleX: [0.2, 0.6, 1.2] }}
      transition={{ duration: 1.2, times: [0, 0.5, 1] as const, ease: 'easeIn' }}
    />
  )
}

/* ═══════════════════════════════════════════════════
   CONVERGE MOTES — energy particles spiraling inward (image-based)
   ═══════════════════════════════════════════════════ */

export function ConvergeMotes({ motes }: { motes: ConvergeMoteData[] }) {
  return (
    <div className="pf-card-pack__converge-container">
      {motes.map((mote) => (
        <m.img
          key={mote.id}
          src={crystalShatterEnergyMoteImage}
          alt=""
          aria-hidden="true"
          className="pf-card-pack__converge-mote"
          style={{ '--mote-size': `${mote.size}px` } as CSSProperties}
          initial={{ x: mote.startX, y: mote.startY, scale: 1, opacity: 0 }}
          animate={{
            x: [mote.startX, mote.midX, 0],
            y: [mote.startY, mote.midY, 0],
            scale: [1, 0.7, 0.15],
            opacity: [0, 0.9, 0],
          }}
          transition={{
            duration: 0.75,
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
   PACK BURST — top-rip open with jagged tear line
   Flap tears upward, body stays then fades
   ═══════════════════════════════════════════════════ */

export function PackTearOpen() {
  return (
    <div className="pf-card-pack__tear-container">
      {/* Flap — rips upward, curls back in 3D */}
      <m.img
        src={cardPackClosedImage}
        alt=""
        aria-hidden="true"
        className="pf-card-pack__tear-flap"
        style={{ clipPath: TEAR_FLAP_CLIP }}
        initial={{ y: 0, rotateX: 0, rotateZ: 0, opacity: 1, scale: 1 }}
        animate={{ y: -90, rotateX: -120, rotateZ: -4, opacity: [1, 0.9, 0], scale: [1, 0.9, 0.7] }}
        transition={{
          duration: 0.7,
          times: [0, 0.35, 1] as const,
          ease: [0.2, 0, 0.6, 1] as const,
        }}
      />
      {/* Body — briefly shudders then drops */}
      <m.img
        src={cardPackClosedImage}
        alt=""
        aria-hidden="true"
        className="pf-card-pack__tear-body"
        style={{ clipPath: TEAR_BODY_CLIP }}
        initial={{ y: 0, rotateZ: 0, opacity: 1, scale: 1 }}
        animate={{ y: 80, rotateZ: 3, opacity: [1, 0.8, 0], scale: [1, 0.95, 0.8] }}
        transition={{
          duration: 0.65,
          delay: 0.08,
          times: [0, 0.35, 1] as const,
          ease: [0.3, 0, 1, 1] as const,
        }}
      />
    </div>
  )
}

export function BurstFlash() {
  return (
    <m.img
      src={crystalShatterSparkleImage}
      alt=""
      aria-hidden="true"
      className="pf-card-pack__burst-flash"
      initial={{ scale: 0, opacity: 0.9 }}
      animate={{ scale: [0, 2.5, 3.5], opacity: [0.9, 0.5, 0] }}
      transition={{ duration: 0.35, times: [0, 0.3, 1] as const, ease: 'easeOut' }}
    />
  )
}

export function BurstRing() {
  return (
    <m.img
      src={crystalShatterPrismaticRingImage}
      alt=""
      aria-hidden="true"
      className="pf-card-pack__burst-ring"
      initial={{ scale: 0.1, opacity: 0.75 }}
      animate={{ scale: [0.1, 2.8], opacity: [0.75, 0] }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    />
  )
}

export function LightColumn() {
  return (
    <m.div
      className="pf-card-pack__light-column"
      initial={{ scaleY: 0, opacity: 0.85 }}
      animate={{ scaleY: [0, 1, 1], opacity: [0.85, 0.55, 0] }}
      transition={{ duration: 0.7, times: [0, 0.3, 1] as const, ease: 'easeOut' }}
    />
  )
}

export function ShockwaveRing() {
  return (
    <m.div
      className="pf-card-pack__shockwave"
      initial={{ scale: 0.3, opacity: 0.8 }}
      animate={{ scale: 4.5, opacity: 0 }}
      transition={{ duration: 0.55, delay: 0.04, ease: [0.16, 0.84, 0.32, 1] as const }}
    />
  )
}

export function GoldenConfetti({ confetti }: { confetti: ConfettiData[] }) {
  return (
    <div className="pf-card-pack__confetti-container">
      {confetti.map((c) => {
        const endX = Math.cos(c.angle) * c.distance
        const endY = Math.sin(c.angle) * c.distance + 25
        return (
          <m.img
            key={c.id}
            src={crystalShatterDustImage}
            alt=""
            aria-hidden="true"
            className="pf-card-pack__confetti-piece"
            style={{ '--confetti-size': `${c.size}px` } as CSSProperties}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
            animate={{
              x: endX,
              y: endY,
              opacity: [1, 0.7, 0],
              scale: [1, 0.5, 0.15],
              rotate: c.rotation,
            }}
            transition={{
              duration: 0.55 + Math.random() * 0.25,
              delay: Math.random() * 0.12,
              ease: 'easeOut',
            }}
          />
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   CARD NAME RIBBON — SVG text auto-scales to fit, wraps to 2 lines
   ═══════════════════════════════════════════════════ */

function CardNameRibbon({ name, rarity }: { name: string; rarity: CardRarity }) {
  const words = name.split(' ')
  const multiLine = name.length > 11 && words.length >= 2
  const line1 = multiLine ? words.slice(0, Math.ceil(words.length / 2)).join(' ') : name
  const line2 = multiLine ? words.slice(Math.ceil(words.length / 2)).join(' ') : ''
  const svgH = multiLine ? 32 : 22

  return (
    <div className={`pf-card-pack__card-ribbon pf-card-pack__card-ribbon--rarity-${rarity}`}>
      <svg
        viewBox={`0 0 100 ${svgH}`}
        preserveAspectRatio="xMidYMid meet"
        className="pf-card-pack__card-ribbon-svg"
        role="img"
        aria-label={name}
      >
        {multiLine ? (
          <>
            <text
              x="50"
              y={svgH * 0.36}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontWeight="900"
              fontSize="10"
              fontFamily="system-ui, sans-serif"
            >
              {line1}
            </text>
            <text
              x="50"
              y={svgH * 0.76}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontWeight="900"
              fontSize="10"
              fontFamily="system-ui, sans-serif"
            >
              {line2}
            </text>
          </>
        ) : (
          <text
            x="50"
            y={svgH / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontWeight="900"
            fontSize="11"
            fontFamily="system-ui, sans-serif"
          >
            {name}
          </text>
        )}
      </svg>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   IDLE FLOAT — sinusoidal wave with subtle rotation sway
   Main: vertical sine (7px, 3.5s)
   Subtle: rotation sine (±1.5°, same period, π/4 phase lead)
   ═══════════════════════════════════════════════════ */

const FLOAT_STEPS = 24
const FLOAT_Y_AMP = 4
const FLOAT_ROT_AMP = 0.8
const FLOAT_DURATION = 3.5

function generateFloatKeyframes(phase: number) {
  const yKeys: number[] = []
  const rotKeys: number[] = []
  for (let k = 0; k < FLOAT_STEPS; k++) {
    const t = k / FLOAT_STEPS
    yKeys.push(FLOAT_Y_AMP * Math.sin(t * Math.PI * 2 + phase))
    rotKeys.push(FLOAT_ROT_AMP * Math.sin(t * Math.PI * 2 + phase + Math.PI / 4))
  }
  return { yKeys, rotKeys }
}

/* ═══════════════════════════════════════════════════
   FLIP CARD — Monopoly Go style: frame + lights + 3D stars + ribbon
   ═══════════════════════════════════════════════════ */

export function FlipCard({
  card,
  position,
  flipped,
  fanDelay,
  collected,
  collectIndex,
  idle = false,
  bobPhase = 0,
}: {
  card: CardData
  position: FanPosition
  flipped: boolean
  fanDelay: number
  collected: boolean
  collectIndex: number
  idle?: boolean
  bobPhase?: number
}) {
  const rarityClass = `pf-card-pack__card--rarity-${card.rarity}`
  const floatActive = idle && !collected
  const float = useMemo(() => generateFloatKeyframes(bobPhase), [bobPhase])

  return (
    <m.div
      className={`pf-card-pack__card-slot ${rarityClass}`}
      initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }}
      animate={
        collected
          ? {
              x: [position.x, position.x * 0.3],
              y: [position.y, -320],
              scale: [1, 0.15],
              opacity: [1, 0],
              rotate: [position.rotate, 0],
            }
          : {
              x: position.x,
              y: position.y,
              scale: [0, 1.12, 1],
              opacity: 1,
              rotate: position.rotate,
            }
      }
      transition={
        collected
          ? { duration: 0.65, delay: collectIndex * 0.08, ease: [0.4, 0, 1, 1] as const }
          : { duration: 0.5, delay: fanDelay, ease: [0.34, 1.56, 0.64, 1] as const }
      }
    >
      {/* Float wrapper — synchronized idle wave */}
      <m.div
        className="pf-card-pack__card-perspective"
        animate={floatActive ? { y: float.yKeys, rotate: float.rotKeys } : {}}
        transition={floatActive ? { duration: FLOAT_DURATION, repeat: Infinity, ease: 'linear' } : {}}
      >
        {/* Flipper — rotateY driven by Framer, preserve-3d inline */}
        <m.div
          className="pf-card-pack__card-flipper"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] as const }}
          style={{ transformStyle: 'preserve-3d' } as CSSProperties}
        >
          {/* ── BACK FACE ── */}
          <div className="pf-card-pack__card-face pf-card-pack__card-back">
            <div className="pf-card-pack__card-frame">
              <img
                src={cardPackBackImage}
                alt=""
                aria-hidden="true"
                className="pf-card-pack__card-img"
              />
            </div>
          </div>

          {/* ── FRONT FACE ── */}
          <div className="pf-card-pack__card-face pf-card-pack__card-front">
            {/* Gold 3D stars — overflow above the frame */}
            <div className={`pf-card-pack__card-stars pf-card-pack__card-stars--rarity-${card.rarity}`}>
              {Array.from({ length: card.rarity }, (_, i) => {
                const mid = (card.rarity - 1) / 2
                const arcY = Math.abs(i - mid) * 2
                return (
                <svg
                  key={i}
                  className="pf-card-pack__card-star"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  style={{ transform: `translateY(${arcY}px)` }}
                >
                  <defs>
                    <radialGradient id={`pf-sg-${card.id}-${i}`} cx="38%" cy="28%" r="72%">
                      <stop offset="0%" stopColor="#FFFDE7" />
                      <stop offset="25%" stopColor="#FFE100" />
                      <stop offset="65%" stopColor="#FFA000" />
                      <stop offset="100%" stopColor="#E65100" />
                    </radialGradient>
                  </defs>
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    fill={`url(#pf-sg-${card.id}-${i})`}
                    stroke="#9A3412"
                    strokeWidth="0.5"
                    strokeLinejoin="round"
                  />
                </svg>
                )
              })}
            </div>

            {/* Card frame — white border + art */}
            <div className={`pf-card-pack__card-frame pf-card-pack__card-frame--rarity-${card.rarity}`}>
              <div className="pf-card-pack__card-img-area">
                <img src={card.frontImage} alt={card.name} className="pf-card-pack__card-img" />
              </div>
            </div>

            {/* Name ribbon — overflow below the frame */}
            <CardNameRibbon name={card.name} rarity={card.rarity} />
          </div>
        </m.div>
      </m.div>
    </m.div>
  )
}

/* ═══════════════════════════════════════════════════
   RARITY BURST — multi-layered: glow + sparkle flash + ring + particles
   ═══════════════════════════════════════════════════ */

export function RarityBurst({ rarity, position }: { rarity: CardRarity; position: FanPosition }) {
  const burstScale = 0.5 + rarity * 0.45
  const particleCount = 3 + rarity * 3
  const color = RARITY_COLORS[rarity]

  const particles = Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4
    const dist = 20 + rarity * 12 + Math.random() * 10
    return { id: i, angle, dist, size: 4 + Math.random() * 6 }
  })

  return (
    <div
      className="pf-card-pack__rarity-burst-wrap"
      style={{ '--burst-x': `${position.x}px`, '--burst-y': `${position.y}px` } as CSSProperties}
    >
      {/* Glow pulse */}
      <m.div
        className="pf-card-pack__rarity-glow"
        style={{ '--burst-color': color.glow } as CSSProperties}
        initial={{ scale: 0.3, opacity: 0.8 }}
        animate={{ scale: [0.3, burstScale * 1.5, burstScale * 2], opacity: [0.8, 0.3, 0] }}
        transition={{ duration: 0.55, times: [0, 0.4, 1] as const, ease: 'easeOut' }}
      />

      {/* Flash (sparkle image) */}
      <m.img
        src={crystalShatterSparkleImage}
        alt=""
        aria-hidden="true"
        className="pf-card-pack__rarity-flash"
        initial={{ scale: 0, opacity: 0.9 }}
        animate={{ scale: [0, burstScale, burstScale * 1.3], opacity: [0.9, 0.4, 0] }}
        transition={{ duration: 0.35, times: [0, 0.35, 1] as const, ease: 'easeOut' }}
      />

      {/* Ring burst for rare+ */}
      {rarity >= 3 && (
        <m.img
          src={crystalShatterPrismaticRingImage}
          alt=""
          aria-hidden="true"
          className="pf-card-pack__rarity-ring"
          initial={{ scale: 0.05, opacity: 0.7 }}
          animate={{ scale: burstScale * 1.2, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      )}

      {/* Spark particles (dust images flying outward) */}
      {particles.map((p) => (
        <m.img
          key={p.id}
          src={crystalShatterDustImage}
          alt=""
          aria-hidden="true"
          className="pf-card-pack__rarity-spark"
          style={{ '--spark-size': `${p.size}px` } as CSSProperties}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(p.angle) * p.dist,
            y: Math.sin(p.angle) * p.dist,
            opacity: 0,
            scale: 0.2,
          }}
          transition={{ duration: 0.45, delay: 0.04, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   SCREEN FLASH — epic / legendary
   ═══════════════════════════════════════════════════ */

export function ScreenFlash({ rarity }: { rarity: CardRarity }) {
  if (rarity < 4) return null
  return (
    <m.div
      className={`pf-card-pack__screen-flash pf-card-pack__screen-flash--rarity-${rarity}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, rarity === 5 ? 0.4 : 0.22, 0] }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    />
  )
}

/* ═══════════════════════════════════════════════════
   COLLECT
   ═══════════════════════════════════════════════════ */

export function CollectButton({ onCollect }: { onCollect: () => void }) {
  return (
    <m.button
      type="button"
      className="pf-card-pack__collect-btn"
      initial={{ opacity: 0, scale: 0.7, y: 15 }}
      animate={{ opacity: 1, scale: [0.7, 1.06, 1], y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: -10, transition: { duration: 0.25, ease: 'easeIn' } }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as const }}
      onClick={onCollect}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      COLLECT ALL
    </m.button>
  )
}

export function CollectBurst() {
  return (
    <m.div
      className="pf-card-pack__collect-burst"
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: [0, 0.6, 0], scale: [0.3, 2, 2.8] }}
      transition={{ duration: 0.5, times: [0, 0.2, 1] as const, ease: 'easeOut' }}
    />
  )
}
