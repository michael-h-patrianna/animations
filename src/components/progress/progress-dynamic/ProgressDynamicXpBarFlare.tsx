import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import './progress-dynamic.css';

export function ProgressDynamicXpBarFlare() {
  const fillControls = useAnimation();
  const flareControls = useAnimation();
  const valueRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const animateBar = async () => {
      // Reset initial state
      if (valueRef.current) {
        valueRef.current.textContent = '0%';
      }

      // Animate percentage counter synchronized with bar fill
      let startTime: number | null = null;
      const duration = 2000; // 2 seconds

      const animatePercentage = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out to match bar
        const percentage = Math.round(100 * easedProgress);
        
        if (valueRef.current) {
          valueRef.current.textContent = percentage + '%';
        }
        
        if (progress < 1) requestAnimationFrame(animatePercentage);
      };
      requestAnimationFrame(animatePercentage);

      // Animate bar fill
      fillControls.start({
        scaleX: [0, 1],
        transition: { duration: 2, ease: [0.25, 0.46, 0.45, 0.94] }
      });

      // Animate flare sweep - starts after 30% of bar animation, takes 70% of duration
      setTimeout(() => {
        flareControls.start({
          x: [-100, 400],
          transition: { duration: 1.4, ease: "linear" }
        });
      }, 600); // 30% of 2000ms
    };

    animateBar();
  }, [fillControls, flareControls]);

  return (
    <div data-animation-id="progress-dynamic__xp-bar-flare">
      {/* Header with label and value */}
      <div className="pf-progress-dynamic__heading">
        <span>Level Progress</span>
        <strong ref={valueRef} className="pf-progress-dynamic__value">0%</strong>
      </div>

      {/* Progress track */}
      <div className="pf-progress-track">
        {/* Progress fill */}
        <motion.div
          className="pf-progress-fill"
          animate={fillControls}
          style={{
            background: 'linear-gradient(90deg, #c47ae5, #c6ff77)',
            scaleX: 0
          }}
        />

        {/* Flare sweep */}
        <motion.div
          className="pf-progress-flare"
          animate={flareControls}
          style={{
            width: '100px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
            x: -100
          }}
        />
      </div>
    </div>
  );
}
