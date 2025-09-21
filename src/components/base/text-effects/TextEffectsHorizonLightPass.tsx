/**
 * Standalone: Copy this file and TextEffectsHorizonLightPass.css into your app.
 * Runtime deps: react, framer-motion
 * RN parity: transforms/opacity/color only; port with Reanimated/Moti.
 */
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import React from 'react';
import './TextEffectsHorizonLightPass.css';

export function TextEffectsHorizonLightPass() {
  const text = 'LOREM IPSUM DOLOR';
  const shouldReduceMotion = useReducedMotion();

  const letters = React.useMemo(() => Array.from(text), [text]);

  const containerVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.2 } },
        settle: { opacity: 1, transition: { duration: 0.001 } },
      }
    : {
        hidden: { opacity: 0, scaleY: 0.995 },
        show: {
          opacity: 1,
          scaleY: 1,
          transition: {
            duration: 0.16,
            ease: 'easeOut',
            when: 'beforeChildren',
            // Children manage their own right-to-left delays; no container stagger
            delayChildren: 0.04,
          },
        },
        settle: {
          scale: [1, 1.008, 1],
          transition: { duration: 0.28, ease: [0.2, 0, 0, 1], delay: 0.85 },
        },
      };

  // Horizon band: broad, slower pass with horizontal stretch and vertical compression.
  // Distinct from Metallic Specular Flash (which is a quick, skewed glint):
  // - No skew, no vertical translation
  // - Longer duration with plateau
  // - Right-to-left sweep via index-based delays
  const letterVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.18 } },
      }
    : {
        hidden: { opacity: 0 },
        show: (i: number) => {
          // Right-to-left delay: later indices lead, earlier lag
          const delayPer = 0.03;
          const count = letters.length;
          const rtlIndex = count - 1 - i;
          const delay = rtlIndex * delayPer;
          return {
            opacity: [0, 1, 1, 1, 1] as number[],
            // Strong highlight with extended plateau, then return to base
            color: [
              'var(--hlp-baseColor)',
              'var(--hlp-highlightColor)',
              'var(--hlp-highlightColor)',
              'var(--hlp-highlightColor)',
              'var(--hlp-baseColor)',
            ] as string[],
            // Wide stretch + slight vertical compression to read as a horizontal band
            scaleX: [1, 1.2, 1.22, 1.06, 1] as number[],
            scaleY: [1, 0.94, 0.96, 0.99, 1] as number[],
            transition: {
              duration: 1.25,
              ease: 'easeInOut',
              times: [0, 0.2, 0.55, 0.85, 1],
              delay,
            },
          };
        },
      };

  return (
    <motion.div
      className="studioLogo-HorizonLightPass"
      data-animation-id="text-effects__horizon-light-pass"
      aria-label={text}
      variants={containerVariants}
      initial="hidden"
      animate={shouldReduceMotion ? 'show' : ['show', 'settle']}
    >
      <div className="studioLogo-HorizonLightPass__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <motion.span
            key={i}
            className="studioLogo-HorizonLightPass__letter"
            variants={letterVariants}
            custom={i}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

export default TextEffectsHorizonLightPass;
