import { motion } from 'framer-motion';
import './modal-orchestration.css';

export function ModalOrchestrationSelectionGrid() {
  const items = 6;
  
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.26,
        delayChildren: 0
      }
    }
  };

  const itemVariants = {
    initial: { 
      y: 16, 
      opacity: 0 
    },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.21, // 420ms * 0.5 (grid-cascade uses default pattern)
        ease: [0.25, 0.46, 0.45, 0.94] // entrance easing
      }
    }
  };

  return (
    <motion.div 
      className="pf-grid"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      data-animation-id="modal-orchestration__selection-grid"
    >
      {Array.from({ length: items }, (_, index) => (
        <motion.div 
          key={index} 
          className="pf-grid__item"
          variants={itemVariants}
        >
          <div>
            <strong>Option {index + 1}</strong><br />
            Select item
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
