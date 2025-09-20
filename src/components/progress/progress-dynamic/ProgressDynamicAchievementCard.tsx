import React from 'react';
import { motion } from 'framer-motion';
import './progress-dynamic.css';

export function ProgressDynamicAchievementCard() {
  return (
    <div data-animation-id="progress-dynamic__achievement-card">
      <motion.div
        className="achievement-card"
        initial={{ 
          x: -300, 
          rotateY: -90, 
          opacity: 0 
        }}
        animate={{ 
          x: [20, 0], 
          rotateY: [10, 0], 
          opacity: 1 
        }}
        transition={{
          duration: 2,
          ease: [0.25, 0.46, 0.45, 0.94],
          times: [0.7, 1]
        }}
        style={{
          width: '200px',
          height: '120px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '1000px'
        }}
      >
        {/* Trophy Icon */}
        <motion.div
          className="trophy-icon"
          initial={{ scale: 0 }}
          animate={{ 
            scale: [1.3, 1] 
          }}
          transition={{
            duration: 1.6,
            delay: 0.4, // 20% of 2s
            ease: "easeOut",
            times: [0.7, 1]
          }}
        >
          🏆
        </motion.div>

        {/* Achievement Title */}
        <div className="achievement-title">
          First Victory!
        </div>

        {/* Achievement Description */}
        <div className="achievement-description">
          You earned your first achievement!
        </div>
      </motion.div>
    </div>
  );
}
