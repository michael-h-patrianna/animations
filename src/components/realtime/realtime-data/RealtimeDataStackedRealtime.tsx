import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import './realtime-data.css';

export function RealtimeDataStackedRealtime() {
  const [isAnimating, setIsAnimating] = useState(false);

  const stackItems = [
    { label: 'Active Players', value: '1,247', active: true },
    { label: 'Total Wins', value: '856', active: false },
    { label: 'Live Games', value: '23', active: true },
    { label: 'Pending Rewards', value: '42', active: false },
    { label: 'Daily Bonus', value: '2x', active: true }
  ];

  useEffect(() => {
  let timeoutId: ReturnType<typeof setTimeout>;

    const startAnimation = () => {
      setIsAnimating(true);

      // Reset and restart after animation completes
      timeoutId = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(startAnimation, 2000);
      }, 1500);
    };

    startAnimation();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      className="pf-realtime-data"
      data-animation-id="realtime-data__stacked-realtime"
    >
      <div className="pf-realtime-data__stack">
        {stackItems.map((item, index) => (
          <motion.div
            key={item.label}
            className={`pf-realtime-data__stack-row ${item.active ? 'active' : ''}`}
            initial={{
              x: index % 2 === 0 ? -16 : 16,
              opacity: 0
            }}
            animate={{
              x: isAnimating ? 0 : (index % 2 === 0 ? -16 : 16),
              opacity: isAnimating ? 1 : 0
            }}
            transition={{
              duration: 0.6,
              delay: index * 0.08,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <span className="pf-realtime-data__stack-label">{item.label}</span>
            <motion.span
              className="pf-realtime-data__stack-value"
              animate={{
                color: isAnimating
                  ? (item.active ? '#06b6d4' : '#9ca3af')
                  : '#06b6d4'
              }}
              transition={{
                duration: 0.4,
                delay: index * 0.08 + 0.2
              }}
            >
              {item.value}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
