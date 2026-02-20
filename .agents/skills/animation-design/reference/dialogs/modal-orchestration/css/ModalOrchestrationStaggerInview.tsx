import { useEffect, useRef, useState } from 'react'
import './ModalOrchestrationStaggerInview.css'


export function ModalOrchestrationStaggerInview() {
  const containerRef = useRef<HTMLDivElement>(null)
  const tileRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isInView, setIsInView] = useState(false)

  const tiles = Array.from({ length: 12 }, (_, index) => ({
    id: index,
    title: `Tile ${index + 1}`,
    content: `Content for tile ${index + 1}`,
  }))

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isInView) {
            setIsInView(true)
            // Stagger tile animations
            const tileElements = tileRefs.current.filter(Boolean)
            tileElements.forEach((tile, index) => {
              if (tile) {
                tile.style.animationDelay = `${0.2 + index * 0.1}s`
                tile.classList.add('pf-stagger-tile--visible')
              }
            })
          }
        })
      },
      { threshold: 0.1, rootMargin: '-100px' }
    )

    const currentContainer = containerRef.current
    if (currentContainer) {
      observer.observe(currentContainer)
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer)
      }
    }
  }, [isInView])

  return (
    <div
      ref={containerRef}
      className="pf-stagger-container"
      data-animation-id="modal-orchestration__stagger-inview"
    >
      <div className="pf-stagger-grid">
        {tiles.map((tile) => (
          <div
            key={tile.id}
            ref={(el) => { tileRefs.current[tile.id] = el }}
            className="pf-stagger-tile"
          >
            <h5>{tile.title}</h5>
            <p>{tile.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

