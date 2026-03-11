import { memo, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

import {
  arcanePortalFreeSpinsImage,
  arcanePortalGcImage,
  arcanePortalRandomRewardImage,
  arcanePortalScImage,
  crystalShatterBodyImage,
  crystalShatterDustImage,
  crystalShatterEnergyMoteImage,
  crystalShatterFrameImage,
  crystalShatterPrismaticRingImage,
  crystalShatterShard1Image,
  crystalShatterShard2Image,
  crystalShatterShard3Image,
  crystalShatterShard4Image,
  crystalShatterSparkleImage,
} from '@/assets'

import '../shared.css'
import './PrizeRevealCrystalShatter.css'

/* ─── Types ─── */

type PrizeConfig = { id: string; label: string | null; src: string; value: number | null; decimals: number; modifier: string }
type PrizeSlot = { x: number; y: number; delay: number }

/* ─── Constants ─── */

const SHARD_IMAGES = [crystalShatterShard1Image, crystalShatterShard2Image, crystalShatterShard3Image, crystalShatterShard4Image]
const DEFAULT_PRIZE_COUNT = 3
const FRAGMENT_COUNT = 9
const CONVERGE_MOTE_COUNT = 14
const DUST_SPRAY_COUNT = 24
const REVEAL_START_S = 3.2
const CLAIM_APPEAR_MS = 5200 + 800

const PRIZE_POOL: PrizeConfig[] = [
  { id: 'gc', label: 'GC', src: arcanePortalGcImage, value: 1500, decimals: 0, modifier: 'pf-cs-css__prize--gc' },
  { id: 'sc', label: 'SC', src: arcanePortalScImage, value: 2.5, decimals: 2, modifier: 'pf-cs-css__prize--sc' },
  { id: 'fs', label: 'FS', src: arcanePortalFreeSpinsImage, value: 50, decimals: 0, modifier: 'pf-cs-css__prize--fs' },
  { id: 'rr', label: null, src: arcanePortalRandomRewardImage, value: null, decimals: 0, modifier: 'pf-cs-css__prize--rr' },
]

function getPrizeSlots(count: number): PrizeSlot[] {
  const layouts: Record<number, PrizeSlot[]> = {
    1: [{ x: 0, y: -10, delay: 0 }],
    2: [{ x: -80, y: -10, delay: 0 }, { x: 80, y: -10, delay: 0.15 }],
    3: [{ x: -120, y: -10, delay: 0 }, { x: 0, y: -10, delay: 0.15 }, { x: 120, y: -10, delay: 0.3 }],
    4: [{ x: -140, y: -10, delay: 0 }, { x: -47, y: -10, delay: 0.15 }, { x: 47, y: -10, delay: 0.3 }, { x: 140, y: -10, delay: 0.45 }],
  }
  return layouts[count] ?? layouts[DEFAULT_PRIZE_COUNT]
}

/* ─── Count-up hook ─── */

function useCountUp(target: number, durationMs: number, delayMs: number, decimals: number) {
  const [display, setDisplay] = useState(decimals > 0 ? '0.00' : '0')
  const rafRef = useRef(0)
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const start = performance.now()
      const tick = () => {
        const elapsed = performance.now() - start
        const t = Math.min(elapsed / durationMs, 1)
        const eased = 1 - (1 - t) ** 3
        const current = target * eased
        if (t < 1) {
          setDisplay(decimals > 0 ? current.toFixed(decimals) : Math.round(current).toLocaleString())
          rafRef.current = requestAnimationFrame(tick)
        } else {
          setDisplay(decimals > 0 ? target.toFixed(decimals) : target.toLocaleString())
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }, delayMs)
    return () => { window.clearTimeout(timeout); cancelAnimationFrame(rafRef.current) }
  }, [target, durationMs, delayMs, decimals])
  return display
}

/* ─── Data generators (same logic as framer, deterministic per mount) ─── */

function useFragments() {
  return useMemo(() => Array.from({ length: FRAGMENT_COUNT }, (_, i) => {
    const baseAngle = (i / FRAGMENT_COUNT) * Math.PI * 2
    const angle = baseAngle + (Math.random() - 0.5) * 0.5
    return {
      id: i,
      angle,
      endX: Math.cos(angle) * (150 + Math.random() * 100),
      endY: Math.sin(angle) * (150 + Math.random() * 100),
      rotation: (Math.random() > 0.5 ? 1 : -1) * (60 + Math.random() * 180),
      shardIndex: i % 4,
    }
  }), [])
}

function useConvergeMotes() {
  return useMemo(() => Array.from({ length: CONVERGE_MOTE_COUNT }, (_, i) => {
    const angle = (i / CONVERGE_MOTE_COUNT) * Math.PI * 2
    const distance = 200 + Math.random() * 80
    return {
      id: i,
      startX: Math.cos(angle) * distance,
      startY: Math.sin(angle) * distance,
      size: 10 + Math.random() * 14,
      delay: (i / CONVERGE_MOTE_COUNT) * 0.6,
    }
  }), [])
}

function useDustSpray() {
  return useMemo(() => Array.from({ length: DUST_SPRAY_COUNT }, (_, i) => {
    const angle = Math.random() * Math.PI * 2
    const distance = 80 + Math.random() * 160
    return {
      id: i,
      endX: Math.cos(angle) * distance,
      endY: Math.sin(angle) * distance,
      size: 3 + Math.random() * 5,
    }
  }), [])
}

/* ─── CSS Prize component ─── */

function CssPrize({ config, slot, claimed, claimIndex }: { config: PrizeConfig; slot: PrizeSlot; claimed: boolean; claimIndex: number }) {
  const amount = useCountUp(config.value ?? 0, 500, (REVEAL_START_S + slot.delay + 0.6) * 1000, config.decimals)
  const hasText = config.label != null && config.value != null

  return (
    <div
      className={`pf-cs-css__prize ${config.modifier} ${claimed ? 'pf-cs-css__prize--claimed' : ''}`}
      style={{
        '--slot-x': `${slot.x}px`,
        '--slot-y': `${slot.y}px`,
        '--slot-delay': `${REVEAL_START_S + slot.delay}s`,
        '--claim-delay': `${claimIndex * 0.08}s`,
        '--streak-x': `${slot.x * 0.5}px`,
      } as CSSProperties}
    >
      <div className="pf-cs-css__prize-aura" />
      <div className="pf-cs-css__prize-icon-wrap">
        <img src={crystalShatterFrameImage} alt="" aria-hidden="true" className="pf-cs-css__frame-image" style={{ '--frame-delay': `${REVEAL_START_S + slot.delay + 0.5}s` } as CSSProperties} />
        <img src={config.src} alt="" aria-hidden="true" className="pf-cs-css__prize-icon" />
      </div>
      {hasText && (
        <div className="pf-cs-css__prize-text">
          <span className="pf-cs-css__prize-label">{config.label}</span>
          <span className="pf-cs-css__prize-amount">{amount}</span>
        </div>
      )}
    </div>
  )
}

/* ─── Main CSS component ─── */

function ShatterEffects({ fragments, convergeMotes, dustSpray }: {
  fragments: ReturnType<typeof useFragments>
  convergeMotes: ReturnType<typeof useConvergeMotes>
  dustSpray: ReturnType<typeof useDustSpray>
}) {
  return (
    <>
      <div className="pf-cs-css__crystal-wrap">
        <img src={crystalShatterBodyImage} alt="" aria-hidden="true" className="pf-cs-css__crystal-image" />
        <div className="pf-cs-css__crystal-glow" />
      </div>

      <div className="pf-cs-css__motes-container">
        {convergeMotes.map((mote) => (
          <img
            key={mote.id}
            src={crystalShatterEnergyMoteImage}
            alt=""
            aria-hidden="true"
            className="pf-cs-css__energy-mote"
            style={{
              '--mote-start-x': `${mote.startX}px`,
              '--mote-start-y': `${mote.startY}px`,
              '--mote-size': `${mote.size}px`,
              '--mote-delay': `${1.2 + mote.delay}s`,
            } as CSSProperties}
          />
        ))}
      </div>

      <img src={crystalShatterSparkleImage} alt="" aria-hidden="true" className="pf-cs-css__flash" />
      <img src={crystalShatterPrismaticRingImage} alt="" aria-hidden="true" className="pf-cs-css__prismatic-ring" />

      <div className="pf-cs-css__fragments">
        {fragments.map((f) => (
          <img
            key={f.id}
            src={SHARD_IMAGES[f.shardIndex]}
            alt=""
            aria-hidden="true"
            className="pf-cs-css__shard"
            style={{
              '--shard-end-x': `${f.endX}px`,
              '--shard-end-y': `${f.endY}px`,
              '--shard-rotation': `${f.rotation}deg`,
            } as CSSProperties}
          />
        ))}
      </div>

      <div className="pf-cs-css__dust-spray">
        {dustSpray.map((p) => (
          <img
            key={p.id}
            src={crystalShatterDustImage}
            alt=""
            aria-hidden="true"
            className="pf-cs-css__dust-particle"
            style={{
              '--dust-end-x': `${p.endX}px`,
              '--dust-end-y': `${p.endY}px`,
              '--dust-size': `${p.size}px`,
            } as CSSProperties}
          />
        ))}
      </div>
    </>
  )
}

function PrizeRevealCrystalShatterComponent({ prizeCount = DEFAULT_PRIZE_COUNT }: { prizeCount?: number }) {
  const fragments = useFragments()
  const convergeMotes = useConvergeMotes()
  const dustSpray = useDustSpray()
  const prizes = PRIZE_POOL.slice(0, prizeCount)
  const slots = getPrizeSlots(prizeCount)

  const [claimed, setClaimed] = useState(false)
  const [showClaim, setShowClaim] = useState(false)

  useEffect(() => {
    const sources = [
      ...SHARD_IMAGES, crystalShatterDustImage, crystalShatterEnergyMoteImage,
      crystalShatterSparkleImage, crystalShatterPrismaticRingImage,
      crystalShatterFrameImage, ...prizes.map((p) => p.src),
    ]
    sources.forEach((src) => { const img = new Image(); img.src = src })
  }, [prizes])

  useEffect(() => {
    const t = window.setTimeout(() => setShowClaim(true), CLAIM_APPEAR_MS)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <div
      className="pf-modal-celebration pf-cs-css"
      data-animation-id="prize-reveal__crystal-shatter"
      data-prize-count={prizeCount}
    >
      <div className="pf-cs-css__stage">
        <ShatterEffects fragments={fragments} convergeMotes={convergeMotes} dustSpray={dustSpray} />

        <div className="pf-cs-css__prizes">
          {prizes.map((prize, i) => (
            <CssPrize key={prize.id} config={prize} slot={slots[i]} claimed={claimed} claimIndex={i} />
          ))}
        </div>

        {showClaim && !claimed && (
          <button className="pf-cs-css__claim-btn" type="button" onClick={() => setClaimed(true)}>
            CLAIM
          </button>
        )}
      </div>
    </div>
  )
}

export const PrizeRevealCrystalShatter = memo(PrizeRevealCrystalShatterComponent)
