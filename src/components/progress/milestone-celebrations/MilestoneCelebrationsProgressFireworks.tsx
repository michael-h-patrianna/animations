import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import './milestone-celebrations.css';

export function MilestoneCelebrationsProgressFireworks() {
  const glowControls = useAnimation();
  const badgeControls = useAnimation();
  const iconControls = useAnimation();
  const headlineControls = useAnimation();
  const captionControls = useAnimation();
  const effectsRef = useRef<HTMLDivElement>(null);

  const accent = '#ff5981';
  
  const randBetween = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const createFireworksEffects = () => {
    if (!effectsRef.current) return [];
    
    const effects = [];
    const colors = ['#ff5981', '#ffce1a', '#47fff4', '#c6ff77'];
    const count = 18;
    
    // 18 confetti pieces with multi-colored burst
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const distance = 90 + randBetween(-20, 30);
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const rotate = randBetween(-120, 120);
      const rotateExit = rotate * 1.2;
      
      effects.push(
        <motion.span
          key={`confetti-${i}`}
          className="pf-milestone__confetti"
          style={{
            background: colors[i % colors.length],
            left: '50%',
            top: '45%',
          }}
          initial={{ 
            opacity: 0, 
            transform: 'translate(-50%, -50%) rotate(0deg) scale(0.5)' 
          }}
          animate={{
            opacity: [0, 1, 0],
            transform: [
              'translate(-50%, -50%) rotate(0deg) scale(0.5)',
              `translate(-50%, -50%) translate(${tx}px, ${ty}px) rotate(${rotate}deg)`,
              `translate(-50%, -50%) translate(${tx * 1.15}px, ${ty * 1.15}px) rotate(${rotateExit}deg)`
            ]
          }}
          transition={{
            duration: 1.2,
            delay: i * 0.04,
            times: [0, 0.55, 1],
            ease: [0.68, -0.55, 0.265, 1.55]
          }}
        />
      );
    }
    
    // 6 sparks
    for (let i = 0; i < 6; i++) {
      const angle = randBetween(0, Math.PI * 2);
      const tx = Math.cos(angle) * 60;
      const ty = Math.sin(angle) * 60;
      
      effects.push(
        <motion.span
          key={`spark-${i}`}
          className="pf-milestone__spark"
          style={{
            background: '#ffd966',
            left: '50%',
            top: '40%',
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
            duration: 0.9,
            delay: 0.3 + i * 0.08,
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
        opacity: [0, 1, 0],
        scale: [0.8, 1.9, 2.4]
      }, {
        duration: 1.2,
        ease: [0.68, -0.55, 0.265, 1.55]
      });

      // Badge animation
      badgeControls.start({
        translateY: [-18, 0],
        scale: [1.1, 1]
      }, {
        duration: 0.6,
        ease: [0.68, -0.55, 0.265, 1.55]
      });

      // Icon animation
      iconControls.start({
        scale: [0.7, 1.25, 1],
        rotate: [0, -16, 8, 0]
      }, {
        duration: 0.7,
        ease: [0.68, -0.55, 0.265, 1.55]
      });

      // Headline animation
      headlineControls.start({
        opacity: [0, 1],
        translateY: [10, 0]
      }, {
        duration: 0.7,
        ease: [0.4, 0.0, 0.2, 1]
      });

      // Caption animation
      captionControls.start({
        opacity: [0, 1],
        translateY: [12, 0]
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
      data-animation-id="milestone-celebrations__progress-fireworks"
      style={{ '--pf-milestone-accent': accent } as React.CSSProperties}
    >
      <div className="pf-milestone__visuals">
        <motion.div 
          className="pf-milestone__glow"
          style={{
            background: `radial-gradient(circle, rgba(255, 89, 129, 0.55), rgba(236, 195, 255, 0))`
          }}
          animate={glowControls}
          initial={{ opacity: 0, scale: 0.8 }}
        />
        
        <div className="pf-milestone__effects" ref={effectsRef}>
          {createFireworksEffects()}
        </div>
        
        <div className="pf-milestone__content">
          <motion.div 
            className="pf-milestone__badge"
            animate={badgeControls}
            initial={{ translateY: -18, scale: 1.1 }}
          >
            Grand Win
          </motion.div>
          
          <motion.div 
            className="pf-milestone__icon"
            animate={iconControls}
            initial={{ scale: 0.7, rotate: 0 }}
          >
            💥
          </motion.div>
          
          <motion.div 
            className="pf-milestone__headline"
            animate={headlineControls}
            initial={{ opacity: 0, translateY: 10 }}
          >
            Progress Fireworks
          </motion.div>
          
          <motion.div 
            className="pf-milestone__caption"
            animate={captionControls}
            initial={{ opacity: 0, translateY: 12 }}
          >
            Jackpot fireworks triggered.
          </motion.div>
        </div>
      </div>
    </div>
  );
}
