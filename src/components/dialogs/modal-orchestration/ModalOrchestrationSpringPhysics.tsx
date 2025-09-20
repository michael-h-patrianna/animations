import { motion } from 'framer-motion';
import './modal-orchestration.css';

export function ModalOrchestrationSpringPhysics() {
  const tiles = Array.from({ length: 6 }, (_, index) => ({
    id: index,
    title: `Elastic ${index + 1}`,
    content: `Spring bounce effect`
  }));

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const tileVariants = {
    initial: { 
      scale: 0,
      y: -100,
      opacity: 0
    },
    animate: { 
      scale: 1,
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        mass: 1.2
      }
    }
  };

  return (
    <motion.div 
      className="pf-spring-container"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      data-animation-id="modal-orchestration__spring-physics"
    >
      <div className="pf-spring-grid">
        {tiles.map((tile, index) => (
          <motion.div
            key={tile.id}
            className="pf-spring-tile"
            variants={tileVariants}
            whileHover={{ 
              scale: 1.05,
              y: -8,
              transition: { 
                type: "spring", 
                stiffness: 400, 
                damping: 20,
                mass: 0.8
              }
            }}
            whileTap={{ 
              scale: 0.95,
              transition: { 
                type: "spring", 
                stiffness: 600, 
                damping: 25 
              }
            }}
          >
            <h5>{tile.title}</h5>
            <p>{tile.content}</p>
            <div className="pf-spring-indicator">⚡</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}