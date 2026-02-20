import './ModalOrchestrationGridHighlight.css'

/**
 *
 */
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
            background: `linear-gradient(135deg, var(--pf-anim-highlight), var(--pf-anim-highlight-accent))`,
            border: `1px solid var(--pf-anim-highlight-border)`,
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

