import { useMemo, type CSSProperties } from 'react'

import cardPackBackImage from '@/assets/card-pack/card-back.png'
import crystalShatterDustImage from '@/assets/crystal-shatter/crystal-dust.png'
import crystalShatterPrismaticRingImage from '@/assets/crystal-shatter/prismatic-ring.png'
import crystalShatterSparkleImage from '@/assets/crystal-shatter/crystal-sparkle.png'

import type {
  CardData,
  CardRarity,
  FanPosition,
} from '@/components/rewards/prize-reveal/CardPackParts'
import { getCardSet } from '@/components/rewards/prize-reveal/cardSets'

/* ─── Starburst clip-path for NEW badge ─── */

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

/* ─── Rarity color map ─── */

const RARITY_GLOW: Record<CardRarity, string> = {
  1: 'var(--rarity-common-glow)',
  2: 'var(--rarity-uncommon-glow)',
  3: 'var(--rarity-rare-glow)',
  4: 'var(--rarity-epic-glow)',
  5: 'var(--rarity-legendary-glow)',
}

/* ─── Card sub-components ─── */

function CardNameRibbon({
  name,
  rarity,
  ribbonColor,
}: {
  name: string
  rarity: CardRarity
  ribbonColor?: string
}) {
  const words = name.split(' ')
  const multiLine = name.length > 11 && words.length >= 2
  const line1 = multiLine ? words.slice(0, Math.ceil(words.length / 2)).join(' ') : name
  const line2 = multiLine ? words.slice(Math.ceil(words.length / 2)).join(' ') : ''
  const svgH = multiLine ? 32 : 22

  return (
    <div
      className={`pf-card-pack-css__card-ribbon ${ribbonColor ? '' : `pf-card-pack-css__card-ribbon--rarity-${rarity}`}`}
      style={ribbonColor ? ({ '--ribbon-bg': ribbonColor } as CSSProperties) : undefined}
    >
      <svg
        viewBox={`0 0 100 ${svgH}`}
        preserveAspectRatio="xMidYMid meet"
        className="pf-card-pack-css__card-ribbon-svg"
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

function CardStars({ card }: { card: CardData }) {
  return (
    <div className="pf-card-pack-css__card-stars">
      {Array.from({ length: card.rarity }, (_, i) => {
        const mid = (card.rarity - 1) / 2
        const arcY = Math.abs(i - mid) * 2
        return (
          <svg
            key={i}
            className="pf-card-pack-css__card-star"
            viewBox="0 0 24 24"
            aria-hidden="true"
            style={{ transform: `translateY(${arcY}px)` }}
          >
            <defs>
              <radialGradient id={`pf-css-sg-${card.id}-${i}`} cx="38%" cy="28%" r="72%">
                <stop offset="0%" stopColor="var(--star-grad-0)" />
                <stop offset="25%" stopColor="var(--star-grad-25)" />
                <stop offset="65%" stopColor="var(--star-grad-65)" />
                <stop offset="100%" stopColor="var(--star-grad-100)" />
              </radialGradient>
            </defs>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={`url(#pf-css-sg-${card.id}-${i})`}
              stroke="var(--star-stroke)"
              strokeWidth="0.5"
              strokeLinejoin="round"
            />
          </svg>
        )
      })}
    </div>
  )
}

function CardFrame({ card }: { card: CardData }) {
  return (
    <div
      className={`pf-card-pack-css__card-frame pf-card-pack-css__card-frame--rarity-${card.rarity}`}
    >
      <div className="pf-card-pack-css__card-img-area">
        <img src={card.frontImage} alt={card.name} className="pf-card-pack-css__card-img" />
      </div>
    </div>
  )
}

function NewBadge() {
  return (
    <div className="pf-card-pack-css__new-badge">
      <div className="pf-card-pack-css__new-badge-star" style={{ clipPath: STARBURST_CLIP }}>
        <span className="pf-card-pack-css__new-badge-text">NEW</span>
      </div>
    </div>
  )
}

function createRarityParticles(rarity: CardRarity) {
  const count = 3 + rarity * 3
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4
    const dist = 20 + rarity * 12 + Math.random() * 10
    return {
      id: i,
      endX: Math.cos(angle) * dist,
      endY: Math.sin(angle) * dist,
      size: 4 + Math.random() * 6,
    }
  })
}

/** Glow and sparkle burst centered on a card when it flips to reveal rarity. */
export function RarityBurst({ rarity, position }: { rarity: CardRarity; position: FanPosition }) {
  const burstScale = 0.5 + rarity * 0.45
  const particles = useMemo(() => createRarityParticles(rarity), [rarity])

  return (
    <div
      className="pf-card-pack-css__rarity-burst-wrap"
      style={{ left: position.x, top: position.y } as CSSProperties}
    >
      <div
        className="pf-card-pack-css__rarity-glow"
        style={
          {
            '--burst-color': RARITY_GLOW[rarity],
            '--burst-scale-start': `${0.3}`,
            '--burst-scale-mid': `${burstScale * 1.5}`,
            '--burst-scale-end': `${burstScale * 2}`,
          } as CSSProperties
        }
      />
      <img
        src={crystalShatterSparkleImage}
        alt=""
        aria-hidden="true"
        className="pf-card-pack-css__rarity-flash"
        style={
          {
            '--burst-scale-mid': `${burstScale}`,
            '--burst-scale-end': `${burstScale * 1.3}`,
          } as CSSProperties
        }
      />
      {rarity >= 3 && (
        <img
          src={crystalShatterPrismaticRingImage}
          alt=""
          aria-hidden="true"
          className="pf-card-pack-css__rarity-ring"
          style={{ '--burst-ring-scale': `${burstScale * 1.2}` } as CSSProperties}
        />
      )}
      {particles.map((p) => (
        <img
          key={p.id}
          src={crystalShatterDustImage}
          alt=""
          aria-hidden="true"
          className="pf-card-pack-css__rarity-spark"
          style={
            {
              '--spark-size': `${p.size}px`,
              '--spark-end-x': `${p.endX}px`,
              '--spark-end-y': `${p.endY}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

/** Brief shimmer effect when a card lands in its fan position. */
export function CardLandShimmer({ position, delay }: { position: FanPosition; delay: number }) {
  return (
    <div
      className="pf-card-pack-css__land-shimmer"
      style={{ left: position.x, top: position.y, '--shimmer-delay': `${delay}s` } as CSSProperties}
    />
  )
}

/** Full-screen flash for epic/legendary card reveals. */
export function ScreenFlash({ rarity }: { rarity: CardRarity }) {
  if (rarity < 4) return null
  return (
    <div
      className={`pf-card-pack-css__screen-flash pf-card-pack-css__screen-flash--rarity-${rarity}`}
      style={{ '--flash-peak': rarity === 5 ? '0.4' : '0.22' } as CSSProperties}
    />
  )
}

/** Burst effect when all cards are collected. */
export function CollectBurst() {
  return <div className="pf-card-pack-css__collect-burst" />
}

/* ═══════════════════════════════════════════════════
   FLIP CARD — CSS-only: fan → flip → float → select → collect
   ═══════════════════════════════════════════════════ */

/** Single card in the fan — handles fan-in, flip, float, select, and collect states via CSS. */
export function FlipCard({
  card,
  position,
  flipped,
  fanDelay,
  collected,
  collectIndex,
  idle,
  fanDone,
  selected,
  anySelected,
  onSelect,
  ribbonColor,
}: {
  card: CardData
  position: FanPosition
  flipped: boolean
  fanDelay: number
  collected: boolean
  collectIndex: number
  idle: boolean
  fanDone: boolean
  selected: boolean
  anySelected: boolean
  onSelect: () => void
  ribbonColor?: string
}) {
  const canTap = idle && flipped && !collected
  const floatDelay = (collectIndex / 5) * 3.5

  let slotClass = 'pf-card-pack-css__card-slot'
  if (collected) {
    slotClass += ' pf-card-pack-css__card-slot--collected'
  } else if (selected) {
    slotClass += ' pf-card-pack-css__card-slot--selected'
  } else if (anySelected) {
    slotClass += ' pf-card-pack-css__card-slot--dimmed'
  } else if (idle && fanDone) {
    slotClass += ' pf-card-pack-css__card-slot--float'
  } else if (fanDone) {
    slotClass += ' pf-card-pack-css__card-slot--landed'
  }

  return (
    <div
      className={`${slotClass} pf-card-pack-css__card--rarity-${card.rarity}`}
      style={
        {
          '--card-x': `${position.x}px`,
          '--card-y': `${position.y}px`,
          '--card-rotate': `${position.rotate}deg`,
          '--fan-delay': `${fanDelay}s`,
          '--float-delay': `${floatDelay}s`,
          '--collect-delay': `${collectIndex * 0.08}s`,
          cursor: canTap && !anySelected ? 'pointer' : selected ? 'pointer' : undefined,
        } as CSSProperties
      }
      onClick={canTap ? onSelect : undefined}
    >
      <div className="pf-card-pack-css__card-perspective">
        <div
          className={`pf-card-pack-css__card-flipper${flipped ? ' pf-card-pack-css__card-flipper--flipped' : ''}`}
        >
          <div className="pf-card-pack-css__card-face pf-card-pack-css__card-back">
            <div className="pf-card-pack-css__card-frame">
              <img
                src={cardPackBackImage}
                alt=""
                aria-hidden="true"
                className="pf-card-pack-css__card-img"
              />
            </div>
          </div>
          <div className="pf-card-pack-css__card-face pf-card-pack-css__card-front">
            <CardStars card={card} />
            <CardFrame card={card} />
            <CardNameRibbon name={card.name} rarity={card.rarity} ribbonColor={ribbonColor} />
            {card.isNew && <NewBadge />}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Card fan container ─── */

/** Container that lays out cards in a fan with shimmer and rarity burst overlays. */
export function CardFanContainer({
  cards,
  positions,
  flipped,
  collected,
  isIdle,
  focusedCard,
  handleCardSelect,
  burstedCards,
  fanDone,
}: {
  cards: CardData[]
  positions: FanPosition[]
  flipped: boolean[]
  collected: boolean
  isIdle: boolean
  focusedCard: number | null
  handleCardSelect: (i: number) => void
  burstedCards: boolean[]
  fanDone: boolean[]
}) {
  return (
    <div className="pf-card-pack-css__cards-container">
      {cards.map((card, i) => (
        <FlipCard
          key={`${card.id}-${i}`}
          card={card}
          position={positions[i]!}
          flipped={flipped[i]!}
          fanDelay={i * 0.12}
          collected={collected}
          collectIndex={i}
          idle={isIdle}
          fanDone={fanDone[i]!}
          selected={focusedCard === i}
          anySelected={focusedCard !== null}
          onSelect={() => handleCardSelect(i)}
          ribbonColor={card.setId ? getCardSet(card.setId)?.ribbonColor : undefined}
        />
      ))}
      {cards.map((_, i) => (
        <CardLandShimmer key={`shimmer-${i}`} position={positions[i]!} delay={i * 0.12} />
      ))}
      {cards.map((card, i) =>
        burstedCards[i] ? (
          <RarityBurst key={`burst-${i}`} rarity={card.rarity} position={positions[i]!} />
        ) : null
      )}
    </div>
  )
}
