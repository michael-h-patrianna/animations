import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import './milestone-celebrations.css';

export function MilestoneCelebrationsMilestoneBanner() {
  const glowControls = useAnimation();
  const badgeControls = useAnimation();
  const iconControls = useAnimation();
  const headlineControls = useAnimation();
  const captionControls = useAnimation();
  const effectsRef = useRef<HTMLDivElement>(null);

  const accent = '#47fff4';
  
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const randBetween = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const createBannerEffects = () => {
    if (!effectsRef.current) return [];
    
    const effects = [];
    
    // Left and right ribbons
    effects.push(
      <motion.span
        key="ribbon-left"
        className="pf-milestone__ribbon pf-milestone__ribbon--left"
        style={{
          left: '12%',
          top: '62%',
          background: `linear-gradient(135deg, ${hexToRgba(accent, 0.48)}, ${hexToRgba(accent, 0.12)})`,
        }}
        initial={{ 
          opacity: 0, 
          transform: 'translateX(-80px) rotate(-6deg)' 
        }}
        animate={{
          opacity: [0, 1],
          transform: ['translateX(-80px) rotate(-6deg)', 'translateX(0) rotate(0deg)']
        }}
        transition={{
          duration: 0.6,
          ease: [0.215, 0.610, 0.355, 1.000]
        }}
      />,
      <motion.span
        key="ribbon-right"
        className="pf-milestone__ribbon pf-milestone__ribbon--right"
        style={{
          right: '12%',
          top: '62%',
          background: `linear-gradient(135deg, ${hexToRgba(accent, 0.48)}, ${hexToRgba(accent, 0.12)})`,
        }}
        initial={{ 
          opacity: 0, 
          transform: 'translateX(80px) rotate(6deg)' 
        }}
        animate={{
          opacity: [0, 1],
          transform: ['translateX(80px) rotate(6deg)', 'translateX(0) rotate(0deg)']
        }}
        transition={{
          duration: 0.6,
          ease: [0.215, 0.610, 0.355, 1.000]
        }}
      />
    );
    
    // 10 confetti pieces
    const confettiColors = [accent, '#ecc3ff', '#c83558', '#ffce1a'];
    for (let i = 0; i < 10; i++) {
      const angle = randBetween(-Math.PI / 2, Math.PI / 2);
      const distance = 90 + randBetween(-20, 40);
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const rotate = randBetween(-30, 30);
      const rotateExit = randBetween(-60, 60);
      
      effects.push(
        <motion.span
          key={`confetti-${i}`}
          className="pf-milestone__confetti"
          style={{
            background: confettiColors[i % confettiColors.length],
            left: '50%',
            top: '30%',
          }}
          initial={{ 
            opacity: 0, 
            transform: 'translate(-50%, -50%) rotate(0deg) scale(0.4)' 
          }}
          animate={{
            opacity: [0, 1, 0],
            transform: [
              'translate(-50%, -50%) rotate(0deg) scale(0.4)',
              `translate(-50%, -50%) translate(${tx}px, ${ty}px) rotate(${rotate}deg)`,
              `translate(-50%, -50%) translate(${tx}px, ${ty + 40}px) rotate(${rotateExit}deg)`
            ]
          }}
          transition={{
            duration: 1.1,
            delay: i * 0.06,
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
        opacity: [0.2, 0.6, 0.2],
        scale: [1, 1.08, 1]
      }, {
        duration: 1.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      });

      // Badge animation
      badgeControls.start({
        translateY: [-40, 0],
        opacity: [0, 1]
      }, {
        duration: 0.6,
        ease: [0.215, 0.610, 0.355, 1.000]
      });

      // Icon animation
      iconControls.start({
        scale: [0.7, 1.2, 1],
        rotate: [0, -8, 6, 0]
      }, {
        duration: 0.7,
        ease: [0.68, -0.55, 0.265, 1.55]
      });

      // Headline animation with letter spacing
      headlineControls.start({
        letterSpacing: ['0.08em', '0.22em', '0.12em']
      }, {
        duration: 1.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      });

      // Caption animation
      captionControls.start({
        opacity: [0, 1],
        translateY: [12, 0]
      }, {
        duration: 0.6,
        delay: 0.15,
        ease: [0.25, 0.46, 0.45, 0.94]
      });
    };

    startAnimation();
  }, [glowControls, badgeControls, iconControls, headlineControls, captionControls]);

  return (
    <div 
      className="pf-milestone" 
      data-animation-id="milestone-celebrations__milestone-banner"
      style={{ '--pf-milestone-accent': accent } as React.CSSProperties}
    >
      <div className="pf-milestone__visuals">
        <motion.div 
          className="pf-milestone__glow"
          style={{
            background: `radial-gradient(circle, rgba(71, 255, 244, 0.55), rgba(236, 195, 255, 0))`
          }}
          animate={glowControls}
          initial={{ opacity: 0.2, scale: 1 }}
        />
        
        <div className="pf-milestone__effects" ref={effectsRef}>
          {createBannerEffects()}
        </div>
        
        <div className="pf-milestone__content">
          <motion.div 
            className="pf-milestone__badge"
            animate={badgeControls}
            initial={{ translateY: -40, opacity: 0 }}
          >
            Milestone
          </motion.div>
          
          <motion.div 
            className="pf-milestone__icon"
            animate={iconControls}
            initial={{ scale: 0.7, rotate: 0 }}
          >
            🎉
          </motion.div>
          
          <motion.div 
            className="pf-milestone__headline"
            animate={headlineControls}
            initial={{ letterSpacing: '0.08em' }}
          >
            Milestone Banner
          </motion.div>
          
          <motion.div 
            className="pf-milestone__caption"
            animate={captionControls}
            initial={{ opacity: 0, translateY: 12 }}
          >
            Community spotlight achieved.
          </motion.div>
        </div>
      </div>
    </div>
  );
}
