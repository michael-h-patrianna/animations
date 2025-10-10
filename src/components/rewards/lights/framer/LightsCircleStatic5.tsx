import type { AnimationMetadata } from '@/types/animation';
import { calculateBulbColors } from '@/utils/colors';
import { motion, useReducedMotion } from 'framer-motion';
import React, { useMemo } from 'react';
import './LightsCircleStatic5.css';

interface LightsCircleStatic5Props {
  numBulbs?: number;
  onColor?: string;
}

const LightsCircleStatic5: React.FC<LightsCircleStatic5Props> = ({
  numBulbs = 16,
  onColor = '#ffd700'
}) => {
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor]);
  const shouldReduceMotion = useReducedMotion();
  const radius = 80;
  const animationDuration = 4; // seconds
  // Use prime number for pseudo-random sparkle pattern
  const delayPerBulb = (animationDuration * 0.37) / numBulbs;

  const bulbs = Array.from({ length: numBulbs }, (_, i) => {
    const angle = (i * 360) / numBulbs - 90;
    const angleRad = (angle * Math.PI) / 180;
    const x = radius * Math.cos(angleRad);
    const y = radius * Math.sin(angleRad);
    const delay = i * delayPerBulb;

    if (shouldReduceMotion) {
      return (
        <div
          key={i}
          className="lights-circle-static-5__bulb-wrapper"
          style={{
            transform: `translate(${x}px, ${y}px)`,
          }}
        >
          <div className="lights-circle-static-5__glow" />
          <div className="lights-circle-static-5__bulb" />
        </div>
      );
    }

    return (
      <div
        key={i}
        className="lights-circle-static-5__bulb-wrapper"
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
      >
        <motion.div
          className="lights-circle-static-5__glow"
          animate={{
            opacity: [0, 0.3, 1, 0.6, 0.2, 0, 0],
          }}
          transition={{
            duration: animationDuration,
            times: [0, 0.02, 0.04, 0.06, 0.08, 0.10, 1],
            repeat: Infinity,
            ease: [0.42, 0, 0.58, 1] as const,
            delay,
          }}
        />
        <motion.div
          className="lights-circle-static-5__bulb"
          animate={{
            backgroundColor: [
              colors.off,
              colors.offTint30,
              colors.on,
              `color-mix(in srgb, ${colors.on} 95%, ${colors.off} 5%)`,
              colors.offTint30,
              colors.off,
              colors.off
            ],
            boxShadow: [
              `0 0 2px ${colors.offGlow30}`,
              `0 0 4px color-mix(in srgb, ${colors.off} 40%, transparent)`,
              `0 0 12px color-mix(in srgb, ${colors.on} 100%, transparent), 0 0 18px ${colors.onGlow80}`,
              `0 0 8px ${colors.onGlow70}`,
              `0 0 4px color-mix(in srgb, ${colors.off} 40%, transparent)`,
              `0 0 2px ${colors.offGlow30}`,
              `0 0 2px ${colors.offGlow30}`
            ],
          }}
          transition={{
            duration: animationDuration,
            times: [0, 0.02, 0.04, 0.06, 0.08, 0.10, 1],
            repeat: Infinity,
            ease: [0.42, 0, 0.58, 1] as const,
            delay,
          }}
        />
      </div>
    );
  });

  return (
    <div
      className="lights-circle-static-5"
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
      <div className="lights-circle-static-5__container">{bulbs}</div>
    </div>
  );
};

export default LightsCircleStatic5;

export const metadata: AnimationMetadata = {
  id: 'lights__circle-static-5',
  title: 'Random Sparkle',
  description: 'Unpredictable twinkling creates excitement and anticipation like stars in the night sky.',
  tags: ['framer'],
};
