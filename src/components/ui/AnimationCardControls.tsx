import { Button } from '@/demo-ui/components/ui/Button'
import { ToggleGroup, type ToggleOption } from '@/demo-ui/components/ui/ToggleGroup'
import { Tooltip } from '@/demo-ui/components/ui/Tooltip'
import type { AnimationControlType } from '@/types/animation'
import { useMemo } from 'react'
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

/** Small badge showing the portability tier with a tooltip on hover. */
function TierBadge({ tier }: { tier: number }) {
  const config = TIER_CONFIG[tier]
  if (!config) return null

  return (
    <Tooltip content={config.tooltip} position="top">
      <span className="pf-tier-badge" data-tier={tier} data-testid="tier-badge">
        {config.label}
      </span>
    </Tooltip>
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
    <div className="flex items-center gap-0.5">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onBulbCountChange(bulbCount - 1)}
        disabled={bulbCount <= MIN_BULB_COUNT}
        ariaLabel="Decrease bulb count"
        className="w-8 h-8 rounded-r-none"
        data-testid="bulb-decrease"
      >
        -
      </Button>
      <input
        type="number"
        value={bulbCount}
        onChange={(event) => {
          const parsed = parseInt(event.target.value, 10)
          onBulbCountChange(Number.isNaN(parsed) ? MIN_BULB_COUNT : parsed)
        }}
        min={MIN_BULB_COUNT}
        max={MAX_BULB_COUNT}
        className="w-12 h-8 text-sm text-center border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        aria-label="Number of bulbs"
      />
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onBulbCountChange(bulbCount + 1)}
        disabled={bulbCount >= MAX_BULB_COUNT}
        ariaLabel="Increase bulb count"
        className="w-8 h-8 rounded-l-none"
        data-testid="bulb-increase"
      >
        +
      </Button>
    </div>
    <input
      type="color"
      value={onColor}
      onChange={(event) => onColorChange(event.target.value)}
      className="w-8 h-8 border border-[var(--border-default)] rounded cursor-pointer bg-transparent"
      title="Bulb color"
      aria-label="Bulb color"
    />
  </div>
)

// ── Prize Count Controls ──────────────────────────────────────────────────

type PrizeCountControlsProps = {
  prizeCount: number
  onPrizeCountChange: (count: number) => void
  maxCount?: number
}

/** Numbered toggle group for selecting prize count. */
export const PrizeCountControls = ({
  prizeCount,
  onPrizeCountChange,
  maxCount = 4,
}: PrizeCountControlsProps) => {
  const options: ToggleOption[] = useMemo(
    () =>
      Array.from({ length: maxCount }, (_, i) => ({
        value: String(i + 1),
        label: String(i + 1),
      })),
    [maxCount]
  )

  return (
    <ToggleGroup
      options={options}
      value={String(prizeCount)}
      onChange={(v) => onPrizeCountChange(parseInt(v, 10))}
      ariaLabel="Prize count"
      data-testid="prize-controls"
      className="w-auto"
    />
  )
}

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
    <div className="pf-card__actions pt-3">
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
          variant="primary"
          size="sm"
          className="pf-card__replay"
          data-role="replay"
          data-testid="card-replay"
          onClick={onReplay}
          disabled={disableReplay}
        >
          Replay
        </Button>
      </div>
    </div>
  )
}
