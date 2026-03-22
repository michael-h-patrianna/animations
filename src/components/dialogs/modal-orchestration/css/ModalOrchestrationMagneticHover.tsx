/**
 * 3D-tilt stagger entrance with CSS hover and tap transitions — CSS variant.
 *
 * Copy-paste files: this file + ModalOrchestrationMagneticHover.css
 * Runtime deps: react
 *
 * @example
 * <ModalOrchestrationMagneticHover stagger={100} columns={4}>
 *   <FeatureCard>...</FeatureCard>
 *   <FeatureCard>...</FeatureCard>
 * </ModalOrchestrationMagneticHover>
 */

import { Children, memo, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import './ModalOrchestrationMagneticHover.css'

const DEFAULT_COUNT = 6

interface ModalOrchestrationMagneticHoverProps {
  /** Items to stagger in with 3D tilt. When omitted, renders placeholder tiles. */
  children?: ReactNode
  /** Delay between each item's entrance in ms. Default 100. */
  stagger?: number
  /** Duration of each item's entrance animation in ms. Default 600. */
  duration?: number
  /** Number of grid columns. Default 4. */
  columns?: number
}

function generatePlaceholders(count: number): ReactNode[] {
  return Array.from({ length: count }, (_, i) => (
    <div key={`placeholder-${i}`}>
      <h5>Hover {i + 1}</h5>
      <p>Magnetic tilt</p>
    </div>
  ))
}

function ModalOrchestrationMagneticHoverComponent({
  children,
  stagger = 100,
  duration = 600,
  columns = 4,
}: ModalOrchestrationMagneticHoverProps) {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  const items = Children.toArray(children)
  const renderItems = items.length > 0 ? items : generatePlaceholders(DEFAULT_COUNT)

  useEffect(() => {
    itemsRef.current.filter(Boolean).forEach((el, index) => {
      if (el !== null) {
        el.style.animationDelay = `${(0.2 * 1000 + index * stagger) / 1000}s`
        el.style.animationDuration = `${duration / 1000}s`
        el.classList.add('pf-magnetic-hover__item--visible')
      }
    })
  }, [stagger, duration])

  return (
    <div
      className="pf-magnetic-hover"
      data-animation-id="modal-orchestration__magnetic-hover"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {renderItems.map((child, i) => (
        <div
          key={i}
          ref={(el) => {
            itemsRef.current[i] = el
          }}
          className="pf-magnetic-hover__item"
        >
          {child}
        </div>
      ))}
    </div>
  )
}

export const ModalOrchestrationMagneticHover = memo(ModalOrchestrationMagneticHoverComponent)
