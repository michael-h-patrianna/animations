import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'

import {
  cardPackBasicImage,
  cardPackDiamondImage,
  cardPackDragonPetImage,
  cardPackGoldImage,
  cardPackHamsterImage,
  cardPackKittenImage,
  cardPackPuppyImage,
  cardPackUnicornImage,
} from '@/assets'

import {
  AmbientMotes,
  ArrivalDust,
  BurstFlash,
  BurstRing,
  CardLandShimmer,
  CollectBurst,
  CollectButton,
  ConvergeMotes,
  EdgeSparks,
  EnergyRings,
  FAN_POSITIONS,
  FlipCard,
  GoldenConfetti,
  LandingPulse,
  LightColumn,
  PackBody,
  PackTearOpen,
  RadialRays,
  RarityBurst,
  ScreenFlash,
  SeamCracks,
  SeamLight,
  ShockwaveRing,
  type CardData,
  type ConfettiData,
  type ConvergeMoteData,
  type FanPosition,
  type PackPhase,
} from '../CardPackParts'

/* ─── Pack types ─── */

const PACK_IMAGES = [cardPackBasicImage, cardPackGoldImage, cardPackDiamondImage] as const

function randomPackImage(): string {
  return PACK_IMAGES[Math.floor(Math.random() * PACK_IMAGES.length)]
}

/* ─── Constants ─── */

const ANTICIPATION_MS = 800
const BURST_MS = 1800
const FAN_MS = 2400
const FLIP_MS = 3200
const FLIP_INTERVAL_MS = 300

const CONVERGE_MOTE_COUNT = 14
const CONFETTI_COUNT = 22

const DEFAULT_CARD_COUNT = 5

/** Demo pack — one of each rarity, sorted common→legendary for escalating drama */
const CARD_PACK: CardData[] = [
  { id: 0, name: 'Nibbles', rarity: 1, frontImage: cardPackHamsterImage },
  { id: 1, name: 'Whiskers', rarity: 2, frontImage: cardPackKittenImage },
  { id: 2, name: 'Biscuit', rarity: 3, frontImage: cardPackPuppyImage },
  { id: 3, name: 'Ember', rarity: 4, frontImage: cardPackDragonPetImage },
  { id: 4, name: 'Stardust', rarity: 5, frontImage: cardPackUnicornImage },
]

/** Fan layouts keyed by card count — hand-tuned for visual balance */
function getFanPositions(count: number): FanPosition[] {
  const layouts: Record<number, FanPosition[]> = {
    1: [{ x: 0, y: -8, rotate: 0 }],
    2: [
      { x: -58, y: 6, rotate: -6 },
      { x: 58, y: 6, rotate: 6 },
    ],
    3: [
      { x: -72, y: 12, rotate: -8 },
      { x: 0, y: -8, rotate: 0 },
      { x: 72, y: 12, rotate: 8 },
    ],
    4: [
      { x: -90, y: 16, rotate: -10 },
      { x: -30, y: 2, rotate: -3 },
      { x: 30, y: 2, rotate: 3 },
      { x: 90, y: 16, rotate: 10 },
    ],
    5: FAN_POSITIONS,
  }
  return layouts[count] ?? FAN_POSITIONS
}

/* ─── Data generators ─── */

function createConvergeMotes(): ConvergeMoteData[] {
  return Array.from({ length: CONVERGE_MOTE_COUNT }, (_, i) => {
    const angle = (i / CONVERGE_MOTE_COUNT) * Math.PI * 2
    const distance = 140 + Math.random() * 60
    const startX = Math.cos(angle) * distance
    const startY = Math.sin(angle) * distance
    const perpAngle = angle + Math.PI / 2
    const offset = (Math.random() - 0.5) * 50
    return {
      id: i,
      startX,
      startY,
      midX: Math.cos(angle) * distance * 0.4 + Math.cos(perpAngle) * offset,
      midY: Math.sin(angle) * distance * 0.4 + Math.sin(perpAngle) * offset,
      size: 6 + Math.random() * 6,
      delay: (i / CONVERGE_MOTE_COUNT) * 0.6,
    }
  })
}

function createConfetti(): ConfettiData[] {
  return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    id: i,
    angle: Math.random() * Math.PI * 2,
    distance: 60 + Math.random() * 120,
    rotation: (Math.random() > 0.5 ? 1 : -1) * (90 + Math.random() * 270),
    size: 3 + Math.random() * 5,
  }))
}

/* ─── Hooks ─── */

function usePackPhase(): PackPhase {
  const [phase, setPhase] = useState<PackPhase>('arrival')
  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPhase('anticipation'), ANTICIPATION_MS),
      window.setTimeout(() => setPhase('burst'), BURST_MS),
      window.setTimeout(() => setPhase('fan'), FAN_MS),
      window.setTimeout(() => setPhase('flip'), FLIP_MS),
    ]
    return () => timers.forEach(window.clearTimeout)
  }, [])
  return phase
}

function useFlipStates(phase: PackPhase, cardCount: number) {
  const [flipped, setFlipped] = useState<boolean[]>(Array(cardCount).fill(false))

  useEffect(() => {
    if (phase !== 'flip') return
    const timers = Array.from({ length: cardCount }, (_, i) =>
      window.setTimeout(() => {
        setFlipped((prev) => {
          const next = [...prev]
          next[i] = true
          return next
        })
      }, i * FLIP_INTERVAL_MS)
    )
    return () => timers.forEach(window.clearTimeout)
  }, [phase, cardCount])

  return flipped
}

/* ─── Main animation ─── */

function CardPackAnimation({ cardCount }: { cardCount: number }) {
  const packImage = useMemo(() => randomPackImage(), [])
  const cards = useMemo(() => {
    const pack = CARD_PACK.slice(0, cardCount)
    const newIndex = Math.floor(Math.random() * pack.length)
    return pack.map((card, i) => (i === newIndex ? { ...card, isNew: true } : card))
  }, [cardCount])
  const positions = useMemo(() => getFanPositions(cardCount), [cardCount])

  const phase = usePackPhase()
  const convergeMotes = useMemo(() => createConvergeMotes(), [])
  const confetti = useMemo(() => createConfetti(), [])
  const flipped = useFlipStates(phase, cards.length)

  const showAnticipation = phase === 'anticipation'
  const showBurst = phase === 'burst'
  const showCards = phase === 'fan' || phase === 'flip' || phase === 'idle'

  // Track which rarity bursts have fired
  const [burstedCards, setBurstedCards] = useState<boolean[]>(Array(cards.length).fill(false))
  useEffect(() => {
    flipped.forEach((isFlipped, i) => {
      if (isFlipped && !burstedCards[i]) {
        setBurstedCards((prev) => {
          const next = [...prev]
          next[i] = true
          return next
        })
      }
    })
  }, [flipped, burstedCards])

  // Idle phase — after all cards flipped
  const [isIdle, setIsIdle] = useState(false)
  useEffect(() => {
    if (phase !== 'flip') return
    const idleMs = cards.length * FLIP_INTERVAL_MS + 400
    const t = window.setTimeout(() => setIsIdle(true), idleMs)
    return () => window.clearTimeout(t)
  }, [phase, cards.length])

  // Card inspect — tap a revealed card to enlarge it center-stage
  const [focusedCard, setFocusedCard] = useState<number | null>(null)
  const handleCardSelect = useCallback((index: number) => {
    setFocusedCard((prev) => (prev === index ? null : index))
  }, [])
  const handleDismiss = useCallback(() => setFocusedCard(null), [])

  const [collected, setCollected] = useState(false)
  const [showCollect, setShowCollect] = useState(false)
  useEffect(() => {
    if (!isIdle) return
    const t = window.setTimeout(() => setShowCollect(true), 600)
    return () => window.clearTimeout(t)
  }, [isIdle])

  const handleCollect = () => { setFocusedCard(null); setCollected(true) }

  // Screen flash tracking — fires once per epic/legendary flip
  const [activeFlash, setActiveFlash] = useState<number | null>(null)
  useEffect(() => {
    flipped.forEach((isFlipped, i) => {
      if (isFlipped && !burstedCards[i] && cards[i].rarity >= 4) {
        setActiveFlash(cards[i].rarity)
        const t = window.setTimeout(() => setActiveFlash(null), 400)
        return () => window.clearTimeout(t)
      }
    })
  }, [flipped, burstedCards, cards])

  return (
    <m.div
      className="pf-card-pack__stage"
      animate={
        showBurst
          ? { x: [0, -3, 3, -2, 2, -1, 0], y: [0, 2, -2, 1, -1, 0] }
          : { x: 0, y: 0 }
      }
      transition={showBurst ? { duration: 0.25, ease: 'linear' } : { duration: 0 }}
    >
      <AmbientMotes />
      <LandingPulse />
      <ArrivalDust />

      {/* Pack — visible during arrival + anticipation */}
      <PackBody phase={phase} packImage={packImage} />
      <SeamLight phase={phase} />

      {/* Anticipation effects — energy build-up */}
      {showAnticipation && (
        <>
          <ConvergeMotes motes={convergeMotes} />
          <EnergyRings />
          <EdgeSparks />
          <SeamCracks />
        </>
      )}

      {/* Burst effects */}
      {showBurst && (
        <>
          <PackTearOpen packImage={packImage} />
          <BurstFlash />
          <BurstRing />
          <RadialRays />
          <LightColumn />
          <ShockwaveRing />
          {/* Secondary shockwave — delayed, larger, softer */}
          <m.div
            className="pf-card-pack__shockwave"
            style={{ borderWidth: '2px', opacity: 0.5 }}
            initial={{ scale: 0.5, opacity: 0.5 }}
            animate={{ scale: 5.5, opacity: 0 }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 0.84, 0.32, 1] as const }}
          />
          <GoldenConfetti confetti={confetti} />
        </>
      )}

      {/* Cards */}
      {showCards && (
        <div className="pf-card-pack__cards-container">
          {cards.map((card, i) => (
            <FlipCard
              key={card.id}
              card={card}
              position={positions[i]}
              flipped={flipped[i]}
              fanDelay={i * 0.12}
              collected={collected}
              collectIndex={i}
              idle={isIdle}
              bobPhase={(i / cards.length) * Math.PI * 1.2}
              selected={focusedCard === i}
              anySelected={focusedCard !== null}
              onSelect={() => handleCardSelect(i)}
            />
          ))}

          {/* Landing shimmers — secondary action as cards arrive */}
          {cards.map((card, i) => (
            <CardLandShimmer key={`shimmer-${card.id}`} position={positions[i]} delay={i * 0.12} />
          ))}

          {/* Rarity bursts — fire once when each card flips */}
          {cards.map((card, i) =>
            burstedCards[i] ? (
              <RarityBurst key={`burst-${card.id}`} rarity={card.rarity} position={positions[i]} />
            ) : null
          )}

        </div>
      )}

      {/* Inspect overlay — desaturated backdrop when a card is focused */}
      <AnimatePresence>
        {focusedCard !== null && (
          <m.div
            key="inspect-overlay"
            className="pf-card-pack__inspect-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleDismiss}
          />
        )}
      </AnimatePresence>

      {/* Screen flash for epic/legendary */}
      {activeFlash != null && <ScreenFlash rarity={activeFlash as 4 | 5} />}

      {/* Collect */}
      {collected && <CollectBurst />}
      <AnimatePresence>
        {showCollect && !collected && <CollectButton onCollect={handleCollect} />}
      </AnimatePresence>
    </m.div>
  )
}

function CardPackOpenComponent({ prizeCount = DEFAULT_CARD_COUNT }: { prizeCount?: number }) {
  return (
    <div className="pf-modal-celebration pf-card-pack" data-animation-id="prize-reveal__card-pack-open">
      <CardPackAnimation cardCount={prizeCount} />
    </div>
  )
}

export const CardPackOpen = memo(CardPackOpenComponent)
