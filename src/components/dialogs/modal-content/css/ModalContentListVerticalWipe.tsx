/**
 * Stagger-reveals child elements with a horizontal wipe-in — CSS variant.
 *
 * Copy-paste files: this file + ModalContentListVerticalWipe.css + ../SharedTypes.ts
 * Runtime deps: react
 *
 * @example
 * <ModalContentListVerticalWipe stagger={100} duration={500}>
 *   <div>Step complete</div>
 *   <div>Profile configured</div>
 * </ModalContentListVerticalWipe>
 */

import { Children, memo } from 'react'

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
  const items = Children.toArray(children)
  const renderItems = items.length > 0 ? items : generateMockListItems(DEFAULT_COUNT)

  return (
    <div
      className={className !== undefined ? `pf-content-stagger ${className}` : 'pf-content-stagger'}
      data-animation-id="modal-content__list-vertical-wipe"
      style={style}
    >
      {renderItems.map((child, i) => (
        <div key={i} className="pf-list-vertical-wipe-clip">
          <div
            className="pf-list-vertical-wipe-item"
            style={{
              '--pf-stagger-delay': `${String(stagger * i)}ms`,
              '--pf-stagger-duration': `${String(duration)}ms`,
            } as React.CSSProperties}
          >
            {child}
          </div>
        </div>
      ))}
    </div>
  )
}

export const ModalContentListVerticalWipe = memo(ModalContentListVerticalWipeComponent)
