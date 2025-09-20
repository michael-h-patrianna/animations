import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import './modal-orchestration.css';

export function ModalOrchestrationStaggerInview() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const tileVariants = {
    hidden: { 
      opacity: 0,
      y: 60,
      scale: 0.8
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const tiles = Array.from({ length: 12 }, (_, index) => ({
    id: index,
    title: `Tile ${index + 1}`,
    content: `Content for tile ${index + 1}`
  }));

  return (
    <div 
      ref={containerRef}
      className="pf-stagger-container"
      data-animation-id="modal-orchestration__stagger-inview"
    >
      <motion.div 
        className="pf-stagger-grid"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {tiles.map((tile) => (
          <motion.div
            key={tile.id}
            className="pf-stagger-tile"
            variants={tileVariants}
          >
            <h5>{tile.title}</h5>
            <p>{tile.content}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}