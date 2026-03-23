/**
 * Modal with right-slide form field reveal.
 * Modal scales in, form fields slide in from the right, then buttons pop in.
 *
 * Copy-paste files: this file + ../SharedTypes.ts + ../shared.css
 * Runtime deps: react, motion
 *
 * @example
 * <ModalContentFormFieldRightReveal stagger={90} distance={40}>
 *   <div><label>Name</label><input /></div>
 *   <div><label>Email</label><input /></div>
 * </ModalContentFormFieldRightReveal>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import { generateMockFormFields, MockButton, MockModalHeader } from '../MockContentItems'
import type { DirectionalRevealProps } from '../SharedTypes'

const DEFAULT_DURATION = 500
const DEFAULT_STAGGER = 90
const DEFAULT_DISTANCE = 32
const DEFAULT_COUNT = 3

function ModalContentFormFieldRightRevealComponent({
  children,
  duration = DEFAULT_DURATION,
  stagger = DEFAULT_STAGGER,
  distance = DEFAULT_DISTANCE,
  className,
  style,
  onAnimationComplete,
}: DirectionalRevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const items = children !== undefined ? (Array.isArray(children) ? children : [children]) : []
  const durationS = duration / 1000
  const staggerS = stagger / 1000
  const reduced = prefersReducedMotion === true

  const animateField = (child: React.ReactNode, i: number, delayBase: number) => (
    <m.div
      key={i}
      initial={reduced ? { opacity: 0 } : { x: distance, opacity: 0 }}
      animate={reduced ? { opacity: 1 } : { x: 0, opacity: 1 }}
      transition={
        reduced
          ? { duration: 0.01 }
          : {
              duration: durationS,
              delay: delayBase + staggerS * i,
              ease: [0.4, 0, 0.2, 1] as const,
            }
      }
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
            ? `pf-content-stagger pf-content-stagger--form ${className}`
            : 'pf-content-stagger pf-content-stagger--form'
        }
        data-animation-id="modal-content__form-field-right-reveal"
        style={style}
      >
        {items.map((child, i) => animateField(child, i, 0))}
      </div>
    )
  }

  const mockFields = generateMockFormFields(DEFAULT_COUNT)

  return (
    <div className="pf-mc-overlay" data-animation-id="modal-content__form-field-right-reveal">
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
          <div className="pf-mc-form">
            {mockFields.map((field, i) => animateField(field, i, 0.3))}
          </div>
        </div>
        <div className="pf-mc-footer">
          <m.div
            initial={reduced ? { opacity: 0 } : { y: 16, scale: 0.94, opacity: 0 }}
            animate={
              reduced
                ? { opacity: 1 }
                : { y: [16, -6, 0], scale: [0.94, 1.06, 1], opacity: [0, 1, 1] }
            }
            transition={
              reduced
                ? { duration: 0.01 }
                : {
                    duration: 0.3,
                    delay: 0.75,
                    ease: [0.4, 0, 0.2, 1] as const,
                    times: [0, 0.6, 1],
                  }
            }
            style={{ animation: 'none' }}
          >
            <MockButton label="Accept" />
          </m.div>
          <m.div
            initial={reduced ? { opacity: 0 } : { y: 16, scale: 0.94, opacity: 0 }}
            animate={
              reduced
                ? { opacity: 1 }
                : { y: [16, -6, 0], scale: [0.94, 1.06, 1], opacity: [0, 1, 1] }
            }
            transition={
              reduced
                ? { duration: 0.01 }
                : {
                    duration: 0.3,
                    delay: 0.82,
                    ease: [0.4, 0, 0.2, 1] as const,
                    times: [0, 0.6, 1],
                  }
            }
            onAnimationComplete={onAnimationComplete}
            style={{ animation: 'none' }}
          >
            <MockButton label="Later" variant="secondary" />
          </m.div>
        </div>
      </m.div>
    </div>
  )
}

export const ModalContentFormFieldRightReveal = memo(ModalContentFormFieldRightRevealComponent)
