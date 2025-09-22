import { motion } from 'framer-motion'
import './ModalOrchestrationGridHighlight.css'

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
    <motion.div
      className="pf-grid"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      data-animation-id="modal-orchestration__grid-highlight"
      style={{ gridTemplateColumns: 'repeat(2, 1fr)' }} // 5 items in 2 columns
    >
      {Array.from({ length: items }, (_, index) => (
        <motion.div
          key={index}
          className="pf-grid__item"
          variants={itemVariants}
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
        </motion.div>
      ))}
    </motion.div>
  )
}
