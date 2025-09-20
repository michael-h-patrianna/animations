import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import './milestone-celebrations.css';

export function MilestoneCelebrationsLoyaltyTier() {
  const glowControls = useAnimation();
  const badgeControls = useAnimation();
  const iconControls = useAnimation();
  const headlineControls = useAnimation();
  const captionControls = useAnimation();
  const effectsRef = useRef<HTMLDivElement>(null);

  const accent = '#c6ff77';
  
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const createRingEffects = () => {
    if (!effectsRef.current) return [];
    
    const effects = [];
    
    // 3 dashed rings expanding
    for (let r = 0; r < 3; r++) {
      const size = 160 + r * 40;
      effects.push(
        <motion.span
          key={`ring-${r}`}
          className="pf-milestone__ring"
          style={{
            left: '50%',
            top: '50%',
            width: `${size}px`,
            height: `${size}px`,
            border: `2px dashed ${hexToRgba(accent, 0.45)}`,
          }}
          initial={{ 
            opacity: 0, 
            transform: 'translate(-50%, -50%) scale(0.75)' 
          }}
          animate={{
            opacity: [0, 0.6, 0],
            transform: [
              'translate(-50%, -50%) scale(0.75)',
              'translate(-50%, -50%) scale(1)',
              'translate(-50%, -50%) scale(1.25)'
            ]
          }}
          transition={{
            duration: 1.6,
            delay: r * 0.18,
            times: [0, 0.6, 1],
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
      );
    }
    
    // 4 stars
    for (let i = 0; i < 4; i++) {
      const angle = (Math.PI * 2 * i) / 4;
      const radius = 80;
      const tx = Math.cos(angle) * radius;
      const ty = Math.sin(angle) * 28;
      
      effects.push(
        <motion.span
          key={`star-${i}`}
          className="pf-milestone__star"
          style={{
            background: hexToRgba(accent, 0.9),
            left: '50%',
            top: '35%',
          }}
          initial={{ 
            opacity: 0, 
            transform: 'translate(-50%, -50%) scale(0.5)' 
          }}
          animate={{
            opacity: [0, 1, 0],
            transform: [
              'translate(-50%, -50%) scale(0.5)',
              `translate(-50%, -50%) translate(${tx}px, ${ty}px) scale(1)`,
              `translate(-50%, -50%) translate(${tx}px, ${ty}px) scale(0.5)`
            ]
          }}
          transition={{
            duration: 1.4,
            delay: 0.25 + i * 0.12,
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
        opacity: [0, 0.85, 0],
        scale: [0.7, 1.3, 1.8]
      }, {
        duration: 1.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      });

      // Badge animation
      badgeControls.start({
        rotate: [0, 6, -4, 0],
        scale: [0.9, 1.1, 1]
      }, {
        duration: 0.9,
        ease: [0.68, -0.55, 0.265, 1.55]
      });

      // Icon animation
      iconControls.start({
        translateY: [6, -6, 0],
        rotate: [0, -8, 0]
      }, {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      });

      // Headline animation with letter spacing
      headlineControls.start({
        letterSpacing: ['0.12em', '0.3em', '0.14em']
      }, {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      });

      // Caption animation
      captionControls.start({
        opacity: [0, 1],
        translateY: [8, 0]
      }, {
        duration: 0.7,
        delay: 0.2,
        ease: [0.4, 0.0, 0.2, 1]
      });
    };

    startAnimation();
  }, [glowControls, badgeControls, iconControls, headlineControls, captionControls]);

  return (
    <div 
      className="pf-milestone" 
      data-animation-id="milestone-celebrations__loyalty-tier"
      style={{ '--pf-milestone-accent': accent } as React.CSSProperties}
    >
      <div className="pf-milestone__visuals">
        <motion.div 
          className="pf-milestone__glow"
          style={{
            background: `radial-gradient(circle, rgba(198, 255, 119, 0.55), rgba(236, 195, 255, 0))`
          }}
          animate={glowControls}
          initial={{ opacity: 0, scale: 0.7 }}
        />
        
        <div className="pf-milestone__effects" ref={effectsRef}>
          {createRingEffects()}
        </div>
        
        <div className="pf-milestone__content">
          <motion.div 
            className="pf-milestone__badge"
            animate={badgeControls}
            initial={{ rotate: 0, scale: 0.9 }}
          >
            Loyalty Tier
          </motion.div>
          
          <motion.div 
            className="pf-milestone__icon"
            animate={iconControls}
            initial={{ translateY: 6, rotate: 0 }}
          >
            🏅
          </motion.div>
          
          <motion.div 
            className="pf-milestone__headline"
            animate={headlineControls}
            initial={{ letterSpacing: '0.12em' }}
          >
            Loyalty Tier Upgrade
          </motion.div>
          
          <motion.div 
            className="pf-milestone__caption"
            animate={captionControls}
            initial={{ opacity: 0, translateY: 8 }}
          >
            Tier bonus multiplier active.
          </motion.div>
        </div>
      </div>
    </div>
  );
}
