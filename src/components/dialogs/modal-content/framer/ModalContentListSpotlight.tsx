/**
 * Modal with spotlight-sweep list reveal.
 * Modal scales in, list items scale up with overshoot one by one, then buttons pop in.
 *
 * Copy-paste files: this file + ../SharedTypes.ts + ../shared.css
 * Runtime deps: react, motion
 *
 * @example
 * <ModalContentListSpotlight stagger={120} duration={500}>
 *   <div>Milestone 1</div>
 *   <div>Milestone 2</div>
 * </ModalContentListSpotlight>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import { DemoButton, DemoList, DemoModalBody, DemoModalFooter, DemoModalHeader } from '@/components/demo-blocks'
import { generateMockListItems } from '../MockContentItems'
import type { ContentStaggerProps } from '../SharedTypes'

const DEFAULT_DURATION = 500
const DEFAULT_STAGGER = 120
const DEFAULT_COUNT = 3

function ModalContentListSpotlightComponent({
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

  const animateListItem = (child: React.ReactNode, i: number, delayBase: number) => (
    <m.div
      key={i}
      initial={reduced ? { opacity: 0 } : { scale: 0.95, opacity: 0 }}
      animate={reduced ? { opacity: 1 } : { scale: [0.95, 1.02, 1], opacity: [0, 0.7, 1] }}
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
          className !== undefined ? `pf-content-stagger ${className}` : 'pf-content-stagger'
        }
        data-animation-id="modal-content__list-spotlight"
        style={style}
      >
        {items.map((child, i) => animateListItem(child, i, 0))}
      </div>
    )
  }

  const mockItems = generateMockListItems(DEFAULT_COUNT)
  const buttonStaggerBase = 0.3 + staggerS * DEFAULT_COUNT + 0.05

  return (
    <div className="pf-demo-overlay" data-animation-id="modal-content__list-spotlight">
      <m.div
        className="pf-demo-modal"
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
        <DemoModalHeader />
        <DemoModalBody>
          <p>Build trust by sequencing content reveals.</p>
          <p>Keep focus with 70ms cadence.</p>
          <DemoList>
            {mockItems.map((item, i) => animateListItem(item, i, 0.3))}
          </DemoList>
        </DemoModalBody>
        <DemoModalFooter>
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
                    delay: buttonStaggerBase,
                    ease: [0.4, 0, 0.2, 1] as const,
                    times: [0, 0.6, 1],
                  }
            }
            style={{ animation: 'none' }}
          >
            <DemoButton label="Accept" />
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
                    delay: buttonStaggerBase + 0.07,
                    ease: [0.4, 0, 0.2, 1] as const,
                    times: [0, 0.6, 1],
                  }
            }
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

export const ModalContentListSpotlight = memo(ModalContentListSpotlightComponent)
