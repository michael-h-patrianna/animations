/**
 * Floating number that pops in, drifts upward, and fades out.
 * Color is determined by the numeric value and configurable thresholds.
 *
 * Copy-paste files: this file + TextEffectsFloatingCombatText.module.css
 * Runtime deps: react, motion
 * RN: Port with Moti — animate scale/translateY/opacity via useDynamicAnimation.
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useMemo } from 'react'
import styles from './TextEffectsFloatingCombatText.module.css'

type ColorBand = 'positive-high' | 'positive' | 'negative' | 'negative-high'

interface TextEffectsFloatingCombatTextProps {
  /** Text to display (parsed as number for color band). @default '-42' */
  value?: string
  /** Color for values >= positiveHighLimit. */
  colorPositiveHigh?: string
  /** Color for values >= 0 (below positiveHighLimit). */
  colorPositive?: string
  /** Color for values < 0 (above -negativeHighLimit). */
  colorNegative?: string
  /** Color for values <= -negativeHighLimit. */
  colorNegativeHigh?: string
  /** Absolute value threshold for the positive-high band. @default 100 */
  positiveHighLimit?: number
  /** Absolute value threshold for the negative-high band. @default 100 */
  negativeHighLimit?: number
  /** Base font size in px. @default 24 */
  fontSize?: number
  /** How far the number floats upward in px. @default 60 */
  floatDistance?: number
  /** Total float + fade duration in ms. @default 800 */
  duration?: number
  /** Max horizontal drift range in px (randomized). @default 20 */
  spread?: number
  /** Font family. @default 'inherit' */
  fontFamily?: string
  /** Font weight. @default '700' */
  fontWeight?: string
  /** Fires after the animation completes. */
  onComplete?: () => void
}

function resolveColorBand(
  value: string,
  positiveHighLimit: number,
  negativeHighLimit: number
): ColorBand {
  const num = parseFloat(value)
  if (Number.isNaN(num) || num >= 0) {
    return num >= positiveHighLimit ? 'positive-high' : 'positive'
  }
  return num <= -negativeHighLimit ? 'negative-high' : 'negative'
}

function TextEffectsFloatingCombatTextComponent({
  value = '-42',
  colorPositiveHigh,
  colorPositive,
  colorNegative,
  colorNegativeHigh,
  positiveHighLimit = 100,
  negativeHighLimit = 100,
  fontSize = 24,
  floatDistance = 60,
  duration = 800,
  spread = 20,
  fontFamily = 'inherit',
  fontWeight = '700',
  onComplete,
}: TextEffectsFloatingCombatTextProps) {
  const prefersReducedMotion = useReducedMotion()
  const driftX = useMemo(() => (Math.random() - 0.5) * 2 * spread, [spread])
  const durationS = duration / 1000

  const band = resolveColorBand(value, positiveHighLimit, negativeHighLimit)

  const colorMap: Record<ColorBand, string | undefined> = {
    'positive-high': colorPositiveHigh,
    positive: colorPositive,
    negative: colorNegative,
    'negative-high': colorNegativeHigh,
  }
  const overrideColor = colorMap[band]
  const colorStyle =
    overrideColor !== undefined
      ? ({ '--pf-combat-text-color': overrideColor } as React.CSSProperties)
      : undefined

  const isHigh = band === 'positive-high' || band === 'negative-high'
  const popScale = isHigh ? 1.3 : 1.1

  if (prefersReducedMotion) {
    return (
      <div
        className={styles['pf-combat-text-fm']}
        data-animation-id="text-effects__floating-combat-text"
        data-testid="combat-text"
        data-band={band}
        style={colorStyle}
      >
        <div
          className={styles['pf-combat-text-fm__text']}
          data-testid="combat-text-value"
          style={{ fontSize, fontWeight, fontFamily }}
        >
          {value}
        </div>
      </div>
    )
  }

  return (
    <div
      className={styles['pf-combat-text-fm']}
      data-animation-id="text-effects__floating-combat-text"
      data-testid="combat-text"
      data-band={band}
      style={colorStyle}
    >
      <m.div
        className={styles['pf-combat-text-fm__text']}
        data-testid="combat-text-value"
        style={{ fontSize, fontWeight, fontFamily }}
        initial={{ opacity: 1, scale: 0.8, y: 0, x: 0 }}
        animate={{
          opacity: [1, 1, 1, 0.5, 0],
          scale: [0.8, popScale, popScale * 0.95, 0.95, 0.9],
          y: [0, 0, -floatDistance * 0.3, -floatDistance * 0.75, -floatDistance],
          x: [0, 0, driftX * 0.3, driftX * 0.75, driftX],
        }}
        transition={{
          duration: durationS,
          times: [0, 0.125, 0.375, 0.75, 1],
          ease: 'easeOut',
        }}
        onAnimationComplete={onComplete}
        aria-live="polite"
      >
        {value}
      </m.div>
    </div>
  )
}

export const TextEffectsFloatingCombatText = memo(TextEffectsFloatingCombatTextComponent)
