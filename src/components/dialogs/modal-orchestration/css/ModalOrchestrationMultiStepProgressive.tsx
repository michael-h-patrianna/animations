import type { AnimationMetadata } from '@/types/animation'
import './ModalOrchestrationMultiStepProgressive.css'

export function ModalOrchestrationMultiStepProgressive() {
  const steps = 5

  return (
    <div
      className="pf-wizard-progressive"
      data-animation-id="modal-orchestration__multi-step-progressive"
    >
      <div className="pf-wizard-progressive__steps">
        {Array.from({ length: steps }, (_, index) => (
          <div
            key={index}
            className={`pf-wizard-progressive__step pf-wizard-progressive__step--${index}`}
          >
            Step {index + 1}
          </div>
        ))}
      </div>

      <div className="pf-wizard-progressive__panels">
        {Array.from({ length: steps }, (_, index) => (
          <div
            key={index}
            className={`pf-wizard-progressive__panel pf-wizard-progressive__panel--${index}`}
          >
            <h5>Progressive Stage {index + 1}</h5>
            <p>Progressive flow content placeholder that builds understanding step by step.</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export const metadata = {
  id: 'modal-orchestration__multi-step-progressive',
  title: 'Multi-Step Progressive Flow',
  description: 'Progressive disclosure wizard with animated step indicators and content panels',
  tags: ['css'],
} satisfies AnimationMetadata
