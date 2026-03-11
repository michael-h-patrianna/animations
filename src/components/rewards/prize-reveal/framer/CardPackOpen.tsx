import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'

import {
  cardPackBackImage,
  cardPackBasicImage,
  cardPackDiamondImage,
  cardPackGoldImage,
  crystalShatterDustImage,
  crystalShatterPrismaticRingImage,
  crystalShatterSparkleImage,
} from '@/assets'

import {
  ArrivalDust,
  CardLandShimmer,
  CollectBurst,
  CollectButton,
  EdgeSparks,
  FlipCard,
  GoldenConfetti,
  LightSpill,
  PackBody,
  PackTearOpen,
  RarityBurst,
  ScreenFlash,
  SeamCracks,
  SeamLight,
  TearLineFlash,
  type ConfettiData,
  type FanPosition,
  type PackPhase,
} from '../CardPackParts'

import { ALL_CARD_IMAGES, drawCards, getCardSet } from '../cardSets'

/* ─── Pack types ─── */

const PACK_IMAGES = [cardPackBasicImage, cardPackGoldImage, cardPackDiamondImage] as const

function randomPackImage(): string {
  return PACK_IMAGES[Math.floor(Math.random() * PACK_IMAGES.length)]
}

/* ─── Image preloading ─── */

const ALL_IMAGES = [
  // Pack variants
  cardPackBasicImage, cardPackGoldImage, cardPackDiamondImage,
  // Card back
  cardPackBackImage,
  // All card faces from all sets
  ...ALL_CARD_IMAGES,
  // Effect sprites
  crystalShatterDustImage, crystalShatterPrismaticRingImage,
  crystalShatterSparkleImage,
]

function useImagePreloader(srcs: string[]): boolean {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let cancelled = false
    Promise.all(
      srcs.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image()
            img.onload = () => resolve()
            img.onerror = () => resolve()
            img.src = src
          }),
      ),
    ).then(() => {
      if (!cancelled) setReady(true)
    })
    return () => { cancelled = true }
  }, [srcs])
  return ready
}

/* ─── Constants ─── */

const ANTICIPATION_MS = 700
const BURST_MS = 1700
const FAN_MS = 2200
const FLIP_MS = 3000
const FLIP_INTERVAL_MS = 300

const CONFETTI_COUNT = 16
const CONFETTI_DELAY_MS = 200 // delay after fan phase starts

const DEFAULT_CARD_COUNT = 5

/** Default 5-card fan layout — the most common configuration */
const FAN_POSITIONS: FanPosition[] = [
  { x: -116, y: 20, rotate: -12 },
  { x: -58, y: 6, rotate: -6 },
  { x: 0, y: -8, rotate: 0 },
  { x: 58, y: 6, rotate: 6 },
  { x: 116, y: 20, rotate: 12 },
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

/* ─── Card pack game state ─── */

function useCardPackState(cardCount: number) {
  const packImage = useMemo(() => randomPackImage(), [])
  const cards = useMemo(() => drawCards(cardCount), [cardCount])
  const positions = useMemo(() => getFanPositions(cardCount), [cardCount])
  const phase = usePackPhase()
  const confetti = useMemo(() => createConfetti(), [])
  const flipped = useFlipStates(phase, cards.length)

  const [burstedCards, setBurstedCards] = useState<boolean[]>(Array(cards.length).fill(false))
  useEffect(() => {
    flipped.forEach((isFlipped, i) => {
      if (isFlipped && !burstedCards[i]) {
        setBurstedCards((prev) => { const next = [...prev]; next[i] = true; return next })
      }
    })
  }, [flipped, burstedCards])

  const [isIdle, setIsIdle] = useState(false)
  useEffect(() => {
    if (phase !== 'flip') return
    const t = window.setTimeout(() => setIsIdle(true), cards.length * FLIP_INTERVAL_MS + 400)
    return () => window.clearTimeout(t)
  }, [phase, cards.length])

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

  const handleCollect = useCallback(() => { setFocusedCard(null); setCollected(true) }, [])

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

  const [showConfetti, setShowConfetti] = useState(false)
  useEffect(() => {
    if (phase !== 'fan') return
    const t = window.setTimeout(() => setShowConfetti(true), CONFETTI_DELAY_MS)
    return () => window.clearTimeout(t)
  }, [phase])

  return {
    packImage, cards, positions, phase, confetti, flipped, burstedCards,
    isIdle, focusedCard, handleCardSelect, handleDismiss,
    collected, showCollect, handleCollect, activeFlash, showConfetti,
  }
}

/* ─── Card fan container ─── */

function CardFanContainer({ cards, positions, flipped, collected, isIdle, focusedCard, handleCardSelect, burstedCards }: {
  cards: ReturnType<typeof drawCards>; positions: FanPosition[]; flipped: boolean[]
  collected: boolean; isIdle: boolean; focusedCard: number | null
  handleCardSelect: (i: number) => void; burstedCards: boolean[]
}) {
  return (
    <div className="pf-card-pack__cards-container">
      {cards.map((card, i) => (
        <FlipCard
          key={`${card.id}-${i}`}
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
          ribbonColor={card.setId ? getCardSet(card.setId)?.ribbonColor : undefined}
        />
      ))}
      {cards.map((_, i) => (
        <CardLandShimmer key={`shimmer-${i}`} position={positions[i]} delay={i * 0.12} />
      ))}
      {cards.map((card, i) =>
        burstedCards[i] ? <RarityBurst key={`burst-${i}`} rarity={card.rarity} position={positions[i]} /> : null
      )}
    </div>
  )
}

/* ─── Main animation ─── */

function CardPackAnimation({ cardCount }: { cardCount: number }) {
  const {
    packImage, cards, positions, phase, confetti, flipped, burstedCards,
    isIdle, focusedCard, handleCardSelect, handleDismiss,
    collected, showCollect, handleCollect, activeFlash, showConfetti,
  } = useCardPackState(cardCount)

  const showAnticipation = phase === 'anticipation'
  const showBurst = phase === 'burst'
  const showCards = phase === 'fan' || phase === 'flip' || phase === 'idle'

  return (
    <m.div
      className="pf-card-pack__stage"
      animate={showBurst ? { x: [0, -2, 2, -1, 1, 0], y: [0, 1, -1, 0] } : { x: 0, y: 0 }}
      transition={showBurst ? { duration: 0.2, ease: 'linear' } : { duration: 0 }}
    >
      <ArrivalDust />
      <PackBody phase={phase} packImage={packImage} />
      <SeamLight phase={phase} />
      {showAnticipation && <><EdgeSparks /><SeamCracks /></>}
      {showBurst && <><PackTearOpen packImage={packImage} /><TearLineFlash /><LightSpill /></>}
      {showCards && (
        <CardFanContainer cards={cards} positions={positions} flipped={flipped}
          collected={collected} isIdle={isIdle} focusedCard={focusedCard}
          handleCardSelect={handleCardSelect} burstedCards={burstedCards} />
      )}
      {showConfetti && <GoldenConfetti confetti={confetti} />}
      <AnimatePresence>
        {focusedCard !== null && (
          <m.div key="inspect-overlay" className="pf-card-pack__inspect-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }} onClick={handleDismiss} />
        )}
      </AnimatePresence>
      {activeFlash != null && <ScreenFlash rarity={activeFlash as 4 | 5} />}
      {collected && <CollectBurst />}
      <AnimatePresence>
        {showCollect && !collected && <CollectButton onCollect={handleCollect} />}
      </AnimatePresence>
    </m.div>
  )
}

function CardPackOpenComponent({ prizeCount = DEFAULT_CARD_COUNT }: { prizeCount?: number }) {
  const ready = useImagePreloader(ALL_IMAGES)

  return (
    <div className="pf-modal-celebration pf-card-pack" data-animation-id="prize-reveal__card-pack-open">
      {ready && <CardPackAnimation cardCount={prizeCount} />}
    </div>
  )
}

export const CardPackOpen = memo(CardPackOpenComponent)
