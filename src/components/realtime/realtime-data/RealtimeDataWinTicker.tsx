import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './realtime-data.css';

export function RealtimeDataWinTicker() {
  const [isAnimating, setIsAnimating] = useState(false);
  const tickerText = "Mega Win! +5,000 credits · Daily streak unlocked · Bonus wheel ready · ";

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const startAnimation = () => {
      setIsAnimating(true);
      
      // Reset and restart after animation completes
      timeoutId = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(startAnimation, 1000);
      }, 6000);
    };

    startAnimation();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div 
      className="pf-realtime-data" 
      data-animation-id="realtime-data__win-ticker"
    >
      <div className="pf-realtime-data__ticker">
        <motion.div
          className="pf-realtime-data__ticker-text"
          initial={{ x: '100%' }}
          animate={{
            x: isAnimating ? ['-80%'] : '100%'
          }}
          transition={{
            duration: 6,
            ease: 'linear',
            repeat: isAnimating ? Infinity : 0
          }}
        >
          {tickerText.repeat(3)} {/* Repeat to ensure continuous scrolling */}
        </motion.div>
      </div>
    </div>
  );
}
