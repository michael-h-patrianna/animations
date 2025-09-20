import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './complex-timers.css';

export function ComplexTimersModeSwitch() {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const startAnimation = () => {
      setIsAnimating(true);
      
      // Reset and restart after animation completes
      timeoutId = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(startAnimation, 500);
      }, 1200);
    };

    startAnimation();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <motion.div 
      className="pf-timer-complex" 
      data-animation-id="complex-timers__mode-switch"
      data-style="mode-switch"
      animate={{
        background: isAnimating 
          ? ['rgba(78,24,124,0.45)', 'rgba(33,15,49,0.9)', 'rgba(78,24,124,0.45)']
          : 'rgba(78,24,124,0.45)'
      }}
      transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.div 
        className="pf-timer-complex__dial"
        style={{ '--pf-timer-accent': '#c47ae5' } as React.CSSProperties}
      >
        <motion.div 
          className="pf-timer-complex__pointer"
          animate={{
            rotate: isAnimating ? ['-120deg', '140deg'] : '-120deg'
          }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </motion.div>
      <div className="pf-timer-complex__footer">Mode Switch</div>
    </motion.div>
  );
}
