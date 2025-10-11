import type { AnimationMetadata } from '@/types/animation'
import { useEffect, useRef } from 'react'
import './ModalOrchestrationSpringPhysics.css'

export const metadata: AnimationMetadata = {
  id: 'modal-orchestration__spring-physics',
  title: 'Spring Physics Tiles',
  description: 'Elastic spring-based tile animations with gesture interactions and bounce effects',
  tags: ['css', 'js'],
}

export function ModalOrchestrationSpringPhysics() {
  const tiles = Array.from({ length: 6 }, (_, index) => ({
    id: index,
    title: `Elastic ${index + 1}`,
    content: `Spring bounce effect`,
  }))

  const containerRef = useRef<HTMLDivElement>(null)
  const tileRefs = useRef<(HTMLDivElement | null)[]>([])

  // Stagger tile animations on mount
  useEffect(() => {
    const tileElements = tileRefs.current.filter(Boolean)
    tileElements.forEach((tile, index) => {
      if (tile) {
        tile.style.animationDelay = `${0.2 + index * 0.1}s`
        tile.classList.add('pf-spring-tile--animated')
      }
    })
  }, [])

  return (
    <div
      ref={containerRef}
      className="pf-spring-container"
      data-animation-id="modal-orchestration__spring-physics"
    >
      <div className="pf-spring-grid">
        {tiles.map((tile) => (
          <div
            key={tile.id}
            ref={(el) => { tileRefs.current[tile.id] = el }}
            className="pf-spring-tile"
          >
            <h5>{tile.title}</h5>
            <p>{tile.content}</p>
            <div className="pf-spring-indicator">⚡</div>
          </div>
        ))}
      </div>
    </div>
  )
}
