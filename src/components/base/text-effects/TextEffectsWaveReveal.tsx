import { motion } from 'framer-motion';
import './text-effects.css';

export function TextEffectsWaveReveal() {
  const lines = [
    { text: "Look at", color: "#60a5fa" },     // Blue
    { text: "these", color: "#c6ff77" },      // Green
    { text: "colors", color: "#FFD700" }   // Gold
  ];

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4, // Increased to stagger lines more
        delayChildren: 0.2
      }
    }
  };

  const lineVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 80
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration: 0.5
      }
    }
  };

  return (
    <div
      className="wave-reveal-container"
      data-animation-id="text-effects__wave-reveal"
    >
      <motion.div
        className="wave-reveal-wrapper"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {lines.map((line, lineIndex) => (
          <motion.div
            key={lineIndex}
            className="wave-reveal-line"
            style={{ color: line.color }}
            variants={lineVariants}
          >
            {line.text.split("").map((char, charIndex) => (
              <motion.span
                key={`${lineIndex}-${charIndex}`}
                className="wave-reveal-char"
                variants={letterVariants}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
