import type { AnimationMetadata } from '@/types/animation'
import './ModalOrchestrationGridHighlight.css'

export function ModalOrchestrationGridHighlight() {
  const items = 5

  return (
    <div
      className="pf-grid-highlight"
      data-animation-id="modal-orchestration__grid-highlight"
    >
      {Array.from({ length: items }, (_, index) => (
        <div
          key={index}
          className={`pf-grid-highlight__item pf-grid-highlight__item--${index}`}
          style={{
            background: `linear-gradient(135deg, rgba(236, 195, 255, 0.08), rgba(200, 53, 88, 0.12))`,
            border: `1px solid rgba(236, 195, 255, 0.16)`,
          }}
        >
          <div>
            <strong>Item {index + 1}</strong>
            <br />
            Highlight sweep
          </div>
        </div>
      ))}
    </div>
  )
}

export const metadata = {
  id: 'modal-orchestration__grid-highlight',
  title: 'Grid Highlight Sweep',
  description: 'Grid tiles that animate with staggered highlight sweep effect',
  tags: ['css'],
} satisfies AnimationMetadata
