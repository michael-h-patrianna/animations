/**
 * Modal with staggered button reveal (2-button default).
 * Modal scales in, then action buttons pop up one by one with overshoot.
 *
 * Copy-paste files: this file + ../SharedTypes.ts + ../shared.css
 * Runtime deps: react, motion
 *
 * @example
 * <ModalContentButtonsStagger2 stagger={70} duration={300}>
 *   <button>Accept</button>
 *   <button>Cancel</button>
 * </ModalContentButtonsStagger2>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import {
  DemoButton,
  DemoModalBody,
  DemoModalFooter,
  DemoModalHeader,
} from '@/components/demo-blocks'
import './ModalContentButtonsStagger2.module.css'
import {
  MODAL_ENTRANCE,
  REDUCED_FADE,
  toItemArray,
  type ContentStaggerProps,
} from '@/components/dialogs/modal-content/SharedTypes'

const DEFAULT_DURATION = 300
const DEFAULT_STAGGER = 70

function ModalContentButtonsStagger2Component({
  children,
  duration = DEFAULT_DURATION,
  stagger = DEFAULT_STAGGER,
  className,
  style,
  onAnimationComplete,
}: ContentStaggerProps) {
  const prefersReducedMotion = useReducedMotion()
  const items = toItemArray(children)
  const durationS = duration / 1000
  const staggerS = stagger / 1000
  const reduced = prefersReducedMotion === true

  const animateItem = (child: React.ReactNode, i: number, delayBase: number, isLast = false) => (
    <m.div
      key={i}
      initial={reduced ? { opacity: 0 } : { y: 16, scale: 0.94, opacity: 0 }}
      animate={
        reduced ? { opacity: 1 } : { y: [16, -6, 0], scale: [0.94, 1.06, 1], opacity: [0, 1, 1] }
      }
      transition={
        reduced
          ? { duration: 0.2 }
          : {
              duration: durationS,
              delay: delayBase + staggerS * i,
              ease: [0.4, 0, 0.2, 1] as const,
              times: [0, 0.6, 1],
            }
      }
      onAnimationComplete={isLast ? onAnimationComplete : undefined}
    >
      {child}
    </m.div>
  )

  // Consumer path: bare stagger container
  if (items.length > 0) {
    return (
      <div
        className={
          className !== undefined
            ? `pf-content-stagger pf-content-stagger--horizontal ${className}`
            : 'pf-content-stagger pf-content-stagger--horizontal'
        }
        data-animation-id="modal-content__buttons-stagger-2"
        style={style}
      >
        {items.map((child, i) => animateItem(child, i, 0, i === items.length - 1))}
      </div>
    )
  }

  // Demo path: full modal with choreographed button reveal
  return (
    <div className="pf-demo-overlay-fm" data-animation-id="modal-content__buttons-stagger-2">
      <m.div className="pf-demo-modal" {...(reduced ? REDUCED_FADE : MODAL_ENTRANCE)}>
        <DemoModalHeader />
        <DemoModalBody>
          <p>Build trust by sequencing content reveals.</p>
          <p>Keep focus with 70ms cadence.</p>
        </DemoModalBody>
        <DemoModalFooter>
          {animateItem(<DemoButton label="OK" />, 0, 0.3)}
          {animateItem(<DemoButton label="Cancel" variant="secondary" />, 1, 0.3, true)}
        </DemoModalFooter>
      </m.div>
    </div>
  )
}

export const ModalContentButtonsStagger2 = memo(ModalContentButtonsStagger2Component)
