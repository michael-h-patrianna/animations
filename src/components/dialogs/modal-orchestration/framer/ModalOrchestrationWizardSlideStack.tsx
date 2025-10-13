import { motion } from 'framer-motion'
import './ModalOrchestrationWizardSlideStack.css'

export function ModalOrchestrationWizardSlideStack() {
  const steps = 3

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.26,
        delayChildren: 0,
      },
    },
  }

  // Step variants were previously defined but unused in this demo

  const panelVariants = {
    initial: {
      x: 48,
      scale: 0.94,
      opacity: 0,
    },
    animate: {
      x: 0,
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.312, // 520ms * 0.6
        ease: [0.25, 0.46, 0.45, 0.94] as const, // entrance easing
      },
    },
  }

  return (
    <motion.div
      className="pf-wizard"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      data-animation-id="modal-orchestration__wizard-slide-stack"
    >
      <div className="pf-wizard__panels">
        {Array.from({ length: steps }, (_, index) => (
          <motion.div key={index} className="pf-wizard__panel" variants={panelVariants}>
            <h5>Stage {index + 1}</h5>
            <p>Guided content placeholder to illustrate flow animation.</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
