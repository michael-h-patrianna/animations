import { useEffect, useRef } from 'react'
import type { AnimationMetadata } from '../../../types/animation'
import './ModalOrchestrationWizardFadeCross.css'

export const metadata: AnimationMetadata = {
  id: 'modal-orchestration__wizard-fade-cross',
  title: 'Step Tiles Fade',
  description: 'Multi-step wizard with cross-fading step tiles and content panels',
  tags: ['css', 'js'],
}

export function ModalOrchestrationWizardFadeCross() {
  const steps = 3
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])

  // Stagger panel animations on mount
  useEffect(() => {
    const panelElements = panelRefs.current.filter(Boolean)
    panelElements.forEach((panel, index) => {
      if (panel) {
        panel.style.animationDelay = `${index * 0.26}s`
        panel.classList.add('pf-wizard__panel--animated')
      }
    })
  }, [])

  return (
    <div className="pf-wizard" data-animation-id="modal-orchestration__wizard-fade-cross">
      <div className="pf-wizard__panels">
        {Array.from({ length: steps }, (_, index) => (
          <div
            key={index}
            ref={(el) => (panelRefs.current[index] = el)}
            className="pf-wizard__panel"
          >
            <h5>Stage {index + 1}</h5>
            <p>Cross-fade content placeholder to illustrate flow animation.</p>
          </div>
        ))}
      </div>
    </div>
  )
}
