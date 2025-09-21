import { motion } from 'framer-motion';
import './modal-orchestration.css';

export function ModalOrchestrationMagneticHover() {
  const tiles = Array.from({ length: 6 }, (_, index) => ({
    id: index,
    title: `Hover ${index + 1}`,
    content: `Smooth hover effects`
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
      opacity: 0,
      rotateX: -90
    },
    animate: {
      scale: 1,
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  return (
    <motion.div
      className="pf-magnetic-container"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      data-animation-id="modal-orchestration__magnetic-hover"
    >
      <div className="pf-magnetic-grid">
  {tiles.map((tile) => (
          <motion.div
            key={tile.id}
            className="pf-magnetic-tile"
            variants={tileVariants}
            whileHover={{
              scale: 1.1,
              y: -12,
              rotateY: 5,
              rotateX: 5,
              boxShadow: "0 20px 40px rgba(196, 122, 229, 0.3)",
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
              }
            }}
            whileTap={{
              scale: 0.95,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 25
              }
            }}
          >
            <h5>{tile.title}</h5>
            <p>{tile.content}</p>
            <div className="pf-magnetic-indicator">✨</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
