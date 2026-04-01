/**
 * Floating damage/heal/gold number that pops in, drifts upward, and fades out — CSS variant.
 *
 * Copy-paste files: this file + TextEffectsFloatingCombatText.module.css
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */

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
  /** Fires after the animation completes (not supported in CSS variant — use framer). */
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
}: TextEffectsFloatingCombatTextProps) {
  const driftX = useMemo(() => (Math.random() - 0.5) * 2 * spread, [spread])

  const isCritical = type === 'critical'
  const resolvedFontSize = isCritical ? fontSize * 1.5 : fontSize
  const popScale = isCritical ? 1.3 : 1.1

  const colorStyle =
    color !== undefined ? ({ '--tfx-combattext-color': color } as React.CSSProperties) : undefined

  return (
    <div
      className={styles['tfx-combattext__container']}
      data-animation-id="text-effects__floating-combat-text"
      data-testid="combat-text"
      data-type={type}
      style={colorStyle}
    >
      <div
        className={`${styles['tfx-combattext__text']} ${isCritical ? styles['tfx-combattext__text--critical'] : ''}`}
        data-testid="combat-text-value"
        style={
          {
            '--tfx-combattext-drift-x': `${driftX}px`,
            '--tfx-combattext-float-distance': `${floatDistance}px`,
            '--tfx-combattext-pop-scale': popScale,
            fontSize: resolvedFontSize,
            fontWeight,
            fontFamily,
            animationDuration: `${duration}ms`,
          } as React.CSSProperties
        }
        aria-live="polite"
      >
        {value}
      </div>
    </div>
  )
}

export const TextEffectsFloatingCombatText = memo(TextEffectsFloatingCombatTextComponent)
