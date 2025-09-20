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
      {/* Subtle wave lines in background - 2nd layer */}
      <motion.div
        className="wave-lines"
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {[0, 1, 2].map((lineIndex) => (
          <motion.div
            key={lineIndex}
            animate={{
              x: [-100, 100],
              opacity: [0, 0.15, 0.15, 0],
            }}
            transition={{
              duration: 4,
              delay: lineIndex * 0.8,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              position: 'absolute',
              width: '200%',
              height: '2px',
              top: `${45 + lineIndex * 8}%`,
              left: '-100%',
              background: `linear-gradient(90deg, 
                transparent 0%, 
                rgba(96, 165, 250, ${0.3 - lineIndex * 0.08}) 20%, 
                rgba(96, 165, 250, ${0.4 - lineIndex * 0.1}) 50%, 
                rgba(96, 165, 250, ${0.3 - lineIndex * 0.08}) 80%, 
                transparent 100%
              )`,
              transform: `scaleY(${1.5 - lineIndex * 0.3})`,
              filter: 'blur(1px)',
            }}
          />
        ))}
      </motion.div>

      {/* Energy field that follows the wave - 3rd layer */}
      <motion.div
        className="wave-energy-field"
        animate={{ 
          opacity: [0.1, 0.25, 0.15, 0.3, 0.1],
          scale: [1, 1.05, 0.98, 1.03, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
          ease: "easeInOut",
        }}
        style={{
          position: 'absolute',
          inset: '-10%',
          background: `radial-gradient(
            ellipse at center bottom,
            rgba(59, 130, 246, 0.15) 0%,
            rgba(96, 165, 250, 0.08) 40%,
            transparent 70%
          )`,
          filter: 'blur(20px)',
          transformOrigin: 'center bottom',
          pointerEvents: 'none',
        }}
      />

      {/* Main wave text with multiple effects */}
      <div className="wave-text-wrapper">
        {text.split("").map((char, index) => {
          const waveDelay = index * 0.05;
          const isSpace = char === " ";
          
          return (
            <motion.span
              key={index}
              className="wave-char"
              initial={{
                y: 0,
                scale: 1,
                rotateZ: 0,
              }}
              animate={{
                // Vertical wave motion
                y: [0, -20, 0, 5, 0],
                // Scale pulsing as wave peaks
                scale: [1, 1.15, 1, 0.95, 1],
                // Subtle rotation for fluidity
                rotateZ: [0, -5, 0, 3, 0],
                // Color shift through wave
                color: [
                  '#3b82f6', // Blue
                  '#60a5fa', // Light blue at peak
                  '#3b82f6', // Back to blue
                  '#2563eb', // Darker in trough
                  '#3b82f6', // Return to blue
                ],
                // Dynamic shadows
                textShadow: [
                  '0 2px 4px rgba(0, 0, 0, 0.2), 0 0 0px rgba(96, 165, 250, 0)',
                  '0 4px 8px rgba(0, 0, 0, 0.3), 0 0 20px rgba(96, 165, 250, 0.6)',
                  '0 2px 4px rgba(0, 0, 0, 0.2), 0 0 10px rgba(96, 165, 250, 0.3)',
                  '0 1px 2px rgba(0, 0, 0, 0.1), 0 0 5px rgba(37, 99, 235, 0.2)',
                  '0 2px 4px rgba(0, 0, 0, 0.2), 0 0 0px rgba(96, 165, 250, 0)',
                ],
              }}
              transition={{
                duration: 2,
                delay: waveDelay,
                repeat: Infinity,
                repeatDelay: 1,
                ease: [0.45, 0, 0.55, 1], // Custom wave easing
                times: [0, 0.25, 0.5, 0.75, 1],
              }}
              style={{
                display: 'inline-block',
                transformOrigin: 'center bottom',
                position: 'relative',
              }}
            >
              {/* Character with subtle inner glow */}
              <motion.span
                style={{
                  display: 'inline-block',
                  position: 'relative',
                }}
              >
                {isSpace ? "\u00A0" : char}
                
                {/* Subtle highlight that travels with the wave */}
                {!isSpace && (
                  <motion.span
                    className="wave-highlight"
                    animate={{
                      opacity: [0, 0.6, 0.3, 0, 0],
                      scaleY: [0.8, 1.2, 1, 0.9, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      delay: waveDelay,
                      repeat: Infinity,
                      repeatDelay: 1,
                      ease: "easeInOut",
                      times: [0, 0.25, 0.5, 0.75, 1],
                    }}
                    style={{
                      position: 'absolute',
                      inset: '-20% -10%',
                      background: 'linear-gradient(180deg, rgba(147, 197, 253, 0.4), transparent)',
                      filter: 'blur(3px)',
                      pointerEvents: 'none',
                      borderRadius: '50% 50% 0 0',
                      transformOrigin: 'center bottom',
                    }}
                  />
                )}
              </motion.span>
            </motion.span>
          );
        })}
      </div>

      {/* Subtle ripple effect underneath - complementary layer */}
      <motion.div
        className="wave-ripple"
        animate={{
          scaleX: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
          ease: "easeInOut",
        }}
        style={{
          position: 'absolute',
          bottom: '40%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120%',
          height: '4px',
          background: 'linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.3), transparent)',
          filter: 'blur(4px)',
          pointerEvents: 'none',
        }}
      />

      {/* Atmospheric glow that intensifies with wave */}
      <motion.div
        className="wave-atmosphere"
        animate={{
          opacity: [0.05, 0.15, 0.08, 0.12, 0.05],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
          ease: "easeInOut",
        }}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, transparent 30%, rgba(59, 130, 246, 0.1) 60%, transparent 90%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}