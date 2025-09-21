import { motion } from 'framer-motion';
import { useState } from 'react';
import './modal-orchestration.css';

export function ModalOrchestrationFlipReveal() {
  const [flippedTiles, setFlippedTiles] = useState<Set<number>>(new Set());

  const tiles = Array.from({ length: 6 }, (_, index) => ({
    id: index,
    frontTitle: `Card ${index + 1}`,
    frontContent: `Click to flip`,
    backTitle: `Revealed`,
    backContent: `Hidden content`
  }));

  const toggleFlip = (tileId: number) => {
    setFlippedTiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tileId)) {
        newSet.delete(tileId);
      } else {
        newSet.add(tileId);
      }
      return newSet;
    });
  };

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
      rotateY: -180
    },
    animate: {
      scale: 1,
      opacity: 1,
      rotateY: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  return (
    <motion.div
      className="pf-flip-container"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      data-animation-id="modal-orchestration__flip-reveal"
    >
      <div className="pf-flip-grid">
  {tiles.map((tile) => {
          const isFlipped = flippedTiles.has(tile.id);

          return (
            <motion.div
              key={tile.id}
              className="pf-flip-tile-container"
              variants={tileVariants}
              onClick={() => toggleFlip(tile.id)}
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 300, damping: 25 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="pf-flip-tile"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front Face */}
                <div className="pf-flip-face pf-flip-front">
                  <h5>{tile.frontTitle}</h5>
                  <p>{tile.frontContent}</p>
                  <div className="pf-flip-indicator">↻</div>
                </div>

                {/* Back Face */}
                <div className="pf-flip-face pf-flip-back">
                  <h5>{tile.backTitle}</h5>
                  <p>{tile.backContent}</p>
                  <div className="pf-flip-indicator">✓</div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
