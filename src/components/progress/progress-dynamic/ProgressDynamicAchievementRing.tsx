import React from 'react';
import { motion } from 'framer-motion';
import './progress-dynamic.css';

export function ProgressDynamicAchievementRing() {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  return (
    <div 
      className="achievement-ring-container"
      data-animation-id="progress-dynamic__achievement-ring"
    >
      {/* Ring Container */}
      <div style={{ width: '100px', height: '100px', margin: '0 auto' }}>
        <svg 
          viewBox="0 0 100 100" 
          style={{ 
            width: '100%', 
            height: '100%', 
            transform: 'rotate(-90deg)' 
          }}
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c47ae5" />
              <stop offset="100%" stopColor="#ecc3ff" />
            </linearGradient>
          </defs>

          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(236, 195, 255, 0.2)"
            strokeWidth="8"
          />

          {/* Progress ring */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="url(#ring-gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: circumference
            }}
            animate={{
              strokeDashoffset: [circumference, 0]
            }}
            transition={{
              duration: 2,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          />
        </svg>
      </div>

      {/* Achievement text */}
      <motion.div
        className="achievement-text"
        initial={{ 
          opacity: 0, 
          scale: 0.8 
        }}
        animate={{ 
          opacity: 1, 
          scale: 1 
        }}
        transition={{
          duration: 0.6,
          delay: 1.4, // Start when ring is 70% complete
          ease: "easeOut"
        }}
        style={{
          textAlign: 'center',
          marginTop: '10px',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#ecc3ff'
        }}
      >
        ACHIEVEMENT!
      </motion.div>
    </div>
  );
}
