/**
 * Spring-physics stagger entrance with CSS hover-lift and tap-press transitions — CSS variant.
 *
 * Copy-paste files: this file + ModalOrchestrationSpringPhysics.css
 * Runtime deps: react
 *
 * @example
 * <ModalOrchestrationSpringPhysics stagger={100} columns={3}>
 *   <ProductCard>...</ProductCard>
 *   <ProductCard>...</ProductCard>
 * </ModalOrchestrationSpringPhysics>
 */

import { Children, memo, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import './ModalOrchestrationSpringPhysics.css'

const DEFAULT_COUNT = 6

interface ModalOrchestrationSpringPhysicsProps {
  /** Items to bounce in. When omitted, renders placeholder tiles. */
  children?: ReactNode
  /** Delay between each item's entrance in ms. Default 100. */
  stagger?: number
  /** Duration of each item's entrance animation in ms. Default 800. */
  duration?: number
  /** Number of grid columns. Default 3. */
  columns?: number
}

function generatePlaceholders(count: number): ReactNode[] {
  return Array.from({ length: count }, (_, i) => (
    <div key={`placeholder-${i}`}>
      <h5>Elastic {i + 1}</h5>
      <p>Spring bounce</p>
    </div>
  ))
}

function ModalOrchestrationSpringPhysicsComponent({
  children,
  stagger = 100,
  duration = 800,
  columns = 3,
}: ModalOrchestrationSpringPhysicsProps) {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  const items = Children.toArray(children)
  const renderItems = items.length > 0 ? items : generatePlaceholders(DEFAULT_COUNT)

  useEffect(() => {
    itemsRef.current.filter(Boolean).forEach((el, index) => {
      if (el !== null) {
        el.style.animationDelay = `${(0.2 * 1000 + index * stagger) / 1000}s`
        el.style.animationDuration = `${duration / 1000}s`
        el.classList.add('pf-spring-physics__item--visible')
      }
    })
  }, [stagger, duration])

  return (
    <div
      className="pf-spring-physics"
      data-animation-id="modal-orchestration__spring-physics"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {renderItems.map((child, i) => (
        <div
          key={i}
          ref={(el) => {
            itemsRef.current[i] = el
          }}
          className="pf-spring-physics__item"
        >
          {child}
        </div>
      ))}
    </div>
  )
}

export const ModalOrchestrationSpringPhysics = memo(ModalOrchestrationSpringPhysicsComponent)
