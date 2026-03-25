/**
 * Modal with gradient-sweep form field reveal.
 * Modal scales in, form fields slide up with a blue gradient pulse, then buttons pop in.
 *
 * Copy-paste files: this file + ../SharedTypes.ts + ../shared.css
 * Runtime deps: react, motion
 *
 * @example
 * <ModalContentFormFieldGradient stagger={120} duration={500}>
 *   <div><label>Name</label><input /></div>
 *   <div><label>Email</label><input /></div>
 * </ModalContentFormFieldGradient>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import {
  DemoButton,
  DemoForm,
  DemoModalBody,
  DemoModalFooter,
  DemoModalHeader,
} from '@/components/demo-blocks'
import { generateMockFormFields } from '@/components/dialogs/modal-content/MockContentItems'
import {
  MODAL_ENTRANCE,
  REDUCED_FADE,
  buttonBounceProps,
  toItemArray,
  type ContentStaggerProps,
} from '@/components/dialogs/modal-content/SharedTypes'

const DEFAULT_DURATION = 500
const DEFAULT_STAGGER = 120
const DEFAULT_COUNT = 3

function ModalContentFormFieldGradientComponent({
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

  const animateField = (child: React.ReactNode, i: number, delayBase: number) => (
    <m.div
      key={i}
      initial={reduced ? { opacity: 0 } : { y: 20, opacity: 0 }}
      animate={
        reduced
          ? { opacity: 1 }
          : {
              y: [20, 0, 0],
              opacity: [0, 1, 1],
              background: [
                'linear-gradient(90deg, transparent 0%, var(--pf-mc-gradient-10) 50%, transparent 100%)',
                'linear-gradient(90deg, transparent 0%, var(--pf-mc-gradient-20) 50%, transparent 100%)',
                'transparent',
              ],
            }
      }
      transition={
        reduced
          ? { duration: 0.01 }
          : {
              duration: durationS,
              delay: delayBase + staggerS * i,
              ease: [0.4, 0, 0.2, 1] as const,
              times: [0, 0.5, 1],
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
        data-animation-id="modal-content__form-field-gradient"
        style={style}
      >
        {items.map((child, i) => animateField(child, i, 0))}
      </div>
    )
  }

  const mockFields = generateMockFormFields(DEFAULT_COUNT)

  return (
    <div className="pf-demo-overlay" data-animation-id="modal-content__form-field-gradient">
      <m.div
        className="pf-demo-modal"
        {...(reduced ? REDUCED_FADE : MODAL_ENTRANCE)}
        style={{ animation: 'none' }}
      >
        <DemoModalHeader />
        <DemoModalBody>
          <p>Build trust by sequencing content reveals.</p>
          <p>Keep focus with 70ms cadence.</p>
          <DemoForm>{mockFields.map((field, i) => animateField(field, i, 0.3))}</DemoForm>
        </DemoModalBody>
        <DemoModalFooter>
          <m.div {...buttonBounceProps(0.75, reduced)} style={{ animation: 'none' }}>
            <DemoButton label="Accept" />
          </m.div>
          <m.div
            {...buttonBounceProps(0.82, reduced)}
            onAnimationComplete={onAnimationComplete}
            style={{ animation: 'none' }}
          >
            <DemoButton label="Later" variant="secondary" />
          </m.div>
        </DemoModalFooter>
      </m.div>
    </div>
  )
}

export const ModalContentFormFieldGradient = memo(ModalContentFormFieldGradientComponent)
