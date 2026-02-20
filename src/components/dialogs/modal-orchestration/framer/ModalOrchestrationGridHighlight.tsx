import * as m from 'motion/react-m'

/**
 *
 */
export function ModalOrchestrationGridHighlight() {
  const items = 5

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.26,
        delayChildren: 0,
      },
    },
  }

  const itemVariants = {
    initial: {
      y: 16,
      opacity: 0,
      scale: 0.9,
    },
    animate: {
      y: 0,
      opacity: 1,
      scale: [0.9, 1.05, 1], // highlight-sweep adds a small scale bounce
      transition: {
        duration: 0.21, // 420ms * 0.5 (highlight-sweep uses default pattern)
        ease: [0.25, 0.46, 0.45, 0.94] as const, // entrance easing
      },
    },
  }

  return (
    <m.div
      className="pf-grid"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      data-animation-id="modal-orchestration__grid-highlight"
      style={{ gridTemplateColumns: 'repeat(2, 1fr)' }} // 5 items in 2 columns
    >
      {Array.from({ length: items }, (_, index) => (
        <m.div
          key={index}
          className="pf-grid__item"
          variants={itemVariants}
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
        </m.div>
      ))}
    </m.div>
  )
}
