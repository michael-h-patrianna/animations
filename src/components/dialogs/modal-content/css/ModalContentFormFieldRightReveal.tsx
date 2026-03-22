/**
 * Stagger-reveals child elements by sliding from the right — CSS variant.
 *
 * Copy-paste files: this file + ModalContentFormFieldRightReveal.css + ../SharedTypes.ts
 * Runtime deps: react
 *
 * @example
 * <ModalContentFormFieldRightReveal stagger={90} distance={40}>
 *   <div><label>Name</label><input /></div>
 *   <div><label>Email</label><input /></div>
 * </ModalContentFormFieldRightReveal>
 */

import { Children, memo } from 'react'

import { generateMockFormFields } from '../MockContentItems'
import type { DirectionalRevealProps } from '../SharedTypes'

import './ModalContentFormFieldRightReveal.css'

const DEFAULT_DURATION = 500
const DEFAULT_STAGGER = 90
const DEFAULT_DISTANCE = 32
const DEFAULT_COUNT = 3

function ModalContentFormFieldRightRevealComponent({
  children,
  duration = DEFAULT_DURATION,
  stagger = DEFAULT_STAGGER,
  distance = DEFAULT_DISTANCE,
  className,
  style,
}: DirectionalRevealProps) {
  const items = Children.toArray(children)
  const renderItems = items.length > 0 ? items : generateMockFormFields(DEFAULT_COUNT)

  return (
    <div
      className={className !== undefined ? `pf-content-stagger pf-content-stagger--form ${className}` : 'pf-content-stagger pf-content-stagger--form'}
      data-animation-id="modal-content__form-field-right-reveal"
      style={style}
    >
      {renderItems.map((child, i) => (
        <div
          key={i}
          className="pf-form-right-reveal-item"
          style={{
            '--pf-stagger-delay': `${String(stagger * i)}ms`,
            '--pf-stagger-duration': `${String(duration)}ms`,
            '--pf-reveal-distance': `${String(distance)}px`,
          } as React.CSSProperties}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

export const ModalContentFormFieldRightReveal = memo(ModalContentFormFieldRightRevealComponent)
