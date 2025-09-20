import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import './progress-dynamic.css';

export function ProgressDynamicLevelBreakthrough() {
  const levelControls = useAnimation();
  const surgeControls = useAnimation();
  const levelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animateBreakthrough = async () => {
      // Reset initial state
      if (levelRef.current) {
        levelRef.current.textContent = 'LEVEL 1';
        levelRef.current.style.textShadow = '';
      }

      // Shake and breakthrough effect
      levelControls.start({
        scale: [1, 0.9, 0.9, 0.9, 1.5, 1],
        rotate: [0, -2, 2, -2, 0, 0],
        transition: { 
          duration: 2,
          ease: [0.68, -0.55, 0.265, 1.55],
          times: [0, 0.1, 0.2, 0.3, 0.5, 1]
        }
      });

      // Surge lines explosion
      setTimeout(() => {
        surgeControls.start({
          opacity: [0, 1, 0],
          scale: [0.5, 1.5, 2],
          transition: { 
            duration: 1.4,
            ease: "easeOut",
            times: [0, 0.5, 1]
          }
        });
      }, 600); // Start at 30% of main animation

      // Change level text and add glow
      setTimeout(() => {
        if (levelRef.current) {
          levelRef.current.textContent = 'LEVEL 2';
          levelRef.current.style.textShadow = '0 0 30px rgba(255, 206, 26, 0.8)';
        }
      }, 1000); // 50% of 2000ms
    };

    animateBreakthrough();
  }, [levelControls, surgeControls]);

  return (
    <div 
      style={{ position: 'relative' }}
      data-animation-id="progress-dynamic__level-breakthrough"
    >
      {/* Surge lines background */}
      <motion.div
        className="pf-surge-lines"
        animate={surgeControls}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle, transparent 30%, #ffce1a 31%, transparent 33%, transparent 40%, #ffce1a 41%, transparent 43%)',
          opacity: 0
        }}
      />

      {/* Level display */}
      <motion.div
        ref={levelRef}
        className="pf-level-breakthrough"
        animate={levelControls}
        style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#ffce1a',
          textAlign: 'center',
          padding: '20px',
          position: 'relative',
          zIndex: 2
        }}
      >
        LEVEL 1
      </motion.div>
    </div>
  );
}
