/**
 * Modal with horizontal wipe-in list reveal — CSS variant.
 *
 * Copy-paste files: this file + ModalContentListVerticalWipe.css + ../shared.css + ../SharedTypes.ts
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
import { generateMockListItems } from '../MockContentItems'
import type { ContentStaggerProps } from '../SharedTypes'

import './ModalContentListVerticalWipe.css'

const DEFAULT_DURATION = 500
const DEFAULT_STAGGER = 100
const DEFAULT_COUNT = 4

function ModalContentListVerticalWipeComponent({
  children,
  duration = DEFAULT_DURATION,
  stagger = DEFAULT_STAGGER,
  className,
  style,
}: ContentStaggerProps) {
  const items = children !== undefined ? (Array.isArray(children) ? children : [children]) : []

  const wrapItem = (child: React.ReactNode, i: number, delayBase: number) => (
    <div key={i} className="pf-list-vertical-wipe-clip">
      <div
        className="pf-list-vertical-wipe-item"
        style={
          {
            '--pf-stagger-delay': `${String(delayBase + stagger * i)}ms`,
            '--pf-stagger-duration': `${String(duration)}ms`,
          } as React.CSSProperties
        }
      >
        {child}
      </div>
    </div>
  )

  if (items.length > 0) {
    return (
      <div
        className={
          className !== undefined ? `pf-content-stagger ${className}` : 'pf-content-stagger'
        }
        data-animation-id="modal-content__list-vertical-wipe"
        style={style}
      >
        {items.map((child, i) => wrapItem(child, i, 0))}
      </div>
    )
  }

  const mockItems = generateMockListItems(DEFAULT_COUNT)

  return (
    <div className="pf-demo-overlay" data-animation-id="modal-content__list-vertical-wipe">
      <div className="pf-demo-modal pf-mc-box--entrance">
        <DemoModalHeader title="Setup Complete" />
        <DemoModalBody>
          <DemoList>{mockItems.map((item, i) => wrapItem(item, i, 300))}</DemoList>
        </DemoModalBody>
        <DemoModalFooter>
          <div
            className="pf-button-stagger-item"
            style={
              {
                '--pf-stagger-delay': '700ms',
                '--pf-stagger-duration': '300ms',
              } as React.CSSProperties
            }
          >
            <DemoButton label="Continue" />
          </div>
        </DemoModalFooter>
      </div>
    </div>
  )
}

export const ModalContentListVerticalWipe = memo(ModalContentListVerticalWipeComponent)
