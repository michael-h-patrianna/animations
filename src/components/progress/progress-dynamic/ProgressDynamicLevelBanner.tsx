import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './progress-dynamic.css';

export function ProgressDynamicLevelBanner() {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createStars = () => {
      const starsContainer = starsRef.current;
      if (!starsContainer) return;

      // Clear existing stars
      starsContainer.innerHTML = '';

      // Create star particles
      for (let i = 0; i < 5; i++) {
        const star = document.createElement('span');
        star.style.position = 'absolute';
        star.style.fontSize = '20px';
        star.textContent = '⭐';
        star.style.left = `${20 + i * 15}%`;
        star.style.top = '50%';
        star.style.pointerEvents = 'none';
        starsContainer.appendChild(star);

        // Animate star
        const starAnimation = star.animate([
          { 
            transform: 'translateY(0) rotate(0deg) scale(0)', 
            opacity: '0' 
          },
          { 
            transform: 'translateY(-30px) rotate(180deg) scale(1)', 
            opacity: '1',
            offset: 0.5 
          },
          { 
            transform: 'translateY(-50px) rotate(360deg) scale(0.5)', 
            opacity: '0' 
          }
        ], { 
          duration: 2400, 
          delay: i * 50 
        });

        starAnimation.addEventListener('finish', () => star.remove());
      }
    };

    // Start star animation after banner starts
    setTimeout(createStars, 500);
  }, []);

  return (
    <div 
      style={{ 
        position: 'relative',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      data-animation-id="progress-dynamic__level-banner"
    >
      {/* Banner */}
      <motion.div
        className="pf-level-banner"
        initial={{ 
          y: 100, 
          scale: 0.8, 
          opacity: 0 
        }}
        animate={{ 
          y: [-10, 0], 
          scale: [1.05, 1], 
          opacity: 1 
        }}
        transition={{
          duration: 2,
          ease: [0.25, 0.46, 0.45, 0.94],
          times: [0.7, 1]
        }}
        style={{
          background: 'linear-gradient(135deg, #ffce1a, #ff9a00)',
          padding: '15px 30px',
          borderRadius: '8px',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '24px',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(255, 206, 26, 0.4)',
          position: 'relative',
          zIndex: 2
        }}
      >
        LEVEL UP!
      </motion.div>

      {/* Stars container */}
      <div
        ref={starsRef}
        className="pf-banner-stars"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
