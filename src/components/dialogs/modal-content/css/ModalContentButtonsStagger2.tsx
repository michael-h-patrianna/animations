/**
 * Modal with staggered button reveal (2-button default) — CSS variant.
 *
 * Copy-paste files: this file + ModalContentButtonsStagger2.css + ../shared.css + ../SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { DemoButton, DemoModalBody, DemoModalFooter, DemoModalHeader } from '@/components/demo-blocks'
import type { ContentStaggerProps } from '../SharedTypes'

import './ModalContentButtonsStagger2.css'

const DEFAULT_DURATION = 300
const DEFAULT_STAGGER = 70

function ModalContentButtonsStagger2Component({
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
      className="pf-button-stagger-item"
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
          className !== undefined
            ? `pf-content-stagger pf-content-stagger--horizontal ${className}`
            : 'pf-content-stagger pf-content-stagger--horizontal'
        }
        data-animation-id="modal-content__buttons-stagger-2"
        style={style}
      >
        {items.map((child, i) => wrapItem(child, i, 0))}
      </div>
    )
  }

  return (
    <div className="pf-demo-overlay" data-animation-id="modal-content__buttons-stagger-2">
      <div className="pf-demo-modal pf-mc-box--entrance">
        <DemoModalHeader />
        <DemoModalBody>
          <p>Build trust by sequencing content reveals.</p>
          <p>Keep focus with 70ms cadence.</p>
        </DemoModalBody>
        <DemoModalFooter>
          {wrapItem(<DemoButton label="Primary" />, 0, 300)}
          {wrapItem(<DemoButton label="Secondary" variant="secondary" />, 1, 300)}
        </DemoModalFooter>
      </div>
    </div>
  )
}

export const ModalContentButtonsStagger2 = memo(ModalContentButtonsStagger2Component)
