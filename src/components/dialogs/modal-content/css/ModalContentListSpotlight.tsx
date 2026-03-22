/**
 * Stagger-reveals child elements with a scale spotlight effect — CSS variant.
 *
 * Copy-paste files: this file + ModalContentListSpotlight.css + ../SharedTypes.ts
 * Runtime deps: react
 *
 * @example
 * <ModalContentListSpotlight stagger={120} duration={500}>
 *   <div>Milestone 1</div>
 *   <div>Milestone 2</div>
 * </ModalContentListSpotlight>
 */

import { Children, memo } from 'react'

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
  const items = Children.toArray(children)
  const renderItems = items.length > 0 ? items : generateMockListItems(DEFAULT_COUNT)

  return (
    <div
      className={className !== undefined ? `pf-content-stagger ${className}` : 'pf-content-stagger'}
      data-animation-id="modal-content__list-spotlight"
      style={style}
    >
      {renderItems.map((child, i) => (
        <div
          key={i}
          className="pf-list-spotlight-item"
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

export const ModalContentListSpotlight = memo(ModalContentListSpotlightComponent)
