import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './complex-timers.css';

export function ComplexTimersTournamentTimer() {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const startAnimation = () => {
      setIsAnimating(true);
      
      // Reset and restart after animation completes
      timeoutId = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(startAnimation, 500);
      }, 1800);
    };

    startAnimation();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div 
      className="pf-timer-complex" 
      data-animation-id="complex-timers__tournament-timer"
      data-style="tournament-timer"
    >
      <motion.div 
        className="pf-timer-complex__dial"
        style={{ '--pf-timer-accent': '#ffce1a' } as React.CSSProperties}
      >
        <motion.div 
          className="pf-timer-complex__pointer"
          animate={{
            rotate: isAnimating ? ['-120deg', '240deg', '-120deg'] : '-120deg'
          }}
          transition={{ 
            duration: 1.8, 
            ease: [0.25, 0.46, 0.45, 0.94],
            times: [0, 0.7, 1]
          }}
        />
      </motion.div>
      <motion.div 
        className="pf-timer-complex__ranks"
        animate={{
          opacity: isAnimating ? [0.5, 1, 0.5] : 0.5
        }}
        transition={{ duration: 1.8, ease: 'easeInOut' }}
      >
        <motion.span
          animate={{
            color: isAnimating ? ['#d1d5db', '#ffce1a', '#d1d5db'] : '#d1d5db'
          }}
          transition={{ duration: 1.8, delay: 0.2 }}
        >
          #1
        </motion.span>
        <motion.span
          animate={{
            color: isAnimating ? ['#d1d5db', '#ffce1a', '#d1d5db'] : '#d1d5db'
          }}
          transition={{ duration: 1.8, delay: 0.4 }}
        >
          #2
        </motion.span>
        <motion.span
          animate={{
            color: isAnimating ? ['#d1d5db', '#ffce1a', '#d1d5db'] : '#d1d5db'
          }}
          transition={{ duration: 1.8, delay: 0.6 }}
        >
          #3
        </motion.span>
      </motion.div>
      <div className="pf-timer-complex__footer">Tournament Timer</div>
    </div>
  );
}
