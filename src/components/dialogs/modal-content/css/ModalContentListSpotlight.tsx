/**
 * Modal with spotlight-sweep list reveal — CSS variant.
 *
 * Copy-paste files: this file + ModalContentListSpotlight.css + ../shared.css + ../SharedTypes.ts
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

import './ModalContentListSpotlight.css'

const DEFAULT_DURATION = 500
const DEFAULT_STAGGER = 120
const DEFAULT_COUNT = 3

function ModalContentListSpotlightComponent({
  children,
  duration = DEFAULT_DURATION,
  stagger = DEFAULT_STAGGER,
  className,
  style,
}: ContentStaggerProps) {
  const items = children !== undefined ? (Array.isArray(children) ? children : [children]) : []

  const wrapItem = (child: React.ReactNode, i: number, delayBase: number) => (
    <div
      key={i}
      className="pf-list-spotlight-item"
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
        data-animation-id="modal-content__list-spotlight"
        style={style}
      >
        {items.map((child, i) => wrapItem(child, i, 0))}
      </div>
    )
  }

  const mockItems = generateMockListItems(DEFAULT_COUNT)

  return (
    <div className="pf-demo-overlay" data-animation-id="modal-content__list-spotlight">
      <div className="pf-demo-modal pf-mc-box--entrance">
        <DemoModalHeader />
        <DemoModalBody>
          <p>Build trust by sequencing content reveals.</p>
          <p>Keep focus with 70ms cadence.</p>
          <DemoList>{mockItems.map((item, i) => wrapItem(item, i, 300))}</DemoList>
        </DemoModalBody>
        <DemoModalFooter>
          <div
            className="pf-button-stagger-item"
            style={
              {
                '--pf-stagger-delay': '650ms',
                '--pf-stagger-duration': '300ms',
              } as React.CSSProperties
            }
          >
            <DemoButton label="Accept" />
          </div>
          <div
            className="pf-button-stagger-item"
            style={
              {
                '--pf-stagger-delay': '720ms',
                '--pf-stagger-duration': '300ms',
              } as React.CSSProperties
            }
          >
            <DemoButton label="Later" variant="secondary" />
          </div>
        </DemoModalFooter>
      </div>
    </div>
  )
}

export const ModalContentListSpotlight = memo(ModalContentListSpotlightComponent)
