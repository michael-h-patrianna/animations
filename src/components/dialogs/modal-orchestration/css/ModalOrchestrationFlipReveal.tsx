import { useEffect, useRef, useState } from 'react'
import type { AnimationMetadata } from '../../../types/animation'
import './ModalOrchestrationFlipReveal.css'

export const metadata: AnimationMetadata = {
  id: 'modal-orchestration__flip-reveal',
  title: '3D Flip Reveal',
  description: 'Tiles with 3D flip transitions revealing hidden content with perspective transforms',
  tags: ['css', 'js'],
}

export function ModalOrchestrationFlipReveal() {
  const [flippedTiles, setFlippedTiles] = useState<Set<number>>(new Set())
  const tileRefs = useRef<(HTMLDivElement | null)[]>([])

  const tiles = Array.from({ length: 6 }, (_, index) => ({
    id: index,
    frontTitle: `Card ${index + 1}`,
    frontContent: `Click to flip`,
    backTitle: `Revealed`,
    backContent: `Hidden content`,
  }))

  const toggleFlip = (tileId: number) => {
    setFlippedTiles((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(tileId)) {
        newSet.delete(tileId)
      } else {
        newSet.add(tileId)
      }
      return newSet
    })
  }

  // Stagger tile entrance animations on mount
  useEffect(() => {
    const tileElements = tileRefs.current.filter(Boolean)
    tileElements.forEach((tile, index) => {
      if (tile) {
        tile.style.animationDelay = `${0.2 + index * 0.1}s`
        tile.classList.add('pf-flip-tile-container--animated')
      }
    })
  }, [])

  return (
    <div className="pf-flip-container" data-animation-id="modal-orchestration__flip-reveal">
      <div className="pf-flip-grid">
        {tiles.map((tile) => {
          const isFlipped = flippedTiles.has(tile.id)

          return (
            <div
              key={tile.id}
              ref={(el) => (tileRefs.current[tile.id] = el)}
              className="pf-flip-tile-container"
              onClick={() => toggleFlip(tile.id)}
            >
              <div className={`pf-flip-tile${isFlipped ? ' pf-flip-tile--flipped' : ''}`}>
                {/* Front Face */}
                <div className="pf-flip-face pf-flip-front">
                  <h5>{tile.frontTitle}</h5>
                  <p>{tile.frontContent}</p>
                  <div className="pf-flip-indicator">↻</div>
                </div>

                {/* Back Face */}
                <div className="pf-flip-face pf-flip-back">
                  <h5>{tile.backTitle}</h5>
                  <p>{tile.backContent}</p>
                  <div className="pf-flip-indicator">✓</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
