import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './complex-timers.css';

export function ComplexTimersGeneratorFill() {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const startAnimation = () => {
      setIsAnimating(true);
      
      // Reset and restart after animation completes
      timeoutId = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(startAnimation, 500);
      }, 1300);
    };

    startAnimation();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div 
      className="pf-timer-complex" 
      data-animation-id="complex-timers__generator-fill"
    >
      <motion.div 
        className="pf-timer-complex__dial"
        style={{ '--pf-timer-accent': '#c6ff77' } as React.CSSProperties}
      >
        <motion.div 
          className="pf-timer-complex__pointer"
          animate={{
            rotate: isAnimating ? ['-150deg', '80deg'] : '-150deg'
          }}
          transition={{ duration: 1.3, ease: 'easeInOut' }}
        />
        <div className="pf-timer-complex__segments">
          {[...Array(6)].map((_, index) => (
            <motion.div
              key={index}
              className="pf-timer-complex__segment"
              style={{
                transform: `rotate(${index * 60}deg)`
              }}
              animate={{
                opacity: isAnimating ? [0.1, 0.9] : 0.1
              }}
              transition={{
                duration: 1.3,
                delay: index * 0.18,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      </motion.div>
      <div className="pf-timer-complex__footer">Generator Fill</div>
    </div>
  );
}
