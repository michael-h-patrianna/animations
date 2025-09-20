import { motion } from 'framer-motion';
import './modal-orchestration.css';

export function ModalOrchestrationTabMorph() {
  const tabs = 4;
  
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.26,
        delayChildren: 0
      }
    }
  };

  const tabVariants = {
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
      rotate: -6,
      scale: 0.82, 
      opacity: 0 
    },
    animate: { 
      rotate: 0,
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.252, // 420ms * 0.6
        ease: [0.25, 0.46, 0.45, 0.94] // entrance easing
      }
    }
  };

  return (
    <motion.div 
      className="pf-tabs"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      data-animation-id="modal-orchestration__tab-morph"
    >
      <div className="pf-tabs__nav">
        {Array.from({ length: tabs }, (_, index) => (
          <motion.div 
            key={index} 
            className="pf-tabs__tab"
            variants={tabVariants}
          >
            Tab {index + 1}
          </motion.div>
        ))}
      </div>
      
      <div className="pf-tabs__content">
        {Array.from({ length: tabs }, (_, index) => (
          <motion.div 
            key={index} 
            className="pf-tabs__panel"
            variants={panelVariants}
          >
            <h5>Content {index + 1}</h5>
            <p>Tab morph content placeholder to illustrate morphing animation between tabs.</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
