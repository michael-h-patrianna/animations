import { useEffect, useRef } from 'react'
import './ModalOrchestrationComparisonMorph.css'


/**
 *
 */
export function ModalOrchestrationComparisonMorph() {
  const panes = 2
  const paneRefs = useRef<(HTMLDivElement | null)[]>([])

  // Stagger pane animations on mount
  useEffect(() => {
    const paneElements = paneRefs.current.filter(Boolean)
    paneElements.forEach((pane, index) => {
      if (pane) {
        pane.style.animationDelay = `${index * 0.26}s`
        pane.classList.add('pf-comparison__pane--animated')
      }
    })
  }, [])

  return (
    <div className="pf-comparison" data-animation-id="modal-orchestration__comparison-morph">
      {Array.from({ length: panes }, (_, index) => (
        <div
          key={index}
          ref={(el) => { paneRefs.current[index] = el }}
          className="pf-comparison__pane"
        >
          <h5>{index === 0 ? 'Option A' : 'Option B'}</h5>
          <p>
            {index === 0
              ? 'Comparison pane showcasing the first option with detailed information and benefits.'
              : 'Alternative pane demonstrating the second option with different features and advantages.'}
          </p>
          <div className="pf-comparison__badge">
            {index === 0 ? 'Primary choice' : 'Alternative choice'}
          </div>
        </div>
      ))}
    </div>
  )
}

