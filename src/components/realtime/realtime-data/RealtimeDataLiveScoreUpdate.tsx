import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import './realtime-data.css';

export function RealtimeDataLiveScoreUpdate() {
  const [scores, setScores] = useState([1450, 1320]);
  // Removed unused isAnimating state to satisfy noUnusedLocals
  const controls1 = useAnimation();
  const controls2 = useAnimation();

  useEffect(() => {
  let timeoutId: ReturnType<typeof setTimeout>;

    const startAnimation = async () => {
  // start animation
      
      // Animate both scores
      const promises = [
        controls1.start({
          scale: [1, 1.2, 1],
          color: ['#ecc3ff', '#c6ff77', '#ecc3ff']
        }),
        controls2.start({
          scale: [1, 1.2, 1],
          color: ['#ecc3ff', '#c6ff77', '#ecc3ff']
        })
      ];

      // Count up the numbers
      let currentScores = [...scores];
      const increment = 120;
      let step = 0;
      const steps = 20;
      
      const countInterval = setInterval(() => {
        step++;
        const progress = step / steps;
        const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        
        setScores([
          Math.round(currentScores[0] + (increment * easeProgress)),
          Math.round(currentScores[1] + (increment * easeProgress))
        ]);
        
        if (step >= steps) {
          clearInterval(countInterval);
          currentScores = [currentScores[0] + increment, currentScores[1] + increment];
        }
      }, 40);

      await Promise.all(promises);
  // end animation
      
      // Reset after delay
      timeoutId = setTimeout(() => {
        setScores([1450, 1320]);
        setTimeout(startAnimation, 1000);
      }, 2000);
    };

    startAnimation();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [controls1, controls2]);

  return (
    <div 
      className="pf-realtime-data" 
      data-animation-id="realtime-data__live-score-update"
    >
      <div className="pf-realtime-data__leaderboard">
        <div className="pf-realtime-data__row">
          <div className="pf-realtime-data__rank">#1</div>
          <div className="pf-realtime-data__player">Phoenix</div>
          <motion.div 
            className="pf-realtime-data__score"
            animate={controls1}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94] as const
            }}
          >
            {scores[0].toLocaleString()}
          </motion.div>
        </div>
        <div className="pf-realtime-data__row">
          <div className="pf-realtime-data__rank">#2</div>
          <div className="pf-realtime-data__player">Shadow</div>
          <motion.div 
            className="pf-realtime-data__score"
            animate={controls2}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94] as const,
              delay: 0.1
            }}
          >
            {scores[1].toLocaleString()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
