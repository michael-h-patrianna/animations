import { motion } from 'framer-motion';
import './modal-orchestration.css';

export function ModalOrchestrationWizardSlideStack() {
  const steps = 3;
  
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
        ease: [0.34, 1.56, 0.64, 1] // pop easing
      }
    }
  };

  const panelVariants = {
    initial: { 
      x: 48, 
      scale: 0.94, 
      opacity: 0 
    },
    animate: { 
      x: 0, 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.312, // 520ms * 0.6
        ease: [0.25, 0.46, 0.45, 0.94] // entrance easing
      }
    }
  };

  return (
    <motion.div 
      className="pf-wizard"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      data-animation-id="modal-orchestration__wizard-slide-stack"
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
            <h5>Stage {index + 1}</h5>
            <p>Guided content placeholder to illustrate flow animation.</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
