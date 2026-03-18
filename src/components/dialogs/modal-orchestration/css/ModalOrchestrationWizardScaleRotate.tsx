import { useEffect, useRef } from 'react'
import './ModalOrchestrationWizardScaleRotate.css'

export function ModalOrchestrationWizardScaleRotate() {
  const steps = 3
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])
  const panelRef = useRef<(HTMLDivElement | null)[]>([])

  // Stagger animations on mount
  useEffect(() => {
    // Animate steps
    const stepElements = stepsRef.current.filter(Boolean)
    stepElements.forEach((step, index) => {
      if (step) {
        step.style.animationDelay = `${index * 0.26}s`
        step.classList.add('pf-wizard__step--animated')
      }
    })

    // Animate panels
    const panelElements = panelRef.current.filter(Boolean)
    panelElements.forEach((panel, index) => {
      if (panel) {
        panel.style.animationDelay = `${index * 0.26}s`
        panel.classList.add('pf-wizard__panel--animated')
      }
    })
  }, [])

  return (
    <div className="pf-wizard" data-animation-id="modal-orchestration__wizard-scale-rotate">
      <div className="pf-wizard__steps">
        {Array.from({ length: steps }, (_, index) => (
          <div
            key={index}
            ref={(el) => {
              stepsRef.current[index] = el
            }}
            className={`pf-wizard__step${index === 0 ? ' pf-wizard__step--highlighted' : ''}`}
          >
            Step {index + 1}
          </div>
        ))}
      </div>

      <div className="pf-wizard__panels">
        {Array.from({ length: steps }, (_, index) => (
          <div
            key={index}
            ref={(el) => {
              panelRef.current[index] = el
            }}
            className={`pf-wizard__panel${index === 0 ? ' pf-wizard__panel--highlighted' : ''}`}
          >
            <h5>Stage {index + 1}</h5>
            <p>Scale-rotate content placeholder to illustrate flow animation.</p>
          </div>
        ))}
      </div>
    </div>
  )
}
