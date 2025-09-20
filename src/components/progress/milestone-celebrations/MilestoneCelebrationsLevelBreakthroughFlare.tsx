import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import './milestone-celebrations.css';

export function MilestoneCelebrationsLevelBreakthroughFlare() {
  const glowControls = useAnimation();
  const badgeControls = useAnimation();
  const iconControls = useAnimation();
  const headlineControls = useAnimation();
  const captionControls = useAnimation();
  const effectsRef = useRef<HTMLDivElement>(null);

  const accent = '#ffce1a';
  
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const createBeamEffects = () => {
    if (!effectsRef.current) return [];
    
    const effects = [];
    const angles = [-32, -10, 10, 32];
    
    // 4 light beams at angles
    angles.forEach((deg, index) => {
      effects.push(
        <motion.span
          key={`beam-${index}`}
          className="pf-milestone__beam"
          style={{
            left: '50%',
            top: '65%',
            background: `linear-gradient(180deg, ${hexToRgba(accent, 0.75)}, rgba(255, 206, 26, 0))`,
          }}
          initial={{ 
            opacity: 0,
            transform: `translate(-50%, -100%) rotate(${deg}deg) scaleY(0.1)`
          }}
          animate={{
            opacity: [0, 0.85, 0],
            transform: [
              `translate(-50%, -100%) rotate(${deg}deg) scaleY(0.1)`,
              `translate(-50%, -100%) rotate(${deg}deg) scaleY(1)`,
              `translate(-50%, -100%) rotate(${deg}deg) scaleY(0.4)`
            ]
          }}
          transition={{
            duration: 1.1,
            delay: index * 0.12,
            times: [0, 0.55, 1],
            ease: [0.68, -0.55, 0.265, 1.55]
          }}
        />
      );
    });
    
    // 6 sparks burst upward
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6;
      const tx = Math.cos(angle) * 48;
      const ty = Math.sin(angle) * 32;
      
      effects.push(
        <motion.span
          key={`spark-${i}`}
          className="pf-milestone__spark"
          style={{
            background: '#ffd966',
            left: '50%',
            top: '42%',
          }}
          initial={{ 
            opacity: 0, 
            transform: 'translate(-50%, -50%) scale(0.3)' 
          }}
          animate={{
            opacity: [0, 1, 0],
            transform: [
              'translate(-50%, -50%) scale(0.3)',
              `translate(-50%, -50%) translate(${tx}px, ${ty}px) scale(1)`,
              `translate(-50%, -50%) translate(${tx * 1.2}px, ${ty * 1.2}px) scale(0.4)`
            ]
          }}
          transition={{
            duration: 0.9,
            delay: 0.2 + i * 0.08,
            times: [0, 0.6, 1],
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
        opacity: [0, 1, 0],
        scale: [0.8, 1.7, 2.2]
      }, {
        duration: 1.1,
        ease: [0.68, -0.55, 0.265, 1.55]
      });

      // Badge animation
      badgeControls.start({
        translateY: [10, 0],
        scale: [1.2, 1],
        filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
      }, {
        duration: 0.6,
        ease: [0.68, -0.55, 0.265, 1.55]
      });

      // Icon animation
      iconControls.start({
        translateY: [16, -6, 0],
        scale: [0.8, 1.1, 1]
      }, {
        duration: 0.7,
        ease: [0.68, -0.55, 0.265, 1.55]
      });

      // Headline animation with color change
      headlineControls.start({
        scale: [0.92, 1.06, 1],
        color: ['var(--pf-base-60)', '#ffce1a', 'var(--pf-base-60)']
      }, {
        duration: 0.9,
        ease: [0.4, 0.0, 0.2, 1]
      });

      // Caption animation
      captionControls.start({
        opacity: [0, 1],
        translateY: [12, 0]
      }, {
        duration: 0.6,
        delay: 0.2,
        ease: [0.215, 0.610, 0.355, 1.000]
      });
    };

    startAnimation();
  }, [glowControls, badgeControls, iconControls, headlineControls, captionControls]);

  return (
    <div 
      className="pf-milestone" 
      data-animation-id="milestone-celebrations__level-breakthrough-flare"
      style={{ '--pf-milestone-accent': accent } as React.CSSProperties}
    >
      <div className="pf-milestone__visuals">
        <motion.div 
          className="pf-milestone__glow"
          style={{
            background: `radial-gradient(circle, rgba(255, 206, 26, 0.55), rgba(236, 195, 255, 0))`
          }}
          animate={glowControls}
          initial={{ opacity: 0, scale: 0.8 }}
        />
        
        <div className="pf-milestone__effects" ref={effectsRef}>
          {createBeamEffects()}
        </div>
        
        <div className="pf-milestone__content">
          <motion.div 
            className="pf-milestone__badge"
            animate={badgeControls}
            initial={{ translateY: 10, scale: 1.2 }}
          >
            Level Up
          </motion.div>
          
          <motion.div 
            className="pf-milestone__icon"
            animate={iconControls}
            initial={{ translateY: 16, scale: 0.8 }}
          >
            🚀
          </motion.div>
          
          <motion.div 
            className="pf-milestone__headline"
            animate={headlineControls}
            initial={{ scale: 0.92, color: 'var(--pf-base-60)' }}
          >
            Breakthrough Flare
          </motion.div>
          
          <motion.div 
            className="pf-milestone__caption"
            animate={captionControls}
            initial={{ opacity: 0, translateY: 12 }}
          >
            Power boost unlocked.
          </motion.div>
        </div>
      </div>
    </div>
  );
}
