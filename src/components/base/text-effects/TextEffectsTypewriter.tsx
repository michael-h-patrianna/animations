import { motion } from 'framer-motion';
import './text-effects.css';

export function TextEffectsTypewriter() {
  const text = "LOADING SYSTEM...";
  const cursor = "|";

  return (
    <div
      className="typewriter-container"
      data-animation-id="text-effects__typewriter"
    >
      <div className="typewriter-text">
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            className="typewriter-char"
            initial={{
              opacity: 0,
              display: "none"
            }}
            animate={{
              opacity: 1,
              display: "inline-block"
            }}
            transition={{
              duration: 0,
              delay: index * 0.08
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}

        {/* Blinking cursor */}
        <motion.span
          className="typewriter-cursor"
          initial={{ opacity: 1 }}
          animate={{
            opacity: [1, 1, 0, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            times: [0, 0.5, 0.5, 1],
            ease: "linear",
            delay: text.length * 0.08
          }}
        >
          {cursor}
        </motion.span>
      </div>
    </div>
  );
}
