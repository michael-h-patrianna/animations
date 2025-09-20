import React from 'react';
import { motion } from 'framer-motion';
import './text-effects.css';

export function TextEffectsGlitchText() {
  const text = "SYSTEM ERROR";
  
  return (
    <div 
      className="glitch-text-container"
      data-animation-id="text-effects__glitch-text"
    >
      {/* Base text layer */}
      <div className="glitch-text-base">
        {text}
      </div>
      
      {/* Glitch layer 1 - cyan offset */}
      <motion.div
        className="glitch-text-layer glitch-layer-1"
        initial={{ clipPath: "inset(0 0 0 0)" }}
        animate={{
          clipPath: [
            "inset(0 0 0 0)",
            "inset(20% 0 30% 0)",
            "inset(0 0 0 0)",
            "inset(60% 0 10% 0)",
            "inset(0 0 0 0)",
            "inset(40% 0 40% 0)",
            "inset(0 0 0 0)"
          ],
          x: [0, -2, 0, 2, 0, -1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "linear"
        }}
      >
        {text}
      </motion.div>
      
      {/* Glitch layer 2 - magenta offset */}
      <motion.div
        className="glitch-text-layer glitch-layer-2"
        initial={{ clipPath: "inset(0 0 0 0)" }}
        animate={{
          clipPath: [
            "inset(0 0 0 0)",
            "inset(50% 0 20% 0)",
            "inset(0 0 0 0)",
            "inset(10% 0 70% 0)",
            "inset(0 0 0 0)",
            "inset(30% 0 50% 0)",
            "inset(0 0 0 0)"
          ],
          x: [0, 2, 0, -2, 0, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "linear",
          delay: 0.02
        }}
      >
        {text}
      </motion.div>

      {/* Distortion bars */}
      <motion.div
        className="glitch-bars"
        animate={{
          opacity: [0, 0, 1, 0, 1, 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 2,
          times: [0, 0.1, 0.15, 0.2, 0.25, 0.3, 1],
          ease: "linear"
        }}
      />
    </div>
  );
}