import * as m from 'motion/react-m'
import { useState, type CSSProperties } from 'react'

import { cardPackBackImage } from '@/assets'

import { type CardData, type CardRarity, type FanPosition } from './CardPackParts'

/* ═══════════════════════════════════════════════════
   CARD NAME RIBBON — SVG text auto-scales to fit, wraps to 2 lines
   ═══════════════════════════════════════════════════ */

function CardNameRibbon({ name, rarity, ribbonColor }: { name: string; rarity: CardRarity; ribbonColor?: string }) {
  const words = name.split(' ')
  const multiLine = name.length > 11 && words.length >= 2
  const line1 = multiLine ? words.slice(0, Math.ceil(words.length / 2)).join(' ') : name
  const line2 = multiLine ? words.slice(Math.ceil(words.length / 2)).join(' ') : ''
  const svgH = multiLine ? 32 : 22

  return (
    <div
      className={`pf-card-pack__card-ribbon ${ribbonColor ? '' : `pf-card-pack__card-ribbon--rarity-${rarity}`}`}
      style={ribbonColor ? { '--ribbon-bg': ribbonColor } as CSSProperties : undefined}
    >
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
              fill="var(--pf-white)"
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
              fill="var(--pf-white)"
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
            fill="var(--pf-white)"
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
   NEW BADGE — red starburst with white "NEW" text
   Pops in after the card flips with a bouncy scale
   ═══════════════════════════════════════════════════ */

/** 12-point starburst clip-path for the badge shape */
const STARBURST_POINTS = 12
const STARBURST_CLIP = (() => {
  const pts: string[] = []
  for (let i = 0; i < STARBURST_POINTS * 2; i++) {
    const angle = (i / (STARBURST_POINTS * 2)) * Math.PI * 2 - Math.PI / 2
    const r = i % 2 === 0 ? 50 : 38
    const x = 50 + r * Math.cos(angle)
    const y = 50 + r * Math.sin(angle)
    pts.push(`${x.toFixed(1)}% ${y.toFixed(1)}%`)
  }
  return `polygon(${pts.join(', ')})`
})()

function NewBadge() {
  return (
    <m.div
      className="pf-card-pack__new-badge"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.3, 1], opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <div className="pf-card-pack__new-badge-star" style={{ clipPath: STARBURST_CLIP }}>
        <span className="pf-card-pack__new-badge-text">NEW</span>
      </div>
    </m.div>
  )
}

/* ═══════════════════════════════════════════════════
   CARD LAND SHIMMER — subtle glow pulse when a card
   arrives at its fan position (secondary action)
   ═══════════════════════════════════════════════════ */

/**
 *
 */
export function CardLandShimmer({ position, delay }: { position: FanPosition; delay: number }) {
  return (
    <m.div
      className="pf-card-pack__land-shimmer"
      style={{ '--shimmer-x': `${position.x}px`, '--shimmer-y': `${position.y}px` } as CSSProperties}
      initial={{ opacity: 0, scale: 0.2 }}
      animate={{ opacity: [0, 0.55, 0], scale: [0.2, 1.1, 1.5] }}
      transition={{ duration: 0.55, delay, times: [0, 0.3, 1] as const, ease: 'easeOut' }}
    />
  )
}

/* ═══════════════════════════════════════════════════
   IDLE FLOAT — sinusoidal wave with subtle rotation sway
   Main: vertical sine (4px, 3.5s)
   Subtle: rotation sine (±0.8°, same period)
   ═══════════════════════════════════════════════════ */

const FLOAT_STEPS = 24
const FLOAT_Y_AMP = 4
const FLOAT_ROT_AMP = 0.8
const FLOAT_DURATION = 3.5

function generateFloatKeyframes() {
  const yKeys: number[] = []
  const rotKeys: number[] = []
  for (let k = 0; k <= FLOAT_STEPS; k++) {
    const t = k / FLOAT_STEPS
    yKeys.push(FLOAT_Y_AMP * Math.sin(t * Math.PI * 2))
    rotKeys.push(FLOAT_ROT_AMP * Math.sin(t * Math.PI * 2))
  }
  return { yKeys, rotKeys }
}

const FLOAT_KEYFRAMES = generateFloatKeyframes()

/* ═══════════════════════════════════════════════════
   FLIP CARD — Monopoly Go style: frame + lights + 3D stars + ribbon
   ═══════════════════════════════════════════════════ */

function CardStars({ card }: { card: CardData }) {
  return (
    <m.div
      className={`pf-card-pack__card-stars pf-card-pack__card-stars--rarity-${card.rarity}`}
      {...(card.rarity === 5 ? {
        animate: {
          filter: [
            'drop-shadow(0 3px 4px rgba(0,0,0,0.55)) drop-shadow(0 0 8px rgba(255,80,180,0.5))',
            'drop-shadow(0 3px 4px rgba(0,0,0,0.55)) drop-shadow(0 0 10px rgba(255,220,50,0.6))',
            'drop-shadow(0 3px 4px rgba(0,0,0,0.55)) drop-shadow(0 0 8px rgba(255,80,180,0.5))',
          ],
        },
        transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
      } : {})}
    >
      {Array.from({ length: card.rarity }, (_, i) => {
        const mid = (card.rarity - 1) / 2
        const arcY = Math.abs(i - mid) * 2
        return (
        <svg key={i} className="pf-card-pack__card-star" viewBox="0 0 24 24" aria-hidden="true" style={{ transform: `translateY(${arcY}px)` }}>
          <defs>
            <radialGradient id={`pf-sg-${card.id}-${i}`} cx="38%" cy="28%" r="72%">
              <stop offset="0%" stopColor="var(--star-grad-0)" />
              <stop offset="25%" stopColor="var(--star-grad-25)" />
              <stop offset="65%" stopColor="var(--star-grad-65)" />
              <stop offset="100%" stopColor="var(--star-grad-100)" />
            </radialGradient>
          </defs>
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={`url(#pf-sg-${card.id}-${i})`}
            stroke="var(--star-stroke)" strokeWidth="0.5" strokeLinejoin="round"
          />
        </svg>
        )
      })}
    </m.div>
  )
}

function CardFrame({ card }: { card: CardData }) {
  return (
    <m.div
      className={`pf-card-pack__card-frame pf-card-pack__card-frame--rarity-${card.rarity}`}
      {...(card.rarity === 5 ? {
        animate: {
          boxShadow: [
            '0 4px 16px rgba(0,0,0,0.4), 0 0 22px 10px rgba(255,80,170,0.45), inset 0 0 0 2px rgba(255,80,170,0.5)',
            '0 4px 20px rgba(0,0,0,0.4), 0 0 22px 10px rgba(100,160,255,0.45), inset 0 0 0 2px rgba(100,160,255,0.5)',
            '0 4px 20px rgba(0,0,0,0.4), 0 0 22px 10px rgba(255,215,50,0.45), inset 0 0 0 2px rgba(255,215,50,0.5)',
            '0 4px 16px rgba(0,0,0,0.4), 0 0 22px 10px rgba(255,80,170,0.45), inset 0 0 0 2px rgba(255,80,170,0.5)',
          ],
        },
        transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
      } : {})}
    >
      <div className="pf-card-pack__card-img-area">
        <img src={card.frontImage} alt={card.name} className="pf-card-pack__card-img" />
      </div>
    </m.div>
  )
}

function CardFlipper({ card, flipped, ribbonColor }: {
  card: CardData; flipped: boolean; ribbonColor?: string
}) {
  return (
    <m.div
      className="pf-card-pack__card-flipper"
      initial={{ rotateY: 0 }}
      animate={{ rotateY: flipped ? 180 : 0 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] as const }}
      style={{ transformStyle: 'preserve-3d' } as CSSProperties}
    >
      <div className="pf-card-pack__card-face pf-card-pack__card-back">
        <div className="pf-card-pack__card-frame">
          <img src={cardPackBackImage} alt="" aria-hidden="true" className="pf-card-pack__card-img" />
        </div>
      </div>
      <div className="pf-card-pack__card-face pf-card-pack__card-front">
        <CardStars card={card} />
        <CardFrame card={card} />
        <CardNameRibbon name={card.name} rarity={card.rarity} ribbonColor={ribbonColor} />
        {card.isNew && <NewBadge />}
      </div>
    </m.div>
  )
}

/**
 *
 */
export function FlipCard({
  card, position, flipped, fanDelay, collected, collectIndex,
  idle = false, bobPhase = 0, selected = false, anySelected = false,
  onSelect, ribbonColor,
}: {
  card: CardData; position: FanPosition; flipped: boolean; fanDelay: number
  collected: boolean; collectIndex: number; idle?: boolean; bobPhase?: number
  selected?: boolean; anySelected?: boolean; onSelect?: () => void; ribbonColor?: string
}) {
  const [fanInDone, setFanInDone] = useState(false)

  const floatActive = idle && !collected
  const floatDelay = (bobPhase / (Math.PI * 2)) * FLOAT_DURATION
  const canTap = idle && flipped && !collected && onSelect
  const inspecting = selected || anySelected
  const inspectSpring = { type: 'spring' as const, stiffness: 260, damping: 26, mass: 1 }

  const slotAnimate = collected
    ? { x: [position.x, position.x * 0.3], y: [position.y, -320], scale: [1, 0.15], opacity: [1, 0], rotate: [position.rotate, 0] }
    : selected
      ? { x: 0, y: -10, scale: 1.4, opacity: 1, rotate: 0 }
      : anySelected
        ? { x: position.x, y: position.y, scale: 0.88, opacity: 0.3, rotate: position.rotate }
        : fanInDone
          ? { x: position.x, y: position.y, scale: 1, opacity: 1, rotate: position.rotate }
          : { x: position.x, y: position.y, scale: [0, 1.12, 1], opacity: 1, rotate: position.rotate }

  const slotTransition = collected
    ? { duration: 0.65, delay: collectIndex * 0.08, ease: [0.4, 0, 1, 1] as const }
    : inspecting || fanInDone
      ? inspectSpring
      : { duration: 0.5, delay: fanDelay, ease: [0.34, 1.56, 0.64, 1] as const }

  return (
    <m.div
      className={`pf-card-pack__card-slot pf-card-pack__card--rarity-${card.rarity}`}
      style={{
        zIndex: selected ? 20 : undefined,
        cursor: canTap && !anySelected ? 'pointer' : selected ? 'pointer' : undefined,
        pointerEvents: anySelected && !selected ? 'none' : undefined,
      }}
      initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }}
      animate={slotAnimate}
      transition={slotTransition}
      onClick={canTap ? onSelect : undefined}
      onAnimationComplete={() => { if (!fanInDone && !collected) setFanInDone(true) }}
    >
      <m.div
        className="pf-card-pack__card-perspective"
        animate={floatActive ? { y: FLOAT_KEYFRAMES.yKeys, rotate: FLOAT_KEYFRAMES.rotKeys } : {}}
        transition={floatActive ? { duration: FLOAT_DURATION, repeat: Infinity, ease: 'linear', delay: floatDelay } : undefined}
      >
        <CardFlipper card={card} flipped={flipped} ribbonColor={ribbonColor} />
      </m.div>
    </m.div>
  )
}
