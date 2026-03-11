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

import type { CardRarity, ConfettiData, FanPosition, PackPhase } from '../CardPackParts'
import { ALL_CARD_IMAGES, drawCards } from '../cardSets'

import {
  ArrivalDust,
  CardFanContainer,
  CollectBurst,
  EdgeSparks,
  GoldenConfetti,
  LightSpill,
  PackTearOpen,
  ScreenFlash,
  SeamCracks,
  SeamLight,
  TearLineFlash,
  type ArrivalDustData,
  type EdgeSparkData,
  type TearDebrisData,
} from './CardPackOpenParts'

import './CardPackOpen.css'

/* ─── Pack types ─── */

const PACK_IMAGES = [cardPackBasicImage, cardPackGoldImage, cardPackDiamondImage] as const

function randomPackImage(): string {
  return PACK_IMAGES[Math.floor(Math.random() * PACK_IMAGES.length)]
}

/* ─── Image preloading ─── */

const ALL_IMAGES = [
  cardPackBasicImage, cardPackGoldImage, cardPackDiamondImage,
  cardPackBackImage,
  ...ALL_CARD_IMAGES,
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
    2: [{ x: -58, y: 6, rotate: -6 }, { x: 58, y: 6, rotate: 6 }],
    3: [{ x: -72, y: 12, rotate: -8 }, { x: 0, y: -8, rotate: 0 }, { x: 72, y: 12, rotate: 8 }],
    4: [{ x: -90, y: 16, rotate: -10 }, { x: -30, y: 2, rotate: -3 }, { x: 30, y: 2, rotate: 3 }, { x: 90, y: 16, rotate: 10 }],
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
      id: i, startX, startY,
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
        setFlipped((prev) => { const next = [...prev]; next[i] = true; return next })
      }, i * FLIP_INTERVAL_MS),
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
  const arrivalDust = useMemo(() => createArrivalDust(), [])
  const edgeSparks = useMemo(() => createEdgeSparks(), [])
  const tearDebris = useMemo(() => createTearDebris(), [])
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

  const [fanDone, setFanDone] = useState<boolean[]>(Array(cards.length).fill(false))
  useEffect(() => {
    if (phase !== 'fan' && phase !== 'flip' && phase !== 'idle') return
    const timers = cards.map((_, i) =>
      window.setTimeout(() => {
        setFanDone((prev) => { const next = [...prev]; next[i] = true; return next })
      }, i * 120 + 500),
    )
    return () => timers.forEach(window.clearTimeout)
  }, [phase, cards])

  return {
    packImage, cards, positions, phase, confetti, flipped, burstedCards,
    isIdle, focusedCard, handleCardSelect, handleDismiss,
    collected, showCollect, handleCollect, activeFlash, showConfetti,
    arrivalDust, edgeSparks, tearDebris, fanDone,
  }
}

/* ═══════════════════════════════════════════════════
   MAIN ANIMATION
   ═══════════════════════════════════════════════════ */

function CardPackAnimation({ cardCount }: { cardCount: number }) {
  const {
    packImage, cards, positions, phase, confetti, flipped, burstedCards,
    isIdle, focusedCard, handleCardSelect, handleDismiss,
    collected, showCollect, handleCollect, activeFlash, showConfetti,
    arrivalDust, edgeSparks, tearDebris, fanDone,
  } = useCardPackState(cardCount)

  const showPack = phase === 'arrival' || phase === 'anticipation'
  const showAnticipation = phase === 'anticipation'
  const showBurst = phase === 'burst'
  const showCards = phase === 'fan' || phase === 'flip' || phase === 'idle'

  const stageClass = `pf-card-pack-css__stage${showBurst ? ' pf-card-pack-css__stage--burst' : ''}`

  return (
    <div className={stageClass}>
      <ArrivalDust particles={arrivalDust} />

      {showPack && (
        <div className="pf-card-pack-css__pack-body">
          <div className={`pf-card-pack-css__pack-shaker${showAnticipation ? ' pf-card-pack-css__pack-shaker--shaking' : ''}`}>
            <img src={packImage} alt="" aria-hidden="true" className="pf-card-pack-css__pack-image" />
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
          cards={cards} positions={positions} flipped={flipped}
          collected={collected} isIdle={isIdle} focusedCard={focusedCard}
          handleCardSelect={handleCardSelect} burstedCards={burstedCards} fanDone={fanDone}
        />
      )}

      {showConfetti && <GoldenConfetti confetti={confetti} />}

      {focusedCard !== null && (
        <div className="pf-card-pack-css__inspect-overlay" onClick={handleDismiss} />
      )}

      {activeFlash != null && <ScreenFlash rarity={activeFlash as CardRarity} />}
      {collected && <CollectBurst />}

      {showCollect && !collected && (
        <button className="pf-card-pack-css__collect-btn" type="button" onClick={handleCollect}>
          COLLECT ALL
        </button>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   EXPORT
   ═══════════════════════════════════════════════════ */

function CardPackOpenCssComponent({ prizeCount = DEFAULT_CARD_COUNT }: { prizeCount?: number }) {
  const ready = useImagePreloader(ALL_IMAGES)

  return (
    <div className="pf-modal-celebration pf-card-pack-css" data-animation-id="prize-reveal__card-pack-open-css">
      {ready && <CardPackAnimation cardCount={prizeCount} />}
    </div>
  )
}

export const CardPackOpen = memo(CardPackOpenCssComponent)
