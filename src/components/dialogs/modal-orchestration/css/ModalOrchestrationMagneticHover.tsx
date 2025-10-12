import type { AnimationMetadata } from '@/types/animation'
import { useEffect, useRef } from 'react'
import './ModalOrchestrationMagneticHover.css'


export function ModalOrchestrationMagneticHover() {
  const tiles = Array.from({ length: 6 }, (_, index) => ({
    id: index,
    title: `Hover ${index + 1}`,
    content: `Smooth hover effects`,
  }))

  const containerRef = useRef<HTMLDivElement>(null)
  const tileRefs = useRef<(HTMLDivElement | null)[]>([])

  // Stagger tile animations on mount
  useEffect(() => {
    const tileElements = tileRefs.current.filter(Boolean)
    tileElements.forEach((tile, index) => {
      if (tile) {
        tile.style.animationDelay = `${0.2 + index * 0.1}s`
        tile.classList.add('pf-magnetic-tile--animated')
      }
    })
  }, [])

  return (
    <div
      ref={containerRef}
      className="pf-magnetic-container"
      data-animation-id="modal-orchestration__magnetic-hover"
    >
      <div className="pf-magnetic-grid">
        {tiles.map((tile) => (
          <div
            key={tile.id}
            ref={(el) => { tileRefs.current[tile.id] = el }}
            className="pf-magnetic-tile"
          >
            <h5>{tile.title}</h5>
            <p>{tile.content}</p>
            <div className="pf-magnetic-indicator">✨</div>
          </div>
        ))}
      </div>
    </div>
  )
}

