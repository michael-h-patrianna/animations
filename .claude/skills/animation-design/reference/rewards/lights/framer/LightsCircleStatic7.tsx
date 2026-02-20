import { calculateBulbColors } from '@/utils/colors';
import * as m from 'motion/react-m'
;
import React, { useMemo } from 'react';
import './LightsCircleStatic7.css';

interface LightsCircleStatic7Props {
  numBulbs?: number;
  onColor?: string;
}

const animationDuration = 3;

// Container variant with staggerChildren for comet trail effect
const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: animationDuration / 16, // Evenly stagger around the circle
    }
  }
};

// Glow variant for comet trail - long gradual fadeout
const glowVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 1, 0.9, 0.75, 0.6, 0.45, 0.3, 0.15, 0, 0],
    transition: {
      duration: animationDuration,
      times: [0, 0.01, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 1],
      repeat: Infinity,
      ease: 'linear' as const
    }
  }
};

// Bulb variant for comet - bright flash followed by long trailing fadeout (35% of duration)
const bulbVariants = {
  hidden: {
    backgroundColor: `var(--bulb-off)`,
    boxShadow: `0 0 2px var(--bulb-off-glow30)`
  },
  show: {
    backgroundColor: [
      `var(--bulb-off)`,
      `var(--bulb-on)`,
      `var(--bulb-on)`,
      `var(--bulb-on-blend-5off)`,
      `var(--bulb-blend70)`,
      `var(--bulb-blend40)`,
      `var(--bulb-blend30)`,
      `var(--bulb-off-blend-10on)`,
      `var(--bulb-off)`,
      `var(--bulb-off)`
    ],
    boxShadow: [
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 12px var(--bulb-on-glow100), 0 0 18px var(--bulb-on-glow80)`,
      `0 0 10px var(--bulb-on-glow90), 0 0 15px var(--bulb-on-glow70)`,
      `0 0 8px var(--bulb-on-glow75), 0 0 12px var(--bulb-on-glow55)`,
      `0 0 6px var(--bulb-on-glow60), 0 0 9px var(--bulb-on-glow40)`,
      `0 0 4px var(--bulb-on-glow45)`,
      `0 0 3px var(--bulb-on-glow30)`,
      `0 0 2px var(--bulb-off-glow35)`,
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 2px var(--bulb-off-glow30)`
    ],
    transition: {
      duration: animationDuration,
      times: [0, 0.01, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 1],
      repeat: Infinity,
      ease: 'linear' as const
    }
  }
};

const LightsCircleStatic7: React.FC<LightsCircleStatic7Props> = ({
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
        className="lights-circle-static-7__bulb-wrapper"
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
      >
        <m.div
          className="lights-circle-static-7__glow"
          variants={glowVariants}
        />
        <m.div
          className="lights-circle-static-7__bulb"
          variants={bulbVariants}
        />
      </div>
    );
  });

  return (
    <div
      className="lights-circle-static-7"
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
      <m.div
        className="lights-circle-static-7__container"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {bulbs}
      </m.div>
    </div>
  );
};

export default LightsCircleStatic7;

