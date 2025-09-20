import React from 'react';
import { motion } from 'framer-motion';
import trophyImage from '../../../assets/achievement/trophy-gold.png';
import './progress-dynamic.css';

export function ProgressDynamicAchievementRing() {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  return (
    <div 
      className="achievement-ring-container"
      data-animation-id="progress-dynamic__achievement-ring"
    >
      {/* Main container */}
      <div className="achievement-ring-wrapper">
        {/* Subtle background glow that appears on completion */}
        <motion.div
          className="achievement-completion-glow"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 0,
          }}
          whileInView={{
            opacity: [0, 0, 0, 1, 0.7],
            scale: [0.9, 0.9, 0.9, 1.1, 1.05],
          }}
          transition={{
            duration: 3,
            times: [0, 0.6, 0.65, 0.75, 1],
            ease: "easeOut"
          }}
        />

        {/* SVG Ring Container */}
        <svg 
          viewBox="0 0 100 100" 
          className="achievement-svg-ring"
        >
          {/* Premium gradient definition */}
          <defs>
            <linearGradient id="achievement-premium-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="25%" stopColor="#FFED4E" />
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="75%" stopColor="#FFA500" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
            <filter id="achievement-premium-glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            {/* Shadow filter for depth */}
            <filter id="ring-shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
          </defs>

          {/* Background ring track with subtle gradient */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="url(#achievement-premium-gradient)"
            strokeWidth="6"
            opacity="0.15"
            filter="url(#ring-shadow)"
          />

          {/* Main progress ring */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="url(#achievement-premium-gradient)"
            strokeWidth="6"
            strokeLinecap="round"
            filter="url(#achievement-premium-glow)"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: circumference,
              transformOrigin: '50% 50%',
            }}
            initial={{
              strokeDashoffset: circumference,
            }}
            animate={{
              strokeDashoffset: 0,
              rotate: [0, 0, 360],
            }}
            transition={{
              strokeDashoffset: {
                duration: 2,
                ease: [0.4, 0, 0.2, 1]
              },
              rotate: {
                duration: 2,
                times: [0, 0.8, 1],
                ease: "easeInOut"
              }
            }}
          />

          {/* Shimmer effect on the ring */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="2"
            strokeLinecap="round"
            style={{
              strokeDasharray: '10 90',
              strokeDashoffset: 0,
            }}
            animate={{
              strokeDashoffset: [-100, 0],
            }}
            transition={{
              duration: 2,
              ease: "linear",
              repeat: 1,
              delay: 0.5
            }}
          />
        </svg>

        {/* Trophy Image (high quality asset) */}
        <motion.div
          className="achievement-trophy-container"
          initial={{ 
            opacity: 0, 
            scale: 0,
            rotate: -180
          }}
          animate={{ 
            opacity: [0, 0, 1],
            scale: [0, 0, 1.2, 0.95, 1.05, 1],
            rotate: [-180, -180, 0, 10, -5, 0]
          }}
          transition={{
            duration: 2.5,
            times: [0, 0.3, 0.6, 0.75, 0.85, 1],
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          <img 
            src={trophyImage} 
            alt="Achievement Trophy" 
            className="achievement-trophy-image"
          />
          {/* Trophy shine effect */}
          <motion.div
            className="trophy-shine"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0, 0.8, 0],
              x: [-50, -50, 50, 50],
            }}
            transition={{
              duration: 2.5,
              times: [0, 0.6, 0.8, 1],
              ease: "easeOut"
            }}
          />
        </motion.div>
      </div>

      {/* Achievement text with character animation */}
      <div className="achievement-text-container">
        {/* Dark shadow text that appears first */}
        <motion.div
          className="achievement-shadow-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            delay: 1.8,
            duration: 0.6,
            ease: "easeOut"
          }}
        >
          {"ACHIEVEMENT".split("").map((char, index) => (
            <motion.span
              key={`shadow-${index}`}
              className="achievement-shadow-char"
              initial={{
                opacity: 0,
                filter: "blur(8px)"
              }}
              animate={{
                opacity: 1,
                filter: "blur(4px)"
              }}
              transition={{
                duration: 0.3,
                delay: 1.9 + (index * 0.03),
                ease: "easeOut"
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>

        {/* Golden text that animates on top */}
        <motion.div
          className="achievement-text-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1, duration: 0.3 }}
        >
          {"ACHIEVEMENT".split("").map((char, index) => (
            <motion.span
              key={index}
              className="achievement-char"
              initial={{
                opacity: 0,
                y: 20,
                scale: 0
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: [0, 1.2, 1]
              }}
              transition={{
                duration: 0.4,
                delay: 2.2 + (index * 0.05),
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Unlocked text */}
      <motion.div
        className="achievement-unlocked"
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: [0, 1],
          y: [10, 0]
        }}
        transition={{
          duration: 0.5,
          delay: 2.6,
          ease: "easeOut"
        }}
      >
        UNLOCKED
      </motion.div>
    </div>
  );
}
