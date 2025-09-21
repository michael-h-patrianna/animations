import { motion } from 'framer-motion';
import './text-effects.css';

export function TextEffectsGlitchText() {
  const text = "SYSTEM ERROR";
  
  return (
    <div 
      className="glitch-text-container"
      data-animation-id="text-effects__glitch-text"
    >
      {/* Main text with integrated RGB glitch effect */}
      <motion.div 
        className="glitch-text-base"
        animate={{
          x: [0, -2, 0, 2, 0, -1, 0, 1, 0],
          scaleX: [1, 1, 1.02, 1, 0.98, 1, 1.01, 1, 1],
          textShadow: [
            // Normal state
            "2px 2px 4px rgba(0, 0, 0, 0.5)",
            // Glitch start - subtle
            "2px 2px 4px rgba(0, 0, 0, 0.5)",
            // Strong cyan/magenta separation
            "-3px 0px 0px rgba(0, 255, 255, 0.8), 3px 0px 0px rgba(255, 0, 255, 0.8), 0 0 8px rgba(255, 255, 255, 0.5)",
            // Back to normal
            "2px 2px 4px rgba(0, 0, 0, 0.5)",
            // Another glitch - opposite direction
            "4px 0px 0px rgba(0, 255, 255, 0.9), -4px 0px 0px rgba(255, 0, 255, 0.9), 0 0 10px rgba(255, 255, 255, 0.6)",
            // Settling
            "-1px 0px 0px rgba(0, 255, 255, 0.4), 1px 0px 0px rgba(255, 0, 255, 0.4)",
            // Final glitch
            "-2px 0px 0px rgba(0, 255, 255, 0.7), 2px 0px 0px rgba(255, 0, 255, 0.7), 0 0 6px rgba(255, 255, 255, 0.4)",
            // Almost normal
            "1px 0px 0px rgba(0, 255, 255, 0.2), -1px 0px 0px rgba(255, 0, 255, 0.2)",
            // Return to normal
            "2px 2px 4px rgba(0, 0, 0, 0.5)"
          ],
          filter: [
            "brightness(1) contrast(1)",
            "brightness(1.1) contrast(1)",
            "brightness(1.2) contrast(1.1) saturate(1.2)",
            "brightness(0.9) contrast(1.2)",
            "brightness(1.3) contrast(1.3) saturate(1.3)",
            "brightness(1) contrast(1.1)",
            "brightness(1.1) contrast(1.2) saturate(1.1)",
            "brightness(1) contrast(1)",
            "brightness(1) contrast(1)"
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "linear",
          times: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 1]
        }}
      >
        {text}
      </motion.div>

      {/* Distortion bars */}
      <motion.div
        className="glitch-bars"
        animate={{
          opacity: [0, 0, 0.8, 0, 0.9, 0, 0.6, 0, 0],
          scaleY: [1, 1, 1.5, 1, 2, 1, 1.2, 1, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 2,
          times: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 1],
          ease: "linear"
        }}
      />
    </div>
  );
}