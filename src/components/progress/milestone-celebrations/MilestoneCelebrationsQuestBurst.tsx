import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import './milestone-celebrations.css';

export function MilestoneCelebrationsQuestBurst() {
  const glowControls = useAnimation();
  const badgeControls = useAnimation();
  const iconControls = useAnimation();
  const headlineControls = useAnimation();
  const captionControls = useAnimation();
  const effectsRef = useRef<HTMLDivElement>(null);

  const accent = '#47fff4';
  
  const createSparkEffects = () => {
    if (!effectsRef.current) return [];
    
    const sparks = [];
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const distance = 70;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      
      sparks.push(
        <motion.span
          key={`spark-${i}`}
          className="pf-milestone__spark"
          style={{
            background: accent,
            left: '50%',
            top: '50%',
          }}
          initial={{ 
            transform: 'translate(-50%, -50%) scale(0.2)', 
            opacity: 0 
          }}
          animate={{
            transform: [
              'translate(-50%, -50%) scale(0.2)',
              `translate(-50%, -50%) translate(${tx}px, ${ty}px) scale(1)`,
              `translate(-50%, -50%) translate(${tx * 1.25}px, ${ty * 1.25}px) scale(0.3)`
            ],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 0.8,
            delay: i * 0.05,
            times: [0, 0.65, 1],
            ease: [0.68, -0.55, 0.265, 1.55]
          }}
        />
      );
    }
    
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6 + 0.3;
      const radius = 46 + i * 4;
      const tx = Math.cos(angle) * radius;
      const ty = Math.sin(angle) * radius;
      
      sparks.push(
        <motion.span
          key={`star-${i}`}
          className="pf-milestone__star"
          style={{
            background: accent,
            left: '50%',
            top: '50%',
          }}
          initial={{ 
            transform: 'translate(-50%, -50%) scale(0.4)', 
            opacity: 0 
          }}
          animate={{
            transform: [
              'translate(-50%, -50%) scale(0.4)',
              `translate(-50%, -50%) translate(${tx}px, ${ty}px) scale(1)`,
              `translate(-50%, -50%) translate(${tx}px, ${ty}px) scale(0.4)`
            ],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 1.1,
            delay: 0.2 + i * 0.08,
            times: [0, 0.6, 1],
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
      );
    }
    
    return sparks;
  };

  useEffect(() => {
    const startAnimation = () => {
      // Glow animation
      glowControls.start({
        opacity: [0, 0.8, 0],
        scale: [0.6, 1.4, 1.9]
      }, {
        duration: 1.2,
        ease: [0.68, -0.55, 0.265, 1.55]
      });

      // Badge animation
      badgeControls.start({
        translateY: [-14, 0],
        scale: [0.9, 1]
      }, {
        duration: 0.6,
        ease: [0.215, 0.610, 0.355, 1.000]
      });

      // Icon animation
      iconControls.start({
        scale: [0.6, 1.18, 1],
        rotate: [-6, 0, 4, 0]
      }, {
        duration: 0.7,
        ease: [0.68, -0.55, 0.265, 1.55]
      });

      // Headline animation
      headlineControls.start({
        opacity: [0, 1],
        translateY: [6, 0]
      }, {
        duration: 0.6,
        delay: 0.1,
        ease: [0.4, 0.0, 0.2, 1]
      });

      // Caption animation
      captionControls.start({
        opacity: [0, 1],
        translateY: [10, 0]
      }, {
        duration: 0.6,
        delay: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      });
    };

    startAnimation();
  }, [glowControls, badgeControls, iconControls, headlineControls, captionControls]);

  return (
    <div 
      className="pf-milestone" 
      data-animation-id="milestone-celebrations__quest-burst"
      style={{ '--pf-milestone-accent': accent } as React.CSSProperties}
    >
      <div className="pf-milestone__visuals">
        <motion.div 
          className="pf-milestone__glow"
          style={{
            background: `radial-gradient(circle, rgba(71, 255, 244, 0.55), rgba(236, 195, 255, 0))`
          }}
          animate={glowControls}
          initial={{ opacity: 0, scale: 0.6 }}
        />
        
        <div className="pf-milestone__effects" ref={effectsRef}>
          {createSparkEffects()}
        </div>
        
        <div className="pf-milestone__content">
          <motion.div 
            className="pf-milestone__badge"
            animate={badgeControls}
            initial={{ translateY: -14, scale: 0.9 }}
          >
            Quest Complete
          </motion.div>
          
          <motion.div 
            className="pf-milestone__icon"
            animate={iconControls}
            initial={{ scale: 0.6, rotate: -6 }}
          >
            ⚔️
          </motion.div>
          
          <motion.div 
            className="pf-milestone__headline"
            animate={headlineControls}
            initial={{ opacity: 0, translateY: 6 }}
          >
            Quest Burst
          </motion.div>
          
          <motion.div 
            className="pf-milestone__caption"
            animate={captionControls}
            initial={{ opacity: 0, translateY: 10 }}
          >
            Mission reward unlocked.
          </motion.div>
        </div>
      </div>
    </div>
  );
}
