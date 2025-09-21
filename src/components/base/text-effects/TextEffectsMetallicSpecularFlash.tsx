/**
 * Standalone: Copy this file and TextEffectsMetallicSpecularFlash.css into your app.
 * Runtime deps: react, framer-motion
 * RN parity: transforms/opacity/color only; port the variants/timing to Reanimated/Moti.
 */
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import React from 'react';
import './TextEffectsMetallicSpecularFlash.css';

export function TextEffectsMetallicSpecularFlash() {
  const text = 'LORUM IPSUM DOLOR';
  const shouldReduceMotion = useReducedMotion();

  const letters = React.useMemo(() => Array.from(text), [text]);

  const containerVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.2 } },
        settle: { opacity: 1, transition: { duration: 0.001 } },
      }
    : {
        hidden: { opacity: 0, scaleX: 0.995 },
        show: {
          opacity: 1,
          scaleX: 1,
          transition: {
            duration: 0.14,
            ease: 'easeOut',
            when: 'beforeChildren',
            staggerChildren: 0.02, // very quick, crisp pass
            delayChildren: 0.05,
          },
        },
        settle: {
          scale: [1, 1.01, 1],
          transition: { duration: 0.32, ease: [0.2, 0, 0, 1], delay: 0.55 },
        },
      };

  // Narrow, sharp specular sweep: brief color highlight then shadow, with scaleX + skewX
  const letterVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.14 } },
      }
    : {
        hidden: { opacity: 0 },
        show: {
          opacity: [0, 1, 1, 1] as number[],
          // Highlight → Shadow → Base for a metallic glint
          color: [
            'var(--msf-baseColor)',
            'var(--msf-highlightColor)',
            'var(--msf-shadowColor)',
            'var(--msf-baseColor)',
          ] as string[],
          // No vertical motion; pure horizontal deformation
          skewX: [0, 4, -1, 0] as number[],
          scaleX: [1, 1.08, 0.995, 1] as number[],
          transition: {
            duration: 0.42,
            ease: 'easeInOut',
            times: [0, 0.25, 0.55, 1],
          },
        },
      };

  return (
    <motion.div
      className="studioLogo-MetallicSpecularFlash"
      data-animation-id="text-effects__metallic-specular-flash"
      aria-label={text}
      variants={containerVariants}
      initial="hidden"
      animate={shouldReduceMotion ? 'show' : ['show', 'settle']}
    >
      <div className="studioLogo-MetallicSpecularFlash__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <motion.span
            key={i}
            className="studioLogo-MetallicSpecularFlash__letter"
            variants={letterVariants}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

export default TextEffectsMetallicSpecularFlash;
