import { motion } from 'framer-motion';
import './modal-orchestration.css';

export function ModalOrchestrationMultiStepProgressive() {
  const steps = 5;

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.26,
        delayChildren: 0
      }
    }
  };

  const stepVariants = {
    initial: {
      scale: 0.9,
      opacity: 0.3
    },
    animate: {
      scale: [0.9, 1.06, 1],
      opacity: [0.3, 1, 1],
      transition: {
        duration: 0.46,
        ease: [0.34, 1.56, 0.64, 1] as const // pop easing
      }
    }
  };

  const panelVariants = {
    initial: {
      y: 16,
      opacity: 0
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.34, // 680ms * 0.5 (progressive pattern)
        ease: [0.25, 0.46, 0.45, 0.94] as const // entrance easing
      }
    }
  };

  return (
    <motion.div
      className="pf-wizard"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      data-animation-id="modal-orchestration__multi-step-progressive"
    >
      <div className="pf-wizard__steps">
        {Array.from({ length: steps }, (_, index) => (
          <motion.div
            key={index}
            className="pf-wizard__step"
            variants={stepVariants}
          >
            Step {index + 1}
          </motion.div>
        ))}
      </div>

      <div className="pf-wizard__panels">
        {Array.from({ length: steps }, (_, index) => (
          <motion.div
            key={index}
            className="pf-wizard__panel"
            variants={panelVariants}
          >
            <h5>Progressive Stage {index + 1}</h5>
            <p>Progressive flow content placeholder that builds understanding step by step.</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
