/**
 * Split Reveal — button text separates to reveal hidden content on click.
 *
 * Copy-paste files: this file + ButtonEffectsSplitReveal.css
 * Runtime deps: react
 *
 * Usage:
 *   <ButtonEffectsSplitReveal
 *     topLabel="Check"
 *     bottomLabel="Out!"
 *     revealContent={<span>🎉</span>}
 *     className="my-btn-styles"
 *   />
 */

import { memo, useEffect, useState, type ReactNode } from 'react'
import './ButtonEffectsSplitReveal.css'

interface ButtonEffectsSplitRevealProps {
  /** Top half label. Default: 'Click' */
  topLabel?: ReactNode
  /** Bottom half label. Default: 'Me!' */
  bottomLabel?: ReactNode
  /** Content revealed between the split halves. Default: '✨' */
  revealContent?: ReactNode
  /** Split animation duration in ms. Default: 800 */
  duration?: number
  /** CSS class applied to the button element for consumer styling. */
  className?: string
  /** Fires alongside the reveal animation. */
  onClick?: () => void
}

function ButtonEffectsSplitRevealComponent({
  topLabel = 'Click',
  bottomLabel = 'Me!',
  revealContent = '✨',
  duration = 800,
  className,
  onClick,
}: ButtonEffectsSplitRevealProps) {
  const [isRevealing, setIsRevealing] = useState(false)

  useEffect(() => {
    if (!isRevealing) return
    const timer = setTimeout(() => setIsRevealing(false), duration)
    return () => clearTimeout(timer)
  }, [isRevealing, duration])

  const handleClick = () => {
    setIsRevealing(true)
    onClick?.()
  }

  return (
    <div
      data-animation-id="button-effects__split-reveal"
      style={duration !== 800 ? { ['--pf-split-reveal-duration' as string]: `${duration}ms` } : undefined}
    >
      <button
        type="button"
        className={`pf-split-reveal ${isRevealing ? 'pf-split-reveal--active' : ''} ${className ?? 'pf-btn pf-btn--primary'}`}
        onClick={handleClick}
      >
        <span className="pf-split-reveal__top">{topLabel}</span>
        <span className="pf-split-reveal__bottom">{bottomLabel}</span>
        <span className="pf-split-reveal__content">{revealContent}</span>
      </button>
    </div>
  )
}

export const ButtonEffectsSplitReveal = memo(ButtonEffectsSplitRevealComponent)
