/**
 * Modal with gradient-sweep form field reveal — CSS variant.
 *
 * Copy-paste files: this file + ModalContentFormFieldGradient.css + ../shared.css + ../SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import {
  DemoButton,
  DemoForm,
  DemoModalBody,
  DemoModalFooter,
  DemoModalHeader,
} from '@/components/demo-blocks'
import { generateMockFormFields } from '../MockContentItems'
import type { ContentStaggerProps } from '../SharedTypes'

import './ModalContentFormFieldGradient.css'

const DEFAULT_DURATION = 500
const DEFAULT_STAGGER = 120
const DEFAULT_COUNT = 3

function ModalContentFormFieldGradientComponent({
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
      className="pf-form-gradient-item"
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
          className !== undefined
            ? `pf-content-stagger pf-content-stagger--form ${className}`
            : 'pf-content-stagger pf-content-stagger--form'
        }
        data-animation-id="modal-content__form-field-gradient"
        style={style}
      >
        {items.map((child, i) => wrapItem(child, i, 0))}
      </div>
    )
  }

  const mockFields = generateMockFormFields(DEFAULT_COUNT)

  return (
    <div className="pf-demo-overlay" data-animation-id="modal-content__form-field-gradient">
      <div className="pf-demo-modal pf-mc-box--entrance">
        <DemoModalHeader />
        <DemoModalBody>
          <p>Build trust by sequencing content reveals.</p>
          <p>Keep focus with 70ms cadence.</p>
          <DemoForm>{mockFields.map((field, i) => wrapItem(field, i, 300))}</DemoForm>
        </DemoModalBody>
        <DemoModalFooter>
          <div
            className="pf-button-stagger-item"
            style={
              {
                '--pf-stagger-delay': '750ms',
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
                '--pf-stagger-delay': '820ms',
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

export const ModalContentFormFieldGradient = memo(ModalContentFormFieldGradientComponent)
