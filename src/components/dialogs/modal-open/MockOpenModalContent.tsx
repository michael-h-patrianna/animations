import type { ReactNode } from 'react'

import { useReducedMotion } from 'motion/react'

import {
  DemoButton,
  DemoCloseButton,
  DemoList,
  DemoListItem,
  DemoModalBody,
  DemoModalFooter,
  DemoModalHeader,
} from '@/components/demo-blocks'

/**
 * Mock modal content for zero-props catalog demo of modal-open animations.
 * Composes demo-blocks building blocks inside the pf-mo-box structural wrapper
 * (animation CSS targets pf-mo-box for entrance effects).
 * NOT copied by consumers — exists only for catalog rendering.
 */

const STAGGER_DELAY_MS = 60
const STAGGER_EASE = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
const CONTENT_ITEMS = [
  'Daily bonus collected',
  'New achievement unlocked',
  'Leaderboard rank updated',
]

/** Total duration of the content reveal/unreveal transition. */
export const CONTENT_TRANSITION_MS = 300 + STAGGER_DELAY_MS * (CONTENT_ITEMS.length + 1)

/**
 * Demo modal content with built-in stagger reveal.
 * Setting `revealed` to false reverses the transitions (content fades out in reverse).
 * `onClose` is called when the user clicks the X or Close button.
 */
export function MockOpenModalContent({
  revealed,
  onClose,
}: {
  revealed?: boolean
  onClose?: () => void
}) {
  const show = revealed === true
  const reduced = useReducedMotion() === true
  const buttonDelay = STAGGER_DELAY_MS * (CONTENT_ITEMS.length + 1)

  return (
    <div className="pf-mo-box">
      <DemoCloseButton
        onClick={onClose}
        style={{
          opacity: show ? 1 : 0,
          transition: reduced ? 'none' : 'opacity 200ms ease',
        }}
      />
      <DemoModalHeader
        title="Bonus Reward"
        badge="New"
        style={{
          opacity: show ? 1 : 0,
          transform: show ? 'translateY(0)' : reduced ? 'none' : 'translateY(8px)',
          transition: reduced
            ? 'none'
            : `opacity 300ms ${STAGGER_EASE}, transform 300ms ${STAGGER_EASE}`,
        }}
      />
      <DemoModalBody>
        <DemoList>
          {CONTENT_ITEMS.map((text, i) => (
            <DemoListItem
              key={text}
              style={{
                opacity: show ? 1 : 0,
                transform: show ? 'translateY(0)' : reduced ? 'none' : 'translateY(12px)',
                transition: reduced
                  ? 'none'
                  : `opacity 300ms ${STAGGER_EASE} ${STAGGER_DELAY_MS * (i + 1)}ms, transform 300ms ${STAGGER_EASE} ${STAGGER_DELAY_MS * (i + 1)}ms`,
              }}
            >
              {text}
            </DemoListItem>
          ))}
        </DemoList>
      </DemoModalBody>
      <DemoModalFooter>
        <DemoButton
          label="Close"
          onClick={onClose}
          style={{
            opacity: show ? 1 : 0,
            transform: show
              ? 'translateY(0) scale(1)'
              : reduced
                ? 'none'
                : 'translateY(12px) scale(0.94)',
            transition: reduced
              ? 'none'
              : `opacity 250ms ${STAGGER_EASE} ${buttonDelay}ms, transform 250ms cubic-bezier(0.4, 0, 0.2, 1) ${buttonDelay}ms`,
          }}
        />
      </DemoModalFooter>
    </div>
  )
}

/**
 * Wraps children or renders mock content.
 * Used by animation components to provide a visible default when children is omitted.
 */
export function ModalOpenPlaceholder({
  children,
  revealed,
  onClose,
}: {
  children?: ReactNode
  revealed?: boolean
  onClose?: () => void
}) {
  if (children !== undefined) return <>{children}</>
  return <MockOpenModalContent revealed={revealed} onClose={onClose} />
}
