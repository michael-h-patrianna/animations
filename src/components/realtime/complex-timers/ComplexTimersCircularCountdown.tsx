import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './complex-timers.css';

export function ComplexTimersCircularCountdown() {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const startAnimation = () => {
      setIsAnimating(true);
      
      // Reset and restart after animation completes
      timeoutId = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(startAnimation, 500);
      }, 1400);
    };

    startAnimation();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div 
      className="pf-timer-complex" 
      data-animation-id="complex-timers__circular-countdown"
    >
      <motion.div 
        className="pf-timer-complex__dial"
        style={{ '--pf-timer-accent': '#47fff4' } as React.CSSProperties}
        animate={{
          boxShadow: isAnimating 
            ? ['0 0 0 rgba(71,255,244,0)', '0 0 24px rgba(71,255,244,0.4)', '0 0 0 rgba(71,255,244,0)']
            : '0 0 0 rgba(71,255,244,0)'
        }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      >
        <motion.div 
          className="pf-timer-complex__pointer"
          animate={{
            rotate: isAnimating ? ['-90deg', '230deg'] : '-90deg'
          }}
          transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </motion.div>
      <div className="pf-timer-complex__footer">Circular Sweep</div>
    </div>
  );
}
