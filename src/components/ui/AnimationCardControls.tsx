import { Button } from '@/components/ui/button'
import { CardFooter } from '@/components/ui/card'
import type { AnimationControlType } from '@/types/animation'
import { useEffect, useRef, useState } from 'react'
import {
  clampBulbCount,
  MAX_BULB_COUNT,
  MIN_BULB_COUNT,
  type CardControlsState,
} from './useCardControls'

// ── Tier Badge ────────────────────────────────────────────────────────────

const TIER_CONFIG: Record<number, { label: string; tooltip: string }> = {
  1: {
    label: '1 fx',
    tooltip: 'Effect \u2014 Copy the CSS keyframes or motion props and apply to any element.',
  },
  2: {
    label: '2 deco',
    tooltip:
      'Decorated \u2014 Copy the component file + its CSS. Small utility imports can be inlined.',
  },
  3: {
    label: '3 struct',
    tooltip:
      'Structured \u2014 Copy component + CSS and follow the HTML structure. Elements are choreographed together.',
  },
  4: {
    label: '4 full',
    tooltip: 'Full component \u2014 Copy the entire directory including JS, HTML, CSS, and assets.',
  },
}

/** Small badge showing the portability tier with a tooltip on hover/click. */
function TierBadge({ tier }: { tier: number }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const badgeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!showTooltip) return
    const handleClick = (e: MouseEvent) => {
      if (badgeRef.current && !badgeRef.current.contains(e.target as Node)) {
        setShowTooltip(false)
      }
    }
    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [showTooltip])

  const config = TIER_CONFIG[tier]
  if (!config) return null

  return (
    <button
      ref={badgeRef}
      type="button"
      className="pf-tier-badge"
      data-tier={tier}
      data-testid="tier-badge"
      onClick={() => setShowTooltip((v) => !v)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      aria-label={config.tooltip}
    >
      {config.label}
      {showTooltip && (
        <span className="pf-tier-badge__tooltip" role="tooltip">
          {config.tooltip}
        </span>
      )}
    </button>
  )
}

// ── Lights Controls ───────────────────────────────────────────────────────

type LightsControlsProps = {
  bulbCount: number
  onColor: string
  onBulbCountChange: (value: number) => void
  onColorChange: (color: string) => void
}

/** Bulb count stepper + color picker for light animation cards. */
export const LightsControls = ({
  bulbCount,
  onColor,
  onBulbCountChange,
  onColorChange,
}: LightsControlsProps) => (
  <div className="flex items-center gap-2" data-testid="lights-controls">
    <div className="flex items-center">
      <button
        type="button"
        onClick={() => onBulbCountChange(bulbCount - 1)}
        disabled={bulbCount <= MIN_BULB_COUNT}
        className="w-8 h-8 text-sm font-medium border border-r-0 rounded-l disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent cursor-pointer"
        aria-label="Decrease bulb count"
      >
        -
      </button>
      <input
        type="number"
        value={bulbCount}
        onChange={(event) => {
          const parsed = parseInt(event.target.value, 10)
          onBulbCountChange(Number.isNaN(parsed) ? MIN_BULB_COUNT : parsed)
        }}
        min={MIN_BULB_COUNT}
        max={MAX_BULB_COUNT}
        className="w-12 h-8 text-sm text-center border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        aria-label="Number of bulbs"
      />
      <button
        type="button"
        onClick={() => onBulbCountChange(bulbCount + 1)}
        disabled={bulbCount >= MAX_BULB_COUNT}
        className="w-8 h-8 text-sm font-medium border border-l-0 rounded-r disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent cursor-pointer"
        aria-label="Increase bulb count"
      >
        +
      </button>
    </div>
    <div className="flex items-center gap-1">
      <input
        type="color"
        value={onColor}
        onChange={(event) => onColorChange(event.target.value)}
        className="w-8 h-8 border rounded cursor-pointer"
        title="Bulb color"
        aria-label="Bulb color"
      />
    </div>
  </div>
)

// ── Prize Count Controls ──────────────────────────────────────────────────

type PrizeCountControlsProps = {
  prizeCount: number
  onPrizeCountChange: (count: number) => void
  maxCount?: number
}

/** Numbered button group for selecting prize count. */
export const PrizeCountControls = ({
  prizeCount,
  onPrizeCountChange,
  maxCount = 4,
}: PrizeCountControlsProps) => (
  <div className="flex items-center gap-1" data-testid="prize-controls">
    {Array.from({ length: maxCount }, (_, i) => i + 1).map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onPrizeCountChange(n)}
        className={`w-8 h-8 text-sm font-medium border rounded cursor-pointer hover:bg-accent ${n === prizeCount ? 'bg-accent border-primary' : ''}`}
        aria-label={`Show ${n} prize${n > 1 ? 's' : ''}`}
        aria-pressed={n === prizeCount}
      >
        {n}
      </button>
    ))}
  </div>
)

// ── Footer Controls ───────────────────────────────────────────────────────

type FooterControlsProps = {
  cardControls: CardControlsState
  controlType?: AnimationControlType
  prizeCountMax?: number
  tier?: 1 | 2 | 3 | 4
  disableReplay: boolean
  onReplay: () => void
}

/** Card footer with tier badge, interactive controls (lights/prize), and replay button. */
export const FooterControls = ({
  cardControls,
  controlType,
  prizeCountMax,
  tier,
  disableReplay,
  onReplay,
}: FooterControlsProps) => {
  const { bulbCount, onColor, prizeCount, setBulbCount, setOnColor, setPrizeCount, setReplayKey } =
    cardControls

  const handleBulbCountChange = (value: number) => {
    setBulbCount(clampBulbCount(value))
    setReplayKey((k) => k + 1)
  }
  const handleColorChange = (color: string) => {
    setOnColor(color)
    setReplayKey((k) => k + 1)
  }
  const handlePrizeCountChange = (count: number) => {
    setPrizeCount(count)
    setReplayKey((k) => k + 1)
  }

  return (
    <CardFooter className="pf-card__actions p-0 pt-3">
      <div className="pf-card__meta" data-testid="card-meta">
        {tier !== undefined && <TierBadge tier={tier} />}
      </div>
      {controlType === 'lights' && (
        <LightsControls
          bulbCount={bulbCount}
          onColor={onColor}
          onBulbCountChange={handleBulbCountChange}
          onColorChange={handleColorChange}
        />
      )}
      {controlType === 'prizeCount' && (
        <PrizeCountControls
          prizeCount={prizeCount}
          onPrizeCountChange={handlePrizeCountChange}
          maxCount={prizeCountMax ?? 4}
        />
      )}
      <div className="pf-card__controls" data-testid="card-controls">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="pf-card__replay"
          data-role="replay"
          data-testid="card-replay"
          onClick={onReplay}
          disabled={disableReplay}
          aria-disabled={disableReplay}
        >
          Replay
        </Button>
      </div>
    </CardFooter>
  )
}
