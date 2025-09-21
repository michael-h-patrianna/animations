import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './modal-orchestration.css';

export function ModalOrchestrationTabMorph() {
  const tabs = 4;
  const [activeTab, setActiveTab] = useState(0);
  
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
        ease: [0.34, 1.56, 0.64, 1] as const // pop easing
      }
    }
  };

  const panelVariants = {
    initial: { 
      x: 300,
      opacity: 0 
    },
    animate: { 
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    },
    exit: {
      x: -300,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94] as const
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
            className={`pf-tabs__tab${index === activeTab ? ' pf-tabs__tab--active' : ''}`}
            variants={tabVariants}
            onClick={() => setActiveTab(index)}
          >
            Tab {index + 1}
          </motion.div>
        ))}
      </div>
      
      <div className="pf-tabs__content">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            className="pf-tabs__panel"
            variants={panelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <h5>Content {activeTab + 1}</h5>
            <p>Tab morph content for tab {activeTab + 1}. Click tabs to see the swipe animation between different content panels.</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
