import { useEffect, useRef } from 'react'
import './ModalOrchestrationSelectionGrid.css'


/**
 *
 */
export function ModalOrchestrationSelectionGrid() {
  const items = 6
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  // Stagger item animations on mount
  useEffect(() => {
    const itemElements = itemRefs.current.filter(Boolean)
    itemElements.forEach((item, index) => {
      if (item) {
        item.style.animationDelay = `${index * 0.26}s`
        item.classList.add('pf-grid__item--animated')
      }
    })
  }, [])

  return (
    <div className="pf-grid" data-animation-id="modal-orchestration__selection-grid">
      {Array.from({ length: items }, (_, index) => (
        <div key={index} ref={(el) => { itemRefs.current[index] = el }} className="pf-grid__item">
          <div>
            <strong>Option {index + 1}</strong>
            <br />
            Select item
          </div>
        </div>
      ))}
    </div>
  )
}

