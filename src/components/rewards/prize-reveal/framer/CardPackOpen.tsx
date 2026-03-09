import { AnimatePresence } from 'motion/react'
import { memo, useEffect, useMemo, useState } from 'react'

import {
  cardPackArcherImage,
  cardPackDragonImage,
  cardPackMageImage,
  cardPackPhoenixImage,
  cardPackWarriorImage,
} from '@/assets'

import {
  AmbientMotes,
  BurstFlash,
  BurstRing,
  CollectBurst,
  CollectButton,
  ConvergeMotes,
  FAN_POSITIONS,
  FlipCard,
  GoldenConfetti,
  LandingPulse,
  LightColumn,
  PackBody,
  PackTearOpen,
  RarityBurst,
  ScreenFlash,
  SeamLight,
  ShockwaveRing,
  type CardData,
  type ConfettiData,
  type ConvergeMoteData,
  type PackPhase,
} from '../CardPackParts'

/* ─── Constants ─── */

const ARRIVAL_MS = 0
const ANTICIPATION_MS = 1000
const BURST_MS = 2200
const FAN_MS = 3000
const FLIP_MS = 4500
const FLIP_INTERVAL_MS = 500

const CONVERGE_MOTE_COUNT = 14
const CONFETTI_COUNT = 22

const DEFAULT_CARD_COUNT = 5

/** Demo pack — one of each rarity, sorted common→legendary for escalating drama */
const CARD_PACK: CardData[] = [
  { id: 0, name: 'Iron Knight', rarity: 1, frontImage: cardPackWarriorImage },
  { id: 1, name: 'Sylvan Archer', rarity: 2, frontImage: cardPackArcherImage },
  { id: 2, name: 'Shadow Mage', rarity: 3, frontImage: cardPackMageImage },
  { id: 3, name: 'Golden Dragon', rarity: 4, frontImage: cardPackDragonImage },
  { id: 4, name: 'Astral Phoenix', rarity: 5, frontImage: cardPackPhoenixImage },
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
  const cards = useMemo(() => CARD_PACK.slice(0, cardCount), [cardCount])
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
    const idleMs = cards.length * FLIP_INTERVAL_MS + 800
    const t = window.setTimeout(() => setIsIdle(true), idleMs)
    return () => window.clearTimeout(t)
  }, [phase, cards.length])

  const [collected, setCollected] = useState(false)
  const [showCollect, setShowCollect] = useState(false)
  useEffect(() => {
    if (!isIdle) return
    const t = window.setTimeout(() => setShowCollect(true), 600)
    return () => window.clearTimeout(t)
  }, [isIdle])

  const handleCollect = () => setCollected(true)

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
    <div className="pf-card-pack__stage">
      <AmbientMotes />
      <LandingPulse />

      {/* Pack — visible during arrival + anticipation */}
      <PackBody phase={phase} />
      <SeamLight phase={phase} />

      {/* Energy convergence during anticipation */}
      {showAnticipation && <ConvergeMotes motes={convergeMotes} />}

      {/* Burst effects */}
      {showBurst && (
        <>
          <PackTearOpen />
          <BurstFlash />
          <BurstRing />
          <LightColumn />
          <ShockwaveRing />
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
            />
          ))}

          {/* Rarity bursts — fire once when each card flips */}
          {cards.map((card, i) =>
            burstedCards[i] ? (
              <RarityBurst key={`burst-${card.id}`} rarity={card.rarity} position={positions[i]} />
            ) : null
          )}

        </div>
      )}

      {/* Screen flash for epic/legendary */}
      {activeFlash != null && <ScreenFlash rarity={activeFlash as 4 | 5} />}

      {/* Collect */}
      {collected && <CollectBurst />}
      <AnimatePresence>
        {showCollect && !collected && <CollectButton onCollect={handleCollect} />}
      </AnimatePresence>
    </div>
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
