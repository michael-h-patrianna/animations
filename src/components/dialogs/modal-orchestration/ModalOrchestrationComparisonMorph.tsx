import { motion } from 'framer-motion';
import './modal-orchestration.css';

export function ModalOrchestrationComparisonMorph() {
  const panes = 2;

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.26,
        delayChildren: 0
      }
    }
  };

  const paneVariants = {
    initial: {
      rotate: -6,
      scale: 0.82,
      opacity: 0
    },
    animate: {
      rotate: 0,
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.312, // 520ms * 0.6 (morph pattern)
        ease: [0.68, -0.55, 0.265, 1.55] as const // vibrant easing
      }
    }
  };

  return (
    <motion.div
      className="pf-comparison"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      data-animation-id="modal-orchestration__comparison-morph"
    >
      {Array.from({ length: panes }, (_, index) => (
        <motion.div
          key={index}
          className="pf-comparison__pane"
          variants={paneVariants}
        >
          <h5>{index === 0 ? 'Option A' : 'Option B'}</h5>
          <p>
            {index === 0
              ? 'Comparison pane showcasing the first option with detailed information and benefits.'
              : 'Alternative pane demonstrating the second option with different features and advantages.'
            }
          </p>
          <div style={{
            marginTop: '16px',
            padding: '8px 12px',
            background: 'rgba(236, 195, 255, 0.1)',
            borderRadius: '6px',
            fontSize: '12px'
          }}>
            {index === 0 ? 'Primary choice' : 'Alternative choice'}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
