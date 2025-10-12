import type { AnimationMetadata } from '@/types/animation';
import { calculateBulbColors } from '@/utils/colors';
import { motion } from 'framer-motion';
import React, { useMemo } from 'react';
import './LightsCircleStatic4.css';

interface LightsCircleStatic4Props {
  numBulbs?: number;
  onColor?: string;
}

const animationDuration = 7;

// Container variant with staggerChildren for reverse chase pattern
const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: (animationDuration / 16) * 0.12, // Stagger for chase effect
    }
  }
};

// Winner bulb glow variant (first bulb - celebration)
const glowVariantsWinner = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0, 1, 1],
    transition: {
      duration: animationDuration,
      times: [0, 0.86, 0.87, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const
    }
  }
};

// Winner bulb variant with dramatic celebration
const bulbVariantsWinner = {
  hidden: {
    backgroundColor: `var(--bulb-off)`,
    boxShadow: `0 0 2px var(--bulb-off-glow30)`
  },
  show: {
    backgroundColor: [
      `var(--bulb-off)`,
      `var(--bulb-off)`,
      `var(--bulb-on)`,
      `var(--bulb-on)`
    ],
    boxShadow: [
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 20px color-mix(in srgb, var(--bulb-on) 100%, transparent), 0 0 30px color-mix(in srgb, var(--bulb-on) 95%, transparent)`,
      `0 0 20px color-mix(in srgb, var(--bulb-on) 100%, transparent), 0 0 30px color-mix(in srgb, var(--bulb-on) 95%, transparent)`
    ],
    transition: {
      duration: animationDuration,
      times: [0, 0.86, 0.87, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const
    }
  }
};

// Regular bulb glow variant
// Phase 1: Counter-clockwise → Phase 2: Clockwise → Phase 3: Synchronized pulses
const glowVariantsRegular = {
  hidden: { opacity: 0 },
  show: {
    opacity: [
      0, 0, 0.85, 0.85, 0.4, 0, // Phase 1: Counter-clockwise
      0, 0.85, 0.85, 0.4, 0, // Phase 2: Clockwise
      0, 0.9, 0.9, 0, 0.9, 0.9, 0, 0.9, 0.9, 0 // Phase 3: Pulse
    ],
    transition: {
      duration: animationDuration,
      times: [0, 0.02, 0.06, 0.06, 0.08, 0.35, 0.42, 0.46, 0.46, 0.47, 0.65, 0.68, 0.70, 0.70, 0.71, 0.75, 0.77, 0.77, 0.78, 0.82, 0.84, 0.84, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const
    }
  }
};

// Regular bulb variant with complex multi-phase animation
const bulbVariantsRegular = {
  hidden: {
    backgroundColor: `var(--bulb-off)`,
    boxShadow: `0 0 2px var(--bulb-off-glow30)`
  },
  show: {
    backgroundColor: [
      `var(--bulb-off)`, `var(--bulb-off)`, `var(--bulb-on)`, `var(--bulb-on)`, `var(--bulb-blend70)`, `var(--bulb-off)`, // Phase 1
      `var(--bulb-off)`, `var(--bulb-on)`, `var(--bulb-on)`, `var(--bulb-blend70)`, `var(--bulb-off)`, // Phase 2
      `var(--bulb-off)`, `var(--bulb-on)`, `var(--bulb-on)`, `var(--bulb-off)`, `var(--bulb-on)`, `var(--bulb-on)`, `var(--bulb-off)`, `var(--bulb-on)`, `var(--bulb-on)`, `var(--bulb-off)` // Phase 3
    ],
    boxShadow: [
      `0 0 2px var(--bulb-off-glow30)`, `0 0 2px var(--bulb-off-glow30)`, `0 0 9px color-mix(in srgb, var(--bulb-on) 85%, transparent), 0 0 14px color-mix(in srgb, var(--bulb-on) 65%, transparent)`, `0 0 9px color-mix(in srgb, var(--bulb-on) 85%, transparent), 0 0 14px color-mix(in srgb, var(--bulb-on) 65%, transparent)`, `0 0 5px color-mix(in srgb, var(--bulb-on) 55%, transparent)`, `0 0 2px var(--bulb-off-glow30)`,
      `0 0 2px var(--bulb-off-glow30)`, `0 0 9px color-mix(in srgb, var(--bulb-on) 85%, transparent), 0 0 14px color-mix(in srgb, var(--bulb-on) 65%, transparent)`, `0 0 9px color-mix(in srgb, var(--bulb-on) 85%, transparent), 0 0 14px color-mix(in srgb, var(--bulb-on) 65%, transparent)`, `0 0 5px color-mix(in srgb, var(--bulb-on) 55%, transparent)`, `0 0 2px var(--bulb-off-glow30)`,
      `0 0 2px var(--bulb-off-glow30)`, `0 0 10px color-mix(in srgb, var(--bulb-on) 90%, transparent), 0 0 16px var(--bulb-on-glow70)`, `0 0 10px color-mix(in srgb, var(--bulb-on) 90%, transparent), 0 0 16px var(--bulb-on-glow70)`, `0 0 2px var(--bulb-off-glow30)`, `0 0 10px color-mix(in srgb, var(--bulb-on) 90%, transparent), 0 0 16px var(--bulb-on-glow70)`, `0 0 10px color-mix(in srgb, var(--bulb-on) 90%, transparent), 0 0 16px var(--bulb-on-glow70)`, `0 0 2px var(--bulb-off-glow30)`, `0 0 10px color-mix(in srgb, var(--bulb-on) 90%, transparent), 0 0 16px var(--bulb-on-glow70)`, `0 0 10px color-mix(in srgb, var(--bulb-on) 90%, transparent), 0 0 16px var(--bulb-on-glow70)`, `0 0 2px var(--bulb-off-glow30)`
    ],
    transition: {
      duration: animationDuration,
      times: [0, 0.02, 0.06, 0.06, 0.08, 0.35, 0.42, 0.46, 0.46, 0.47, 0.65, 0.68, 0.70, 0.70, 0.71, 0.75, 0.77, 0.77, 0.78, 0.82, 0.84, 0.84, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const
    }
  }
};

const LightsCircleStatic4: React.FC<LightsCircleStatic4Props> = ({
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
    const isWinner = i === 0;

    return (
      <div
        key={i}
        className="lights-circle-static-4__bulb-wrapper"
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
      >
        <motion.div
          className="lights-circle-static-4__glow"
          variants={isWinner ? glowVariantsWinner : glowVariantsRegular}
        />
        <motion.div
          className="lights-circle-static-4__bulb"
          variants={isWinner ? bulbVariantsWinner : bulbVariantsRegular}
        />
      </div>
    );
  });

  return (
    <div
      className="lights-circle-static-4"
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
        className="lights-circle-static-4__container"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {bulbs}
      </motion.div>
    </div>
  );
};

export default LightsCircleStatic4;

export const metadata: AnimationMetadata = {
  id: 'lights__circle-static-4',
  title: 'Reverse Chase Pulse',
  description: 'Counter-clockwise chase followed by faster clockwise motion, then synchronized pulses before revealing the winner.',
  tags: ['framer'],
};
