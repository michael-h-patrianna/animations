import React from 'react';
import { motion } from 'framer-motion';
import './text-effects.css';

export function TextEffectsWaveText() {
  const text = "WAVE MOTION";
  
  return (
    <div 
      className="wave-text-container"
      data-animation-id="text-effects__wave-text"
    >
      <div className="wave-text-wrapper">
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            className="wave-char"
            initial={{
              y: 0,
            }}
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 1,
              delay: index * 0.05,
              repeat: Infinity,
              repeatDelay: 1,
              ease: "easeInOut"
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </div>
    </div>
  );
}