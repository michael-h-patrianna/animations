import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import './milestone-celebrations.css';

export function MilestoneCelebrationsBadgeGlow() {
  const glowControls = useAnimation();
  const badgeControls = useAnimation();
  const iconControls = useAnimation();
  const headlineControls = useAnimation();
  const captionControls = useAnimation();
  const effectsRef = useRef<HTMLDivElement>(null);

  const accent = '#ecc3ff';
  
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const createHaloEffects = () => {
    if (!effectsRef.current) return [];
    
    const effects = [];
    
    // 2 expanding halos
    for (let i = 0; i < 2; i++) {
      const size = 200 + i * 60;
      effects.push(
        <motion.span
          key={`halo-${i}`}
          className="pf-milestone__halo"
          style={{
            left: '50%',
            top: '50%',
            width: `${size}px`,
            height: `${size}px`,
            border: `2px solid ${hexToRgba(accent, 0.35)}`,
          }}
          initial={{ 
            opacity: 0, 
            transform: 'translate(-50%, -50%) scale(0.7)' 
          }}
          animate={{
            opacity: [0, 0.45, 0],
            transform: [
              'translate(-50%, -50%) scale(0.7)',
              'translate(-50%, -50%) scale(1)',
              'translate(-50%, -50%) scale(1.2)'
            ]
          }}
          transition={{
            duration: 1.4,
            delay: i * 0.2,
            times: [0, 0.6, 1],
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
      );
    }
    
    // 6 sparks in circle pattern
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6;
      const radius = 60;
      const tx = Math.cos(angle) * radius;
      const ty = Math.sin(angle) * radius;
      
      effects.push(
        <motion.span
          key={`spark-${i}`}
          className="pf-milestone__spark"
          style={{
            background: hexToRgba(accent, 0.8),
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
              `translate(-50%, -50%) translate(${tx}px, ${ty}px) scale(0.4)`
            ]
          }}
          transition={{
            duration: 1.1,
            delay: 0.2 + i * 0.1,
            times: [0, 0.6, 1],
            ease: [0.25, 0.46, 0.45, 0.94]
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
        opacity: [0, 0.8, 0.2],
        scale: [0.5, 1.35, 1.7]
      }, {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      });

      // Badge animation
      badgeControls.start({
        scale: [0.95, 1.12, 1],
        filter: ['brightness(1)', 'brightness(1.25)', 'brightness(1)']
      }, {
        duration: 0.8,
        ease: [0.4, 0.0, 0.2, 1]
      });

      // Icon animation
      iconControls.start({
        scale: [0.9, 1.18, 1],
        rotate: [0, 8, -6, 0]
      }, {
        duration: 0.8,
        ease: [0.68, -0.55, 0.265, 1.55]
      });

      // Headline animation
      headlineControls.start({
        opacity: [0, 1],
        scale: [0.93, 1]
      }, {
        duration: 0.7,
        ease: [0.215, 0.610, 0.355, 1.000]
      });

      // Caption animation
      captionControls.start({
        opacity: [0, 1],
        translateY: [10, 0]
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
      data-animation-id="milestone-celebrations__badge-glow"
      style={{ '--pf-milestone-accent': accent } as React.CSSProperties}
    >
      <div className="pf-milestone__visuals">
        <motion.div 
          className="pf-milestone__glow"
          style={{
            background: `radial-gradient(circle, rgba(236, 195, 255, 0.55), rgba(236, 195, 255, 0))`
          }}
          animate={glowControls}
          initial={{ opacity: 0, scale: 0.5 }}
        />
        
        <div className="pf-milestone__effects" ref={effectsRef}>
          {createHaloEffects()}
        </div>
        
        <div className="pf-milestone__content">
          <motion.div 
            className="pf-milestone__badge"
            animate={badgeControls}
            initial={{ scale: 0.95, filter: 'brightness(1)' }}
          >
            Badge Glow
          </motion.div>
          
          <motion.div 
            className="pf-milestone__icon"
            animate={iconControls}
            initial={{ scale: 0.9, rotate: 0 }}
          >
            🔰
          </motion.div>
          
          <motion.div 
            className="pf-milestone__headline"
            animate={headlineControls}
            initial={{ opacity: 0, scale: 0.93 }}
          >
            Badge Glow
          </motion.div>
          
          <motion.div 
            className="pf-milestone__caption"
            animate={captionControls}
            initial={{ opacity: 0, translateY: 10 }}
          >
            Badge prestige increased.
          </motion.div>
        </div>
      </div>
    </div>
  );
}
