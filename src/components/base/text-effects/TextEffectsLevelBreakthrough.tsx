import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';
import './text-effects.css';

export function TextEffectsLevelBreakthrough() {
  const levelControls = useAnimation();
  const surge1Controls = useAnimation();
  const surge2Controls = useAnimation();
  const levelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animateBreakthrough = async () => {
      // Reset initial state
      if (levelRef.current) {
        levelRef.current.textContent = 'LEVEL 1';
        levelRef.current.style.textShadow = '';
      }

      // Reset surge controls to initial state
      surge1Controls.set({ opacity: 0, scale: 0.5 });
      surge2Controls.set({ opacity: 0, scale: 0.5 });

      // Shake and breakthrough effect - faster timing
      levelControls.start({
        scale: [1, 0.9, 0.9, 0.9, 1.5, 1],
        rotate: [0, -2, 2, -2, 0, 0],
        transition: {
          duration: 1,
          ease: [0.68, -0.55, 0.265, 1.55],
          times: [0, 0.1, 0.2, 0.3, 0.5, 1]
        }
      });

      // First surge ring - immediate start (single pulse)
      surge1Controls.start({
        opacity: [0, 1, 0],
        scale: [0.5, 1.5, 2],
        transition: {
          duration: 0.8,
          ease: "easeOut",
          times: [0, 0.5, 1]
        }
      });

      // Second surge ring - short staggered delay (single pulse)
      setTimeout(() => {
        surge2Controls.start({
          opacity: [0, 1, 0],
          scale: [0.5, 1.5, 2],
          transition: {
            duration: 0.8,
            ease: "easeOut",
            times: [0, 0.5, 1]
          }
        });
      }, 100); // Shorter stagger - just 100ms

      // Change level text and add glow - after breakthrough peaks
      setTimeout(() => {
        if (levelRef.current) {
          levelRef.current.textContent = 'LEVEL 2';
          levelRef.current.style.textShadow = '0 0 30px rgba(255, 206, 26, 0.8)';
        }
      }, 600); // After the visual climax at 500ms
    };

    animateBreakthrough();
  }, [levelControls, surge1Controls, surge2Controls]);

  return (
    <div
      className="pf-breakthrough-container"
      data-animation-id="text-effects__level-breakthrough"
    >
      {/* First surge ring - outer ring with 4-6px thick bands */}
      <motion.div
        className="pf-surge-lines"
        animate={surge1Controls}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle, transparent 75%, #ffce1a 76%, transparent 82%)',
          opacity: 0
        }}
      />

      {/* Second surge ring - inner ring with 4-6px thick bands */}
      <motion.div
        className="pf-surge-lines"
        animate={surge2Controls}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle, transparent 65%, #ffce1a 66%, transparent 72%)',
          opacity: 0
        }}
      />

      {/* Level display */}
      <motion.div
        ref={levelRef}
        className="pf-level-breakthrough"
        animate={levelControls}
      >
        LEVEL 1
      </motion.div>
    </div>
  );
}
