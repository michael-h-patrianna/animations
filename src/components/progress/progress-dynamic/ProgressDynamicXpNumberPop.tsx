import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import './progress-dynamic.css';

export function ProgressDynamicXpNumberPop() {
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const glowControls = useAnimation();
  const numberControls = useAnimation();

  useEffect(() => {
    const animateXP = async () => {
      // Start glow orb animation
      glowControls.start({
        opacity: [0, 1, 0.3],
        scale: [0.5, 1.2, 1],
        transition: { duration: 2.4, ease: "easeOut" }
      });

      // Number pop animation
      numberControls.start({
        scale: [0.3, 1.15, 1],
        y: [20, -5, 0],
        opacity: [0, 1, 1],
        filter: ["blur(10px)", "blur(0px)", "blur(0px)"],
        transition: { 
          duration: 1.6, 
          ease: [0.25, 0.46, 0.45, 0.94],
          times: [0, 0.6, 1]
        }
      });

      // Animate number counting
      let startTime: number | null = null;
      const countDuration = 2500;
      
      const animateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / countDuration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
        const value = Math.round(240 * easedProgress);
        
        const numberElement = containerRef.current?.querySelector('.xp-number') as HTMLElement;
        if (numberElement) {
          numberElement.textContent = '+' + value;
        }
        
        if (progress < 1) requestAnimationFrame(animateCount);
      };
      requestAnimationFrame(animateCount);

      // Create particles
      setTimeout(() => createParticles(), 400);
      
      // Create sparkles  
      setTimeout(() => createSparkles(), 600);
    };

    animateXP();
  }, [glowControls, numberControls]);

  const createParticles = () => {
    const container = containerRef.current;
    if (!container) return;

    // Create multiple layers of particles
    for (let layer = 0; layer < 2; layer++) {
      for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'xp-particle';
        particle.style.position = 'absolute';
        particle.style.fontSize = layer === 0 ? '18px' : '14px';
        particle.style.fontWeight = '700';
        particle.style.color = layer === 0 ? '#c6ff77' : '#a8ff3e';
        particle.style.textShadow = '0 0 10px currentColor';
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '3';
        particle.textContent = '+' + Math.round(10 + Math.random() * 30);

        const angle = (i / 5) * Math.PI * 2;
        const radius = 60 + layer * 20;

        container.appendChild(particle);

        // Animate particle
        const particleAnimation = particle.animate([
          {
            transform: 'translate(-50%, -50%) scale(0)',
            opacity: '0'
          },
          {
            transform: `translate(calc(-50% + ${Math.cos(angle) * radius}px), calc(-50% + ${Math.sin(angle) * radius}px)) scale(1)`,
            opacity: '1',
            offset: 0.4
          },
          {
            transform: `translate(calc(-50% + ${Math.cos(angle) * radius * 1.5}px), calc(-50% + ${Math.sin(angle) * radius * 1.5 - 40}px)) scale(0.7)`,
            opacity: '0'
          }
        ], {
          duration: 2600,
          delay: layer * 100 + i * 50,
          easing: 'ease-out'
        });

        particleAnimation.addEventListener('finish', () => particle.remove());
      }
    }
  };

  const createSparkles = () => {
    const container = containerRef.current;
    if (!container) return;

    // Add sparkle effects
    for (let i = 0; i < 8; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'xp-sparkle';
      sparkle.style.position = 'absolute';
      sparkle.style.width = '4px';
      sparkle.style.height = '4px';
      sparkle.style.background = '#fff';
      sparkle.style.borderRadius = '50%';
      sparkle.style.boxShadow = '0 0 6px #fff';
      sparkle.style.left = `${40 + Math.random() * 20}%`;
      sparkle.style.top = `${40 + Math.random() * 20}%`;
      sparkle.style.pointerEvents = 'none';
      sparkle.style.zIndex = '4';

      container.appendChild(sparkle);

      const sparkleAnimation = sparkle.animate([
        { opacity: '0', transform: 'scale(0)' },
        { opacity: '1', transform: 'scale(1)', offset: 0.5 },
        { opacity: '0', transform: 'scale(0)' }
      ], { 
        duration: 600, 
        delay: Math.random() * 2000 
      });

      sparkleAnimation.addEventListener('finish', () => sparkle.remove());
    }
  };

  return (
    <div 
      ref={containerRef}
      className="xp-pop-container"
      data-animation-id="progress-dynamic__xp-number-pop"
    >
      {/* Background glow orb */}
      <motion.div
        className="glow-orb"
        animate={glowControls}
        style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(198, 255, 119, 0.3) 0%, transparent 70%)',
          filter: 'blur(40px)',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1
        }}
      />

      {/* Main number with XP label */}
      <motion.div 
        className="number-wrapper"
        animate={numberControls}
        style={{
          display: 'flex',
          alignItems: 'baseline',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div 
          className="xp-number"
          style={{
            fontSize: '56px',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #c6ff77, #a8ff3e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: `
              0 0 30px rgba(198, 255, 119, 0.8),
              0 0 60px rgba(198, 255, 119, 0.5),
              0 2px 4px rgba(0, 0, 0, 0.3)
            `,
            letterSpacing: '2px'
          }}
        >
          +0
        </div>
        <span 
          style={{
            fontSize: '24px',
            marginLeft: '8px',
            fontWeight: '700',
            opacity: '0.8',
            color: '#a8ff3e'
          }}
        >
          XP
        </span>
      </motion.div>
    </div>
  );
}
