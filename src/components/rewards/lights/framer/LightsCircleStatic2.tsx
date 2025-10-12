import type { AnimationMetadata } from '@/types/animation';
import { calculateBulbColors } from '@/utils/colors';
import { motion } from 'framer-motion';
import React, { useMemo } from 'react';
import './LightsCircleStatic2.css';

interface LightsCircleStatic2Props {
  numBulbs?: number;
  onColor?: string;
}

const animationDuration = 1.6;

// Container variant with staggerChildren for sequential chase
const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: animationDuration / 16, // Stagger evenly across all bulbs
    }
  }
};

// Glow variant for chase effect
const glowVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0.1, 0.25, 0.45, 0.7, 0.9, 0.9, 0.75, 0.6, 0.4, 0.2, 0.08, 0],
    transition: {
      duration: animationDuration,
      times: [0, 0.0063, 0.0125, 0.0188, 0.025, 0.0313, 0.0625, 0.0688, 0.075, 0.0813, 0.0875, 0.0938, 0.1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const
    }
  }
};

// Bulb variant for chase effect with smooth ramp up/down
const bulbVariants = {
  hidden: {
    backgroundColor: `var(--bulb-off)`,
    boxShadow: `0 0 2px var(--bulb-off-glow30)`
  },
  show: {
    backgroundColor: [
      `var(--bulb-off)`,
      `var(--bulb-off-blend-10on)`,
      `var(--bulb-off-tint30)`,
      `var(--bulb-blend40)`,
      `var(--bulb-blend70)`,
      `var(--bulb-on)`,
      `var(--bulb-on)`,
      `var(--bulb-on-blend-5off)`,
      `var(--bulb-blend70)`,
      `var(--bulb-blend40)`,
      `var(--bulb-off-tint30)`,
      `var(--bulb-off-blend-10on)`,
      `var(--bulb-off)`
    ],
    boxShadow: [
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 2px var(--bulb-off-glow35)`,
      `0 0 3px var(--bulb-off-glow40)`,
      `0 0 5px var(--bulb-on-glow50), 0 0 8px var(--bulb-on-glow35)`,
      `0 0 7px var(--bulb-on-glow70), 0 0 11px var(--bulb-on-glow50)`,
      `0 0 10px var(--bulb-on-glow90), 0 0 15px var(--bulb-on-glow70)`,
      `0 0 10px var(--bulb-on-glow90), 0 0 15px var(--bulb-on-glow70)`,
      `0 0 8px var(--bulb-on-glow80), 0 0 13px var(--bulb-on-glow60)`,
      `0 0 6px var(--bulb-on-glow65), 0 0 10px var(--bulb-on-glow45)`,
      `0 0 4px var(--bulb-on-glow50)`,
      `0 0 3px var(--bulb-off-glow40)`,
      `0 0 2px var(--bulb-off-glow35)`,
      `0 0 2px var(--bulb-off-glow30)`
    ],
    transition: {
      duration: animationDuration,
      times: [0, 0.0063, 0.0125, 0.0188, 0.025, 0.0313, 0.0625, 0.0688, 0.075, 0.0813, 0.0875, 0.0938, 0.1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const
    }
  }
};

const LightsCircleStatic2: React.FC<LightsCircleStatic2Props> = ({
  numBulbs = 16,
  onColor = '#ffd700'
}) => {
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor]);
  const radius = 80;

  const bulbs = Array.from({ length: numBulbs }, (_, i) => {
    const angle = (i * 360) / numBulbs - 90;
    const angleRad = (angle * Math.PI) / 180;
    const x = radius * Math.cos(angleRad);
    const y = radius * Math.sin(angleRad);

    return (
      <div
        key={i}
        className="lights-circle-static-2__bulb-wrapper"
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
      >
        <motion.div
          className="lights-circle-static-2__glow"
          variants={glowVariants}
        />
        <motion.div
          className="lights-circle-static-2__bulb"
          variants={bulbVariants}
        />
      </div>
    );
  });

  return (
    <div
      className="lights-circle-static-2"
      style={{
        '--bulb-on': colors.on,
        '--bulb-off': colors.off,
        '--bulb-blend90': colors.blend90,
        '--bulb-blend80': colors.blend80,
        '--bulb-blend70': colors.blend70,
        '--bulb-blend60': colors.blend60,
        '--bulb-blend40': colors.blend40,
        '--bulb-blend30': colors.blend30,
        '--bulb-blend20': colors.blend20,
        '--bulb-blend10': colors.blend10,
        '--bulb-off-tint30': colors.offTint30,
        '--bulb-off-tint20': colors.offTint20,
        '--bulb-on-gradient': colors.onGradient,
        '--bulb-off-blend-10on': colors.offBlend10On,
        '--bulb-on-blend-5off': colors.onBlend5Off,
        '--bulb-on-blend-10off': colors.onBlend10Off,
        '--bulb-on-glow90': colors.onGlow90,
        '--bulb-on-glow100': colors.onGlow100,
        '--bulb-on-glow95': colors.onGlow95,
        '--bulb-on-glow75': colors.onGlow75,
        '--bulb-on-glow55': colors.onGlow55,
        '--bulb-white-glow100': colors.whiteGlow100,
        '--bulb-on-glow65': colors.onGlow65,
        '--bulb-on-glow40': colors.onGlow40,
        '--bulb-off-glow40': colors.offGlow40,
        '--bulb-on-glow80': colors.onGlow80,
        '--bulb-on-glow70': colors.onGlow70,
        '--bulb-on-glow60': colors.onGlow60,
        '--bulb-on-glow50': colors.onGlow50,
        '--bulb-on-glow45': colors.onGlow45,
        '--bulb-on-glow35': colors.onGlow35,
        '--bulb-on-glow30': colors.onGlow30,
        '--bulb-off-glow35': colors.offGlow35,
        '--bulb-off-glow30': colors.offGlow30,
      } as React.CSSProperties}
    >
      <motion.div
        className="lights-circle-static-2__container"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {bulbs}
      </motion.div>
    </div>
  );
};

export default LightsCircleStatic2;

export const metadata: AnimationMetadata = {
  id: 'lights__circle-static-2',
  title: 'Sequential Chase',
  description: 'Single lit bulb chases around the circle creating a smooth rotating motion effect.',
  tags: ['framer'],
};
