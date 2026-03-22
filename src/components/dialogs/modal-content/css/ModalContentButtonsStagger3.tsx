/**
 * Stagger-reveals child elements with a bounce-up pop (3-button default) — CSS variant.
 *
 * Copy-paste files: this file + ModalContentButtonsStagger3.css + ../SharedTypes.ts
 * Runtime deps: react
 *
 * @example
 * <ModalContentButtonsStagger3 stagger={70} duration={320}>
 *   <button>Accept</button>
 *   <button>Later</button>
 *   <button>Skip</button>
 * </ModalContentButtonsStagger3>
 */

import { Children, memo } from 'react'

import { generateMockButtons } from '../MockContentItems'
import type { ContentStaggerProps } from '../SharedTypes'

import './ModalContentButtonsStagger3.css'

const DEFAULT_DURATION = 320
const DEFAULT_STAGGER = 70
const DEFAULT_COUNT = 3

function ModalContentButtonsStagger3Component({
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
      data-animation-id="modal-content__buttons-stagger-3"
      style={style}
    >
      {renderItems.map((child, i) => (
        <div
          key={i}
          className="pf-button-stagger-3-item"
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

export const ModalContentButtonsStagger3 = memo(ModalContentButtonsStagger3Component)
