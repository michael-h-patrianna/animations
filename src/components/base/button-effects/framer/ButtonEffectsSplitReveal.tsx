/**
 * Split Reveal — button text separates to reveal hidden content on click.
 * The top and bottom labels split apart with rotation while the reveal
 * content scales up from center.
 *
 * Copy-paste files: this file + ButtonEffectsSplitReveal.css
 * Runtime deps: react, motion
 *
 * Usage:
 *   <ButtonEffectsSplitReveal
 *     topLabel="Check"
 *     bottomLabel="Out!"
 *     revealContent={<span>🎉</span>}
 *     className="my-btn-styles"
 *     onClick={handleClick}
 *   />
 */

import * as m from 'motion/react-m'
import { useEffect, useState, memo, type ReactNode } from 'react'
import './ButtonEffectsSplitReveal.css'

const SPLIT_TRANSITION = { duration: 0.8, ease: [0.68, -0.55, 0.265, 1.55] as const }

const topVariants = {
  closed: { y: 0, rotate: 0 },
  open: { y: -15, rotate: -5 },
}

const bottomVariants = {
  closed: { y: 0, rotate: 0 },
  open: { y: 15, rotate: 5 },
}

const revealVariants = {
  closed: { scale: 0 },
  open: { scale: 1.2 },
}

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

  const state = isRevealing ? 'open' : 'closed'
  const durationS = duration / 1000
  const transition = { ...SPLIT_TRANSITION, duration: durationS }

  return (
    <button
      type="button"
      className={`pf-split-reveal ${className ?? 'pf-btn pf-btn--primary'}`}
      data-animation-id="button-effects__split-reveal"
      onClick={handleClick}
    >
      <m.span
        className="pf-split-reveal__top"
        variants={topVariants}
        animate={state}
        transition={transition}
        style={{ animation: 'none' }}
      >
        {topLabel}
      </m.span>
      <m.span
        className="pf-split-reveal__bottom"
        variants={bottomVariants}
        animate={state}
        transition={transition}
        style={{ animation: 'none' }}
      >
        {bottomLabel}
      </m.span>
      <m.span
        className="pf-split-reveal__content"
        variants={revealVariants}
        animate={state}
        transition={transition}
        style={{ animation: 'none' }}
      >
        {revealContent}
      </m.span>
    </button>
  )
}

export const ButtonEffectsSplitReveal = memo(ButtonEffectsSplitRevealComponent)
