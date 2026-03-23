/**
 * Modal with soft-stagger list reveal — CSS variant.
 *
 * Copy-paste files: this file + ModalContentListSoftStagger.css + ../shared.css + ../SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { generateMockListItems, MockButton, MockModalHeader } from '../MockContentItems'
import type { ContentStaggerProps } from '../SharedTypes'

import './ModalContentListSoftStagger.css'

const DEFAULT_DURATION = 400
const DEFAULT_STAGGER = 60
const DEFAULT_COUNT = 5

function ModalContentListSoftStaggerComponent({
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
      className="pf-list-soft-stagger-item"
      style={
        {
          '--pf-stagger-delay': `${String(delayBase + stagger * i)}ms`,
          '--pf-stagger-duration': `${String(duration)}ms`,
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
        data-animation-id="modal-content__list-soft-stagger"
        style={style}
      >
        {items.map((child, i) => wrapItem(child, i, 0))}
      </div>
    )
  }

  const mockItems = generateMockListItems(DEFAULT_COUNT)

  return (
    <div className="pf-mc-overlay" data-animation-id="modal-content__list-soft-stagger">
      <div className="pf-mc-box pf-mc-box--entrance">
        <MockModalHeader title="Recent Changes" />
        <div className="pf-mc-body">
          <div className="pf-mc-list">{mockItems.map((item, i) => wrapItem(item, i, 300))}</div>
        </div>
        <div className="pf-mc-footer">
          <div
            className="pf-button-stagger-item"
            style={
              {
                '--pf-stagger-delay': '600ms',
                '--pf-stagger-duration': '300ms',
              } as React.CSSProperties
            }
          >
            <MockButton label="Got it" />
          </div>
        </div>
      </div>
    </div>
  )
}

export const ModalContentListSoftStagger = memo(ModalContentListSoftStaggerComponent)
