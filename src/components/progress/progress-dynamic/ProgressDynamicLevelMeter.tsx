import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './progress-dynamic.css';

export function ProgressDynamicLevelMeter() {
  const valueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animateMeter = () => {
      // Reset initial state
      if (valueRef.current) {
        valueRef.current.textContent = '0';
      }

      // Animate value counter synchronized with needle
      let startTime: number | null = null;
      const duration = 2000;

      const animateValue = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
        const value = Math.round(100 * easedProgress);
        
        if (valueRef.current) {
          valueRef.current.textContent = value.toString();
        }
        
        if (progress < 1) requestAnimationFrame(animateValue);
      };
      requestAnimationFrame(animateValue);
    };

    animateMeter();
  }, []);

  return (
    <div data-animation-id="progress-dynamic__level-meter">
      {/* Meter container */}
      <div className="pf-meter" style={{ width: '120px', height: '80px', position: 'relative', margin: '0 auto' }}>
        {/* SVG meter */}
        <svg viewBox="0 0 120 80" style={{ width: '100%', height: '100%' }}>
          {/* Meter arc */}
          <path
            d="M 10 70 A 50 50 0 0 1 110 70"
            fill="none"
            stroke="rgba(236, 195, 255, 0.3)"
            strokeWidth="8"
          />
          
          {/* Animated needle */}
          <motion.line
            x1="60"
            y1="70"
            x2="60"
            y2="25"
            stroke="#c47ae5"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ transformOrigin: '60px 70px' }}
            animate={{
              rotate: [-90, 100, 90],
            }}
            transition={{
              duration: 2,
              ease: [0.68, -0.55, 0.265, 1.55], // snap easing with overshoot
              times: [0, 0.8, 1]
            }}
          />
        </svg>
      </div>

      {/* Value display */}
      <div
        ref={valueRef}
        style={{
          textAlign: 'center',
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#c47ae5',
          marginTop: '8px'
        }}
      >
        0
      </div>
    </div>
  );
}
