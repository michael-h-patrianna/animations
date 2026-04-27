import { AnimatePresence, MotionConfig } from 'motion/react'
import * as m from 'motion/react-m'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import styles from './PrizeRevealCardPackOpen.module.css'
import cardPackBackImage from '@/assets/card-pack/card-back.webp'
import cardPackBasicImage from '@/assets/card-pack/card-pack-basic.webp'
import cardPackDiamondImage from '@/assets/card-pack/card-pack-diamond.webp'
import cardPackGoldImage from '@/assets/card-pack/card-pack-gold.webp'
import crystalShatterDustImage from '@/assets/crystal-shatter/crystal-dust.webp'
import crystalShatterPrismaticRingImage from '@/assets/crystal-shatter/prismatic-ring.webp'
import crystalShatterSparkleImage from '@/assets/crystal-shatter/crystal-sparkle.webp'

import { DemoButton } from '@/components/demo-blocks'

import {
  ArrivalDust,
  CollectBurst,
  EdgeSparks,
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
} from '@/components/rewards/prize-reveal/CardPackParts'
import { CardLandShimmer, FlipCard } from '@/components/rewards/prize-reveal/FlipCardComponents'

import { ALL_CARD_IMAGES, drawCards, getCardSet } from '@/components/rewards/prize-reveal/cardSets'

/* ─── Pack types ─── */

const PACK_IMAGES = [cardPackBasicImage, cardPackGoldImage, cardPackDiamondImage] as const

function randomPackImage(): string {
  return PACK_IMAGES[Math.floor(Math.random() * PACK_IMAGES.length)]!
}

/* ─── Image preloading ─── */

const ALL_IMAGES = [
  // Pack variants
  cardPackBasicImage,
  cardPackGoldImage,
  cardPackDiamondImage,
  // Card back
  cardPackBackImage,
  // All card faces from all sets
  ...ALL_CARD_IMAGES,
  // Effect sprites
  crystalShatterDustImage,
  crystalShatterPrismaticRingImage,
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
          })
      )
    ).then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
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
    duration: 0.55 + Math.random() * 0.25,
    delay: Math.random() * 0.12,
  }))
}

/* ─── Hooks ─── */

function usePackPhase(): PackPhase {
  const [phase, setPhase] = useState<PackPhase>('arrival')
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('anticipation'), ANTICIPATION_MS),
      setTimeout(() => setPhase('burst'), BURST_MS),
      setTimeout(() => setPhase('fan'), FAN_MS),
      setTimeout(() => setPhase('flip'), FLIP_MS),
    ]
    return () => timers.forEach((id) => clearTimeout(id))
  }, [])
  return phase
}

function useFlipStates(phase: PackPhase, cardCount: number) {
  const [flipped, setFlipped] = useState<boolean[]>(() => Array(cardCount).fill(false))

  useEffect(() => {
    if (phase !== 'flip') return
    const timers = Array.from({ length: cardCount }, (_, i) =>
      setTimeout(() => {
        setFlipped((prev) => {
          const next = [...prev]
          next[i] = true
          return next
        })
      }, i * FLIP_INTERVAL_MS)
    )
    return () => timers.forEach((id) => clearTimeout(id))
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

  const [burstedCards, setBurstedCards] = useState<boolean[]>(() => Array(cards.length).fill(false))
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

  const handleCollect = useCallback(() => {
    setFocusedCard(null)
    setCollected(true)
  }, [])

  // Per-card "already flashed" memory keeps a high-rarity flip from re-firing
  // when downstream effects (burstedCards) re-render the host. Without the ref,
  // the activeFlash effect re-running cancelled its own clear-timeout and the
  // ScreenFlash CSS animation never restarted for cards 2..N.
  const [activeFlash, setActiveFlash] = useState<number | null>(null)
  const [flashKey, setFlashKey] = useState(0)
  const flashedRef = useRef<boolean[]>([])
  useEffect(() => {
    flipped.forEach((isFlipped, i) => {
      if (!isFlipped) return
      if (flashedRef.current[i] === true) return
      const card = cards[i]
      if (!card || card.rarity < 4) return
      flashedRef.current[i] = true
      setActiveFlash(card.rarity)
      setFlashKey((k) => k + 1)
    })
  }, [flipped, cards])

  const [showConfetti, setShowConfetti] = useState(false)
  useEffect(() => {
    if (phase !== 'fan') return
    const t = window.setTimeout(() => setShowConfetti(true), CONFETTI_DELAY_MS)
    return () => window.clearTimeout(t)
  }, [phase])

  return {
    packImage,
    cards,
    positions,
    phase,
    confetti,
    flipped,
    burstedCards,
    isIdle,
    focusedCard,
    handleCardSelect,
    handleDismiss,
    collected,
    showCollect,
    handleCollect,
    activeFlash,
    flashKey,
    showConfetti,
  }
}

/* ─── Card fan container ─── */

function CardFanContainer({
  cards,
  positions,
  flipped,
  collected,
  isIdle,
  focusedCard,
  handleCardSelect,
  burstedCards,
}: {
  cards: ReturnType<typeof drawCards>
  positions: FanPosition[]
  flipped: boolean[]
  collected: boolean
  isIdle: boolean
  focusedCard: number | null
  handleCardSelect: (i: number) => void
  burstedCards: boolean[]
}) {
  return (
    <div className={styles['pf-card-pack-fm__cards-container']}>
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
          bobPhase={(i / cards.length) * Math.PI * 1.2}
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

/* ─── Main animation ─── */

function CardPackAnimation({ cardCount }: { cardCount: number }) {
  const {
    packImage,
    cards,
    positions,
    phase,
    confetti,
    flipped,
    burstedCards,
    isIdle,
    focusedCard,
    handleCardSelect,
    handleDismiss,
    collected,
    showCollect,
    handleCollect,
    activeFlash,
    flashKey,
    showConfetti,
  } = useCardPackState(cardCount)

  const showAnticipation = phase === 'anticipation'
  const showBurst = phase === 'burst'
  const showCards = phase === 'fan' || phase === 'flip' || phase === 'idle'

  return (
    <m.div
      className={styles['pf-card-pack-fm__stage']}
      animate={showBurst ? { x: [0, -2, 2, -1, 1, 0], y: [0, 1, -1, 0] } : { x: 0, y: 0 }}
      transition={showBurst ? { duration: 0.2, ease: 'linear' } : { duration: 0 }}
    >
      <ArrivalDust />
      <PackBody phase={phase} packImage={packImage} />
      <SeamLight phase={phase} />
      {showAnticipation && (
        <>
          <EdgeSparks />
          <SeamCracks />
        </>
      )}
      {showBurst && (
        <>
          <PackTearOpen packImage={packImage} />
          <TearLineFlash />
          <LightSpill />
        </>
      )}
      {showCards && (
        <CardFanContainer
          cards={cards}
          positions={positions}
          flipped={flipped}
          collected={collected}
          isIdle={isIdle}
          focusedCard={focusedCard}
          handleCardSelect={handleCardSelect}
          burstedCards={burstedCards}
        />
      )}
      {showConfetti && <GoldenConfetti confetti={confetti} />}
      <AnimatePresence>
        {focusedCard !== null && (
          <m.div
            key="inspect-overlay"
            className={styles['pf-card-pack-fm__inspect-overlay']}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleDismiss}
          />
        )}
      </AnimatePresence>
      {activeFlash != null && <ScreenFlash key={flashKey} rarity={activeFlash as 4 | 5} />}
      {collected && <CollectBurst />}
      {showCollect && !collected && (
        <DemoButton
          label="Collect All"
          className="pf-prize-reveal__action-btn"
          onClick={handleCollect}
        />
      )}
    </m.div>
  )
}

function PrizeRevealCardPackOpenComponent({
  prizeCount = DEFAULT_CARD_COUNT,
}: {
  prizeCount?: number
}) {
  const ready = useImagePreloader(ALL_IMAGES)

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={`pf-modal-celebration ${styles['pf-card-pack-fm']}`}
        data-animation-id="prize-reveal__card-pack-open"
      >
        {ready && <CardPackAnimation cardCount={prizeCount} />}
      </div>
    </MotionConfig>
  )
}

export const PrizeRevealCardPackOpen = memo(PrizeRevealCardPackOpenComponent)
