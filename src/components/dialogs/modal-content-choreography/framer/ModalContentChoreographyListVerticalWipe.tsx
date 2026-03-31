/**
 * Modal with horizontal wipe-in list reveal.
 * Modal scales in, list items wipe in from off-screen left, then button pops in.
 *
 * Copy-paste files: this file + ../SharedTypes.ts + ../shared.css
 * Runtime deps: react, motion
 *
 * @example
 * <ModalContentChoreographyListVerticalWipe stagger={100} duration={500}>
 *   <div>Step complete</div>
 *   <div>Profile configured</div>
 * </ModalContentChoreographyListVerticalWipe>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import {
  DemoButton,
  DemoList,
  DemoModalBody,
  DemoModalFooter,
  DemoModalHeader,
} from '@/components/demo-blocks'
import './ModalContentChoreographyListVerticalWipe.module.css'
import { generateMockListItems } from '@/components/dialogs/modal-content-choreography/MockContentItems'
import {
  MODAL_ENTRANCE,
  REDUCED_FADE,
  buttonBounceProps,
  toItemArray,
  type ContentStaggerProps,
} from '@/components/dialogs/modal-content-choreography/SharedTypes'

const DEFAULT_DURATION = 500
const DEFAULT_STAGGER = 100
const DEFAULT_COUNT = 4

function ModalContentChoreographyListVerticalWipeComponent({
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

  const animateWipeItem = (child: React.ReactNode, i: number, delayBase: number) => (
    <div key={i} style={{ overflow: 'hidden' }}>
      <m.div
        initial={reduced ? { opacity: 0 } : { x: '-100%', opacity: 0 }}
        animate={reduced ? { opacity: 1 } : { x: '0%', opacity: 1 }}
        transition={
          reduced
            ? { duration: 0.2 }
            : {
                duration: durationS,
                delay: delayBase + staggerS * i,
                ease: [0.4, 0, 0.2, 1] as const,
              }
        }
      >
        {child}
      </m.div>
    </div>
  )

  if (items.length > 0) {
    return (
      <div
        className={
          className !== undefined ? `pf-content-stagger ${className}` : 'pf-content-stagger'
        }
        data-animation-id="modal-content-choreography__list-vertical-wipe"
        style={style}
      >
        {items.map((child, i) => animateWipeItem(child, i, 0))}
      </div>
    )
  }

  const mockItems = generateMockListItems(DEFAULT_COUNT)

  return (
    <div
      className="pf-demo-overlay-fm"
      data-animation-id="modal-content-choreography__list-vertical-wipe"
    >
      <m.div className="pf-demo-modal" {...(reduced ? REDUCED_FADE : MODAL_ENTRANCE)}>
        <DemoModalHeader title="Setup Complete" />
        <DemoModalBody>
          <DemoList>{mockItems.map((item, i) => animateWipeItem(item, i, 0.3))}</DemoList>
        </DemoModalBody>
        <DemoModalFooter>
          <m.div {...buttonBounceProps(0.7, reduced)} onAnimationComplete={onAnimationComplete}>
            <DemoButton label="Continue" />
          </m.div>
        </DemoModalFooter>
      </m.div>
    </div>
  )
}

export const ModalContentChoreographyListVerticalWipe = memo(
  ModalContentChoreographyListVerticalWipeComponent
)
