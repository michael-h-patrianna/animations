/**
 * Floating damage/heal/gold number that pops in, drifts upward, and fades out.
 *
 * Copy-paste files: this file + TextEffectsFloatingCombatText.module.css
 * Runtime deps: react, motion
 * RN: Port with Moti — animate scale/translateY/opacity via useDynamicAnimation.
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useMemo } from 'react'
import styles from './TextEffectsFloatingCombatText.module.css'

// eslint-disable-next-line animation-rules/no-hardcoded-colors -- 'gold' is a game mechanic identifier, not a CSS color
type CombatType = 'damage' | 'heal' | 'gold' | 'neutral' | 'critical'

interface TextEffectsFloatingCombatTextProps {
  /** Text to display (string to allow prefixes like "+", "-"). @default '-42' */
  value?: string
  /** Preset: damage (red), heal (green), gold (yellow), neutral (white), critical (large red + scale bump). @default 'damage' */
  type?: CombatType
  /** Override color. Overrides type color when set. */
  color?: string
  /** Base font size in px. Critical type applies 1.5x multiplier. @default 24 */
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

function TextEffectsFloatingCombatTextComponent({
  value = '-42',
  type = 'damage',
  color,
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

  const isCritical = type === 'critical'
  const resolvedFontSize = isCritical ? fontSize * 1.5 : fontSize
  const popScale = isCritical ? 1.3 : 1.1
  const durationS = duration / 1000

  const colorStyle =
    color !== undefined ? ({ '--pf-combat-text-color': color } as React.CSSProperties) : undefined

  if (prefersReducedMotion) {
    return (
      <div
        className={styles['pf-combat-text-fm']}
        data-animation-id="text-effects__floating-combat-text"
        data-testid="combat-text"
        data-type={type}
        style={colorStyle}
      >
        <div
          className={`${styles['pf-combat-text-fm__text']} ${isCritical ? styles['pf-combat-text-fm__text--critical'] : ''}`}
          data-testid="combat-text-value"
          style={{
            fontSize: resolvedFontSize,
            fontWeight,
            fontFamily,
          }}
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
      data-type={type}
      style={colorStyle}
    >
      <m.div
        className={`${styles['pf-combat-text-fm__text']} ${isCritical ? styles['pf-combat-text-fm__text--critical'] : ''}`}
        data-testid="combat-text-value"
        style={{
          fontSize: resolvedFontSize,
          fontWeight,
          fontFamily,
        }}
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
