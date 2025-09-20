import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './complex-timers.css';

export function ComplexTimersCountdownFlip() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [digits, setDigits] = useState(['9', '8', '7']);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const startAnimation = () => {
      setIsAnimating(true);
      
      // Countdown sequence
      const sequence = [
        ['9', '8', '7'],
        ['9', '8', '6'],
        ['9', '7', '5'],
        ['8', '6', '4'],
        ['7', '5', '3'],
        ['6', '4', '2'],
        ['5', '3', '1'],
        ['4', '2', '0'],
        ['9', '8', '7'] // Reset
      ];
      
      let currentIndex = 0;
      const interval = setInterval(() => {
        currentIndex++;
        if (currentIndex < sequence.length) {
          setDigits(sequence[currentIndex]);
        } else {
          clearInterval(interval);
          setIsAnimating(false);
          setTimeout(startAnimation, 1000);
        }
      }, 400);

      timeoutId = setTimeout(() => {
        clearInterval(interval);
        setIsAnimating(false);
        setTimeout(startAnimation, 1000);
      }, 3200);
    };

    startAnimation();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div 
      className="pf-timer-complex" 
      data-animation-id="complex-timers__countdown-flip"
    >
      <div className="pf-timer-complex__flaps">
        {digits.map((digit, index) => (
          <motion.div
            key={`${index}-${digit}`}
            className="pf-timer-complex__flap"
            initial={{ rotateX: 0 }}
            animate={{
              rotateX: isAnimating ? [0, -90, 0] : 0
            }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: index * 0.1
            }}
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: 'center center'
            }}
          >
            {digit}
          </motion.div>
        ))}
      </div>
      <div className="pf-timer-complex__footer">Countdown Flip</div>
    </div>
  );
}
