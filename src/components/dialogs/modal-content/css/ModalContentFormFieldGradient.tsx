/**
 * Stagger-reveals child elements with a gradient sweep highlight — CSS variant.
 *
 * Copy-paste files: this file + ModalContentFormFieldGradient.css + ../SharedTypes.ts
 * Runtime deps: react
 *
 * @example
 * <ModalContentFormFieldGradient stagger={120} duration={500}>
 *   <div><label>Name</label><input /></div>
 *   <div><label>Email</label><input /></div>
 * </ModalContentFormFieldGradient>
 */

import { Children, memo } from 'react'

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
  const items = Children.toArray(children)
  const renderItems = items.length > 0 ? items : generateMockFormFields(DEFAULT_COUNT)

  return (
    <div
      className={className !== undefined ? `pf-content-stagger pf-content-stagger--form ${className}` : 'pf-content-stagger pf-content-stagger--form'}
      data-animation-id="modal-content__form-field-gradient"
      style={style}
    >
      {renderItems.map((child, i) => (
        <div
          key={i}
          className="pf-form-gradient-item"
          style={{
            '--pf-stagger-delay': `${String(stagger * i)}ms`,
            '--pf-stagger-duration': `${String(duration)}ms`,
          } as React.CSSProperties}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

export const ModalContentFormFieldGradient = memo(ModalContentFormFieldGradientComponent)
