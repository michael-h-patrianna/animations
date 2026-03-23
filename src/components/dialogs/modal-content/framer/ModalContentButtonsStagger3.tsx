/**
 * Modal with staggered button reveal (3-button default).
 * Modal scales in, then action buttons pop up one by one with overshoot.
 *
 * Copy-paste files: this file + ../SharedTypes.ts + ../shared.css
 * Runtime deps: react, motion
 *
 * @example
 * <ModalContentButtonsStagger3 stagger={70} duration={320}>
 *   <button>Accept</button>
 *   <button>Later</button>
 *   <button>Skip</button>
 * </ModalContentButtonsStagger3>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import { MockButton, MockModalHeader } from '../MockContentItems'
import type { ContentStaggerProps } from '../SharedTypes'

const DEFAULT_DURATION = 320
const DEFAULT_STAGGER = 70

function ModalContentButtonsStagger3Component({
  children,
  duration = DEFAULT_DURATION,
  stagger = DEFAULT_STAGGER,
  className,
  style,
  onAnimationComplete,
}: ContentStaggerProps) {
  const prefersReducedMotion = useReducedMotion()
  const items = children !== undefined ? (Array.isArray(children) ? children : [children]) : []
  const durationS = duration / 1000
  const staggerS = stagger / 1000
  const reduced = prefersReducedMotion === true

  const animateItem = (child: React.ReactNode, i: number, delayBase: number) => (
    <m.div
      key={i}
      initial={reduced ? { opacity: 0 } : { y: 16, scale: 0.94, opacity: 0 }}
      animate={
        reduced ? { opacity: 1 } : { y: [16, -6, 0], scale: [0.94, 1.06, 1], opacity: [0, 1, 1] }
      }
      transition={
        reduced
          ? { duration: 0.01 }
          : {
              duration: durationS,
              delay: delayBase + staggerS * i,
              ease: [0.4, 0, 0.2, 1] as const,
              times: [0, 0.6, 1],
            }
      }
      onAnimationComplete={onAnimationComplete}
      style={{ animation: 'none' }}
    >
      {child}
    </m.div>
  )

  if (items.length > 0) {
    return (
      <div
        className={
          className !== undefined
            ? `pf-content-stagger pf-content-stagger--horizontal ${className}`
            : 'pf-content-stagger pf-content-stagger--horizontal'
        }
        data-animation-id="modal-content__buttons-stagger-3"
        style={style}
      >
        {items.map((child, i) => animateItem(child, i, 0))}
      </div>
    )
  }

  return (
    <div className="pf-mc-overlay" data-animation-id="modal-content__buttons-stagger-3">
      <m.div
        className="pf-mc-box"
        initial={reduced ? { opacity: 0 } : { scale: 0.88, y: -16, opacity: 0 }}
        animate={
          reduced
            ? { opacity: 1 }
            : { scale: [0.88, 1.02, 1], y: [-16, -4, 0], opacity: [0, 0.6, 1] }
        }
        transition={
          reduced
            ? { duration: 0.01 }
            : { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const, times: [0, 0.5, 1] }
        }
        style={{ animation: 'none' }}
      >
        <MockModalHeader />
        <div className="pf-mc-body">
          <p>Build trust by sequencing content reveals.</p>
          <p>Keep focus with 70ms cadence.</p>
        </div>
        <div className="pf-mc-footer">
          {animateItem(<MockButton label="Primary" />, 0, 0.3)}
          {animateItem(<MockButton label="Secondary" variant="secondary" />, 1, 0.3)}
          {animateItem(<MockButton label="Tertiary" variant="secondary" />, 2, 0.3)}
        </div>
      </m.div>
    </div>
  )
}

export const ModalContentButtonsStagger3 = memo(ModalContentButtonsStagger3Component)
