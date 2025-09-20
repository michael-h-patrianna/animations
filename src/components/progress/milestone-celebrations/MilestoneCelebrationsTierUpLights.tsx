import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import './milestone-celebrations.css';

export function MilestoneCelebrationsTierUpLights() {
  const glowControls = useAnimation();
  const badgeControls = useAnimation();
  const iconControls = useAnimation();
  const headlineControls = useAnimation();
  const captionControls = useAnimation();
  const effectsRef = useRef<HTMLDivElement>(null);

  const accent = '#c6ff77';

  const createLightEffects = () => {
    if (!effectsRef.current) return [];
    
    const effects = [];
    const offsets = [-70, -25, 25, 70];
    
    // 4 vertical light beams
    offsets.forEach((offset, index) => {
      effects.push(
        <motion.span
          key={`light-${index}`}
          className="pf-milestone__light"
          style={{
            left: `calc(50% + ${offset}px)`,
          }}
          initial={{ 
            opacity: 0, 
            transform: 'translate(-50%, 50px) scaleY(0.2)' 
          }}
          animate={{
            opacity: [0, 0.9, 0],
            transform: [
              'translate(-50%, 50px) scaleY(0.2)',
              'translate(-50%, 0) scaleY(1)',
              'translate(-50%, -40px) scaleY(0.6)'
            ]
          }}
          transition={{
            duration: 1.2,
            delay: index * 0.15,
            times: [0, 0.55, 1],
            ease: [0.215, 0.610, 0.355, 1.000]
          }}
        />
      );
    });
    
    return effects;
  };

  useEffect(() => {
    const startAnimation = () => {
      // Glow animation
      glowControls.start({
        opacity: [0, 0.9, 0],
        scale: [0.7, 1.5, 2]
      }, {
        duration: 1.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      });

      // Badge animation with box shadow
      badgeControls.start({
        boxShadow: [
          '0 0 0 rgba(198,255,119,0)', 
          '0 0 24px rgba(198,255,119,0.5)', 
          '0 0 0 rgba(198,255,119,0)'
        ]
      }, {
        duration: 1,
        ease: [0.4, 0.0, 0.2, 1]
      });

      // Icon animation
      iconControls.start({
        translateY: [12, -6, 0],
        scale: [0.9, 1.1, 1]
      }, {
        duration: 0.8,
        ease: [0.68, -0.55, 0.265, 1.55]
      });

      // Headline animation
      headlineControls.start({
        opacity: [0, 1],
        translateY: [10, 0]
      }, {
        duration: 0.7,
        delay: 0.1,
        ease: [0.215, 0.610, 0.355, 1.000]
      });

      // Caption animation
      captionControls.start({
        opacity: [0, 1],
        translateY: [6, 0]
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
      data-animation-id="milestone-celebrations__tier-up-lights"
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
          {createLightEffects()}
        </div>
        
        <div className="pf-milestone__content">
          <motion.div 
            className="pf-milestone__badge"
            animate={badgeControls}
            initial={{ boxShadow: '0 0 0 rgba(198,255,119,0)' }}
          >
            Tier Lights
          </motion.div>
          
          <motion.div 
            className="pf-milestone__icon"
            animate={iconControls}
            initial={{ translateY: 12, scale: 0.9 }}
          >
            ⬆️
          </motion.div>
          
          <motion.div 
            className="pf-milestone__headline"
            animate={headlineControls}
            initial={{ opacity: 0, translateY: 10 }}
          >
            Tier Up Lights
          </motion.div>
          
          <motion.div 
            className="pf-milestone__caption"
            animate={captionControls}
            initial={{ opacity: 0, translateY: 6 }}
          >
            Streak bonus amplified.
          </motion.div>
        </div>
      </div>
    </div>
  );
}
