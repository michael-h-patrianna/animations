/**
 * Modal with soft-stagger list reveal — CSS variant.
 *
 * Copy-paste files: this file + ModalContentChoreographyListSoftStagger.module.css + ../shared.css + ../SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import {
  DemoButton,
  DemoList,
  DemoModalBody,
  DemoModalFooter,
  DemoModalHeader,
} from '@/components/demo-blocks'
import { generateMockListItems } from '@/components/dialogs/modal-content-choreography/MockContentItems'
import {
  toItemArray,
  type ContentStaggerProps,
} from '@/components/dialogs/modal-content-choreography/SharedTypes'

import styles from './ModalContentChoreographyListSoftStagger.module.css'

const DEFAULT_DURATION = 400
const DEFAULT_STAGGER = 60
const DEFAULT_COUNT = 5

function ModalContentChoreographyListSoftStaggerComponent({
  children,
  duration = DEFAULT_DURATION,
  stagger = DEFAULT_STAGGER,
  className,
  style,
}: ContentStaggerProps) {
  const items = toItemArray(children)

  const wrapItem = (child: React.ReactNode, i: number, delayBase: number) => (
    <div
      key={i}
      className={styles['pf-list-soft-stagger-item']}
      style={
        {
          '--pf-stagger-delay': `${delayBase + stagger * i}ms`,
          '--pf-stagger-duration': `${duration}ms`,
        } as React.CSSProperties
      }
    >
      {child}
    </div>
  )

  if (items.length > 0) {
    return (
      <div
        className={
          className !== undefined ? `pf-content-stagger ${className}` : 'pf-content-stagger'
        }
        data-animation-id="modal-content-choreography__list-soft-stagger"
        style={style}
      >
        {items.map((child, i) => wrapItem(child, i, 0))}
      </div>
    )
  }

  const mockItems = generateMockListItems(DEFAULT_COUNT)

  return (
    <div
      className="pf-demo-overlay"
      data-animation-id="modal-content-choreography__list-soft-stagger"
    >
      <div className={`pf-demo-modal ${styles['pf-mc-box--entrance']}`}>
        <DemoModalHeader title="Recent Changes" />
        <DemoModalBody>
          <DemoList>{mockItems.map((item, i) => wrapItem(item, i, 300))}</DemoList>
        </DemoModalBody>
        <DemoModalFooter>
          <div
            className={styles['pf-button-stagger-item']}
            style={
              {
                '--pf-stagger-delay': '600ms',
                '--pf-stagger-duration': '300ms',
              } as React.CSSProperties
            }
          >
            <DemoButton label="Got it" />
          </div>
        </DemoModalFooter>
      </div>
    </div>
  )
}

export const ModalContentChoreographyListSoftStagger = memo(
  ModalContentChoreographyListSoftStaggerComponent
)
