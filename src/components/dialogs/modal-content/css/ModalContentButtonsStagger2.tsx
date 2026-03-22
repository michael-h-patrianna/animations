/**
 * Stagger-reveals child elements with a bounce-up pop — CSS variant.
 *
 * Copy-paste files: this file + ModalContentButtonsStagger2.css + ../SharedTypes.ts
 * Runtime deps: react
 *
 * @example
 * <ModalContentButtonsStagger2 stagger={70} duration={300}>
 *   <button>Accept</button>
 *   <button>Cancel</button>
 * </ModalContentButtonsStagger2>
 */

import { Children, memo } from 'react'

import { generateMockButtons } from '../MockContentItems'
import type { ContentStaggerProps } from '../SharedTypes'

import './ModalContentButtonsStagger2.css'

const DEFAULT_DURATION = 300
const DEFAULT_STAGGER = 70
const DEFAULT_COUNT = 2

function ModalContentButtonsStagger2Component({
  children,
  duration = DEFAULT_DURATION,
  stagger = DEFAULT_STAGGER,
  className,
  style,
}: ContentStaggerProps) {
  const items = Children.toArray(children)
  const renderItems = items.length > 0 ? items : generateMockButtons(DEFAULT_COUNT)

  return (
    <div
      className={className !== undefined ? `pf-content-stagger pf-content-stagger--horizontal ${className}` : 'pf-content-stagger pf-content-stagger--horizontal'}
      data-animation-id="modal-content__buttons-stagger-2"
      style={style}
    >
      {renderItems.map((child, i) => (
        <div
          key={i}
          className="pf-button-stagger-item"
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

export const ModalContentButtonsStagger2 = memo(ModalContentButtonsStagger2Component)
