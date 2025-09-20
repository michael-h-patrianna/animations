import { motion } from 'framer-motion';
import './text-effects.css';

export function TextEffectsEpicWin() {
  const mainText = "EPIC WIN";

  return (
    <div
      className="epic-win-container"
      data-animation-id="text-effects__epic-win"
    >
      <div className="epic-text-container">
        {/* Multiple shadow layers for premium depth */}
        <motion.div
          className="epic-shadow-far"
          initial={{ opacity: 0, scale: 1.2, y: 10 }}
          animate={{
            opacity: 0.2,
            scale: 1,
            y: 6
          }}
          transition={{
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          {mainText}
        </motion.div>

        <motion.div
          className="epic-shadow-mid"
          initial={{ opacity: 0, scale: 1.1, y: 5 }}
          animate={{
            opacity: 0.3,
            scale: 1,
            y: 3
          }}
          transition={{
            duration: 0.45,
            delay: 0.05,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          {mainText}
        </motion.div>

        {/* Main metallic text */}
        <motion.div
          className="epic-main-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {mainText.split("").map((char, index) => (
            <motion.span
              key={index}
              className="epic-char"
              initial={{
                opacity: 0,
                y: 30,
                scale: 0.5,
                rotateY: -90
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                rotateY: 0
              }}
              transition={{
                duration: 0.6,
                delay: 0.1 + (index * 0.04),
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <motion.span
                className="epic-char-inner"
              >
                {char}

                {/* Individual character glow burst on arrival */}
                <motion.span
                  className="epic-char-glow"
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  animate={{
                    opacity: [0, 1, 0.3],
                    scale: [0.8, 1.4, 1],
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 0.5 + (index * 0.04),
                    times: [0, 0.3, 1],
                    ease: "easeOut"
                  }}
                />
              </motion.span>
            </motion.span>
          ))}
        </motion.div>


      </div>
    </div>
  );
}
