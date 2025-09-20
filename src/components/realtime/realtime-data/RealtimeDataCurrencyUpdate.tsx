import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './realtime-data.css';

export function RealtimeDataCurrencyUpdate() {
  const [currency, setCurrency] = useState(1250);
  const [sparkles, setSparkles] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const startAnimation = () => {
      setIsAnimating(true);
      
      // Add sparkle
      const sparkleId = Date.now();
      setSparkles([sparkleId]);
      
      // Count up currency
      let currentCurrency = currency;
      const increment = 250;
      let step = 0;
      const steps = 15;
      
      const countInterval = setInterval(() => {
        step++;
        const progress = step / steps;
        const easeProgress = 1 - Math.pow(1 - progress, 2); // ease-out quad
        
        setCurrency(Math.round(currentCurrency + (increment * easeProgress)));
        
        if (step >= steps) {
          clearInterval(countInterval);
          currentCurrency = currentCurrency + increment;
        }
      }, 40);

      // Remove sparkle after animation
      setTimeout(() => {
        setSparkles([]);
        setIsAnimating(false);
        
        // Reset after delay
        timeoutId = setTimeout(() => {
          setCurrency(1250);
          setTimeout(startAnimation, 1500);
        }, 2000);
      }, 1200);
    };

    startAnimation();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div 
      className="pf-realtime-data" 
      data-animation-id="realtime-data__currency-update"
    >
      <motion.div 
        className="pf-realtime-data__currency"
        animate={{
          scale: isAnimating ? [1, 1.05, 1] : 1
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <div className="pf-realtime-data__currency-label">Credits</div>
        <motion.div 
          className="pf-realtime-data__currency-value"
          animate={{
            color: isAnimating ? ['#10b981', '#fbbf24', '#10b981'] : '#10b981'
          }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {currency.toLocaleString()}
        </motion.div>
        
        <AnimatePresence>
          {sparkles.map((sparkleId) => (
            <motion.div
              key={sparkleId}
              className="pf-realtime-data__sparkle"
              initial={{ 
                opacity: 0, 
                scale: 0.6, 
                y: 0 
              }}
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [0.6, 1.2, 1], 
                y: -20 
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 1.2, 
                ease: [0.25, 0.46, 0.45, 0.94] 
              }}
            >
              ✦
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
