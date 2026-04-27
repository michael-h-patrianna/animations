import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DemoButton } from '@/components/demo-blocks'

import cardPackBackImage from '@/assets/card-pack/card-back.webp'
import cardPackBasicImage from '@/assets/card-pack/card-pack-basic.webp'
import cardPackDiamondImage from '@/assets/card-pack/card-pack-diamond.webp'
import cardPackGoldImage from '@/assets/card-pack/card-pack-gold.webp'
import crystalShatterDustImage from '@/assets/crystal-shatter/crystal-dust.webp'
import crystalShatterPrismaticRingImage from '@/assets/crystal-shatter/prismatic-ring.webp'
import crystalShatterSparkleImage from '@/assets/crystal-shatter/crystal-sparkle.webp'

import type {
  CardRarity,
  ConfettiData,
  FanPosition,
  PackPhase,
} from '@/components/rewards/prize-reveal/CardPackParts'
import { ALL_CARD_IMAGES, drawCards } from '@/components/rewards/prize-reveal/cardSets'

import {
  ArrivalDust,
  EdgeSparks,
  GoldenConfetti,
  LightSpill,
  PackTearOpen,
  SeamCracks,
  SeamLight,
  TearLineFlash,
  type ArrivalDustData,
  type EdgeSparkData,
  type TearDebrisData,
} from './CardPackOpenParts'
import { CardFanContainer, CollectBurst, ScreenFlash } from './CardPackOpenCardParts'

import styles from './PrizeRevealCardPackOpen.module.css'

/* ─── Pack types ─── */

const PACK_IMAGES = [cardPackBasicImage, cardPackGoldImage, cardPackDiamondImage] as const

function randomPackImage(): string {
  return PACK_IMAGES[Math.floor(Math.random() * PACK_IMAGES.length)]!
}

/* ─── Image preloading ─── */

const ALL_IMAGES = [
  cardPackBasicImage,
  cardPackGoldImage,
  cardPackDiamondImage,
  cardPackBackImage,
  ...ALL_CARD_IMAGES,
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
const CONFETTI_DELAY_MS = 200
const DEFAULT_CARD_COUNT = 5

const FAN_POSITIONS: FanPosition[] = [
  { x: -116, y: 20, rotate: -12 },
  { x: -58, y: 6, rotate: -6 },
  { x: 0, y: -8, rotate: 0 },
  { x: 58, y: 6, rotate: 6 },
  { x: 116, y: 20, rotate: 12 },
]

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

const ARRIVAL_DUST_COUNT = 5
function createArrivalDust(): ArrivalDustData[] {
  return Array.from({ length: ARRIVAL_DUST_COUNT }, (_, i) => {
    const angle = (150 + (i / (ARRIVAL_DUST_COUNT - 1)) * 240) * (Math.PI / 180)
    const dist = 20 + Math.random() * 30
    return {
      id: i,
      endX: Math.cos(angle) * dist,
      endY: Math.sin(angle) * Math.abs(Math.sin(angle)) * dist * 0.6,
      size: 3 + Math.random() * 3,
      delay: 0.55 + Math.random() * 0.06,
    }
  })
}

function createEdgeSparks(): EdgeSparkData[] {
  const packW = 72
  const seamY = -20
  return Array.from({ length: 4 }, (_, i) => {
    const side = i % 2 === 0 ? 1 : -1
    const startX = side * (packW * 0.3 + Math.random() * packW * 0.7)
    const startY = seamY + (Math.random() - 0.5) * 20
    return {
      id: i,
      startX,
      startY,
      endX: startX + side * (15 + Math.random() * 25),
      endY: startY - 10 - Math.random() * 30,
      size: 6 + Math.random() * 6,
      delay: 0.2 + i * 0.2,
    }
  })
}

const TEAR_DEBRIS_COUNT = 7
function createTearDebris(): TearDebrisData[] {
  return Array.from({ length: TEAR_DEBRIS_COUNT }, (_, i) => {
    const spread = (i / (TEAR_DEBRIS_COUNT - 1)) * 140 - 70
    const isSparkle = i % 3 === 0
    return {
      id: i,
      startX: spread + (Math.random() - 0.5) * 20,
      endX: spread * 1.4 + (Math.random() - 0.5) * 30,
      endY: -40 - Math.random() * 60,
      size: isSparkle ? 8 + Math.random() * 6 : 3 + Math.random() * 4,
      src: isSparkle ? crystalShatterSparkleImage : crystalShatterDustImage,
      rotation: (Math.random() - 0.5) * 180,
      delay: Math.random() * 0.1,
    }
  })
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
  const arrivalDust = useMemo(() => createArrivalDust(), [])
  const edgeSparks = useMemo(() => createEdgeSparks(), [])
  const tearDebris = useMemo(() => createTearDebris(), [])
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
  // when an unrelated re-render (e.g. burstedCards updating) replays the effect.
  // The ref is reset (in a commit-phase effect, not during render) whenever a
  // fresh pack is dealt so the next pack's high-rarity flips fire again instead
  // of being suppressed by stale indices.
  const [activeFlash, setActiveFlash] = useState<number | null>(null)
  const [flashKey, setFlashKey] = useState(0)
  const flashedRef = useRef<boolean[]>([])
  useEffect(() => {
    flashedRef.current = []
  }, [cards])
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

  const [fanDone, setFanDone] = useState<boolean[]>(() => Array(cards.length).fill(false))
  useEffect(() => {
    if (phase !== 'fan' && phase !== 'flip' && phase !== 'idle') return
    const timers = cards.map((_, i) =>
      setTimeout(
        () => {
          setFanDone((prev) => {
            const next = [...prev]
            next[i] = true
            return next
          })
        },
        i * 120 + 500
      )
    )
    return () => timers.forEach((id) => clearTimeout(id))
  }, [phase, cards])

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
    arrivalDust,
    edgeSparks,
    tearDebris,
    fanDone,
  }
}

/* ═══════════════════════════════════════════════════
   MAIN ANIMATION
   ═══════════════════════════════════════════════════ */

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
    arrivalDust,
    edgeSparks,
    tearDebris,
    fanDone,
  } = useCardPackState(cardCount)

  const showPack = phase === 'arrival' || phase === 'anticipation'
  const showAnticipation = phase === 'anticipation'
  const showBurst = phase === 'burst'
  const showCards = phase === 'fan' || phase === 'flip' || phase === 'idle'

  const stageClass = `${styles['pf-card-pack-css__stage']}${showBurst ? ` ${styles['pf-card-pack-css__stage--burst']}` : ''}`

  return (
    <div className={stageClass}>
      <ArrivalDust particles={arrivalDust} />

      {showPack && (
        <div className={styles['pf-card-pack-css__pack-body']}>
          <div
            className={`${styles['pf-card-pack-css__pack-shaker']}${showAnticipation ? ` ${styles['pf-card-pack-css__pack-shaker--shaking']}` : ''}`}
          >
            <img
              src={packImage}
              alt=""
              aria-hidden="true"
              className={styles['pf-card-pack-css__pack-image']}
            />
          </div>
        </div>
      )}

      {showAnticipation && <SeamLight />}
      {showAnticipation && <EdgeSparks sparks={edgeSparks} />}
      {showAnticipation && <SeamCracks />}

      {showBurst && <PackTearOpen packImage={packImage} debris={tearDebris} />}
      {showBurst && <TearLineFlash />}
      {showBurst && <LightSpill />}

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
          fanDone={fanDone}
        />
      )}

      {showConfetti && <GoldenConfetti confetti={confetti} />}

      {focusedCard !== null && (
        <div className={styles['pf-card-pack-css__inspect-overlay']} onClick={handleDismiss} />
      )}

      {activeFlash != null && <ScreenFlash key={flashKey} rarity={activeFlash as CardRarity} />}
      {collected && <CollectBurst />}

      {showCollect && !collected && (
        <DemoButton
          label="Collect All"
          className="pf-prize-reveal__action-btn"
          onClick={handleCollect}
        />
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   EXPORT
   ═══════════════════════════════════════════════════ */

function PrizeRevealCardPackOpenCssComponent({
  prizeCount = DEFAULT_CARD_COUNT,
}: {
  prizeCount?: number
}) {
  const ready = useImagePreloader(ALL_IMAGES)

  return (
    <div
      className={`pf-modal-celebration ${styles['pf-card-pack-css']}`}
      data-animation-id="prize-reveal__card-pack-open"
    >
      {ready && <CardPackAnimation cardCount={prizeCount} />}
    </div>
  )
}

export const PrizeRevealCardPackOpen = memo(PrizeRevealCardPackOpenCssComponent)
