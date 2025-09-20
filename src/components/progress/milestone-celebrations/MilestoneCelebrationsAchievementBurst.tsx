import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import './milestone-celebrations.css';

export function MilestoneCelebrationsAchievementBurst() {
  const glowControls = useAnimation();
  const badgeControls = useAnimation();
  const iconControls = useAnimation();
  const headlineControls = useAnimation();
  const captionControls = useAnimation();
  const effectsRef = useRef<HTMLDivElement>(null);

  const accent = '#ecc3ff';
  
  const randBetween = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const createStarBurstEffects = () => {
    if (!effectsRef.current) return [];
    
    const effects = [];
    const count = 10;
    
    // 10 stars in circle burst with random radius variation
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const radius = 60 + randBetween(-10, 18);
      const tx = Math.cos(angle) * radius;
      const ty = Math.sin(angle) * radius;
      
      effects.push(
        <motion.span
          key={`star-${i}`}
          className="pf-milestone__star"
          style={{
            background: accent,
            left: '50%',
            top: '50%',
          }}
          initial={{ 
            opacity: 0, 
            transform: 'translate(-50%, -50%) scale(0.4)' 
          }}
          animate={{
            opacity: [0, 1, 0],
            transform: [
              'translate(-50%, -50%) scale(0.4)',
              `translate(-50%, -50%) translate(${tx}px, ${ty}px) scale(1)`,
              `translate(-50%, -50%) translate(${tx * 1.15}px, ${ty * 1.15}px) scale(0.4)`
            ]
          }}
          transition={{
            duration: 1,
            delay: i * 0.06,
            times: [0, 0.55, 1],
            ease: [0.68, -0.55, 0.265, 1.55]
          }}
        />
      );
    }
    
    return effects;
  };

  useEffect(() => {
    const startAnimation = () => {
      // Glow animation
      glowControls.start({
        opacity: [0, 0.7, 0],
        scale: [0.6, 1.4, 1.8]
      }, {
        duration: 1.1,
        ease: [0.4, 0.0, 0.2, 1]
      });

      // Badge animation
      badgeControls.start({
        rotate: [0, -8, 8, 0],
        scale: [1, 1.12, 1]
      }, {
        duration: 0.8,
        ease: [0.4, 0.0, 0.2, 1]
      });

      // Icon animation
      iconControls.start({
        scale: [0.6, 1.2, 1],
        rotate: [0, 12, -6, 0]
      }, {
        duration: 0.8,
        ease: [0.68, -0.55, 0.265, 1.55]
      });

      // Headline animation
      headlineControls.start({
        opacity: [0, 1],
        translateY: [12, 0]
      }, {
        duration: 0.7,
        ease: [0.215, 0.610, 0.355, 1.000]
      });

      // Caption animation
      captionControls.start({
        opacity: [0, 1],
        translateY: [8, 0]
      }, {
        duration: 0.6,
        delay: 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      });
    };

    startAnimation();
  }, [glowControls, badgeControls, iconControls, headlineControls, captionControls]);

  return (
    <div 
      className="pf-milestone" 
      data-animation-id="milestone-celebrations__achievement-burst"
      style={{ '--pf-milestone-accent': accent } as React.CSSProperties}
    >
      <div className="pf-milestone__visuals">
        <motion.div 
          className="pf-milestone__glow"
          style={{
            background: `radial-gradient(circle, rgba(236, 195, 255, 0.55), rgba(236, 195, 255, 0))`
          }}
          animate={glowControls}
          initial={{ opacity: 0, scale: 0.6 }}
        />
        
        <div className="pf-milestone__effects" ref={effectsRef}>
          {createStarBurstEffects()}
        </div>
        
        <div className="pf-milestone__content">
          <motion.div 
            className="pf-milestone__badge"
            animate={badgeControls}
            initial={{ rotate: 0, scale: 1 }}
          >
            Achievement
          </motion.div>
          
          <motion.div 
            className="pf-milestone__icon"
            animate={iconControls}
            initial={{ scale: 0.6, rotate: 0 }}
          >
            🌟
          </motion.div>
          
          <motion.div 
            className="pf-milestone__headline"
            animate={headlineControls}
            initial={{ opacity: 0, translateY: 12 }}
          >
            Achievement Burst
          </motion.div>
          
          <motion.div 
            className="pf-milestone__caption"
            animate={captionControls}
            initial={{ opacity: 0, translateY: 8 }}
          >
            New badge added to your profile.
          </motion.div>
        </div>
      </div>
    </div>
  );
}
