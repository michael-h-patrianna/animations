import type { AnimationMetadata } from '@/types/animation'
import './ModalOrchestrationTabSlide.css'

export function ModalOrchestrationTabSlide() {
  const tabs = 3

  return (
    <div
      className="pf-tabs-slide"
      data-animation-id="modal-orchestration__tab-slide"
    >
      <div className="pf-tabs-slide__nav">
        {Array.from({ length: tabs }, (_, index) => (
          <div
            key={index}
            className={`pf-tabs-slide__tab pf-tabs-slide__tab--${index}`}
          >
            Tab {index + 1}
          </div>
        ))}
      </div>

      <div className="pf-tabs-slide__content">
        {Array.from({ length: tabs }, (_, index) => (
          <div
            key={index}
            className={`pf-tabs-slide__panel pf-tabs-slide__panel--${index}`}
          >
            <h5>Panel {index + 1}</h5>
            <p>Tab slide content that swaps with sliding animation between different panels.</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export const metadata = {
  id: 'modal-orchestration__tab-slide',
  title: 'Tab Slide Navigation',
  description: 'Tabbed interface with sliding panel transitions and animated tab indicators',
  tags: ['css'],
} satisfies AnimationMetadata
