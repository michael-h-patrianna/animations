/**
 * Stagger-reveals child elements with a soft upward fade — CSS variant.
 *
 * Copy-paste files: this file + ModalContentListSoftStagger.css + ../SharedTypes.ts
 * Runtime deps: react
 *
 * @example
 * <ModalContentListSoftStagger stagger={60} duration={400}>
 *   <div>Item one</div>
 *   <div>Item two</div>
 * </ModalContentListSoftStagger>
 */

import { Children, memo } from 'react'

import { generateMockListItems } from '../MockContentItems'
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
  const items = Children.toArray(children)
  const renderItems = items.length > 0 ? items : generateMockListItems(DEFAULT_COUNT)

  return (
    <div
      className={className !== undefined ? `pf-content-stagger ${className}` : 'pf-content-stagger'}
      data-animation-id="modal-content__list-soft-stagger"
      style={style}
    >
      {renderItems.map((child, i) => (
        <div
          key={i}
          className="pf-list-soft-stagger-item"
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

export const ModalContentListSoftStagger = memo(ModalContentListSoftStaggerComponent)
