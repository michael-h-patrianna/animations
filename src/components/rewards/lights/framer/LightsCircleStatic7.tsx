import type { AnimationMetadata } from '@/types/animation';
import { calculateBulbColors } from '@/utils/colors';
import { motion } from 'framer-motion';
import React, { useMemo } from 'react';
import './LightsCircleStatic7.css';

interface LightsCircleStatic7Props {
  numBulbs?: number;
  onColor?: string;
}

const LightsCircleStatic7: React.FC<LightsCircleStatic7Props> = ({
  numBulbs = 16,
  onColor = '#ffd700'
}) => {
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor]);
;
  const radius = 80;
  const animationDuration = 3; // seconds
  const delayPerBulb = animationDuration / numBulbs;

  const bulbs = Array.from({ length: numBulbs }, (_, i) => {
    const angle = (i * 360) / numBulbs - 90;
    const angleRad = (angle * Math.PI) / 180;
    const x = radius * Math.cos(angleRad);
    const y = radius * Math.sin(angleRad);
    const delay = i * delayPerBulb;
    return (
      <div
        key={i}
        className="lights-circle-static-7__bulb-wrapper"
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
      >
        <motion.div
          className="lights-circle-static-7__glow"
          animate={{
            opacity: [0, 1, 0.9, 0.75, 0.6, 0.45, 0.3, 0.15, 0, 0],
          }}
          transition={{
            duration: animationDuration,
            times: [0, 0.01, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 1],
            repeat: Infinity,
            ease: 'linear' as const,
            delay,
          }}
        />
        <motion.div
          className="lights-circle-static-7__bulb"
          animate={{
            backgroundColor: [
              colors.off,
              colors.on,
              colors.on,
              `color-mix(in srgb, ${colors.on} 95%, ${colors.off} 5%)`,
              colors.blend70,
              colors.blend40,
              colors.blend30,
              `color-mix(in srgb, ${colors.off} 90%, ${colors.on} 10%)`,
              colors.off,
              colors.off
            ],
            boxShadow: [
              `0 0 2px ${colors.offGlow30}`,
              `0 0 12px color-mix(in srgb, ${colors.on} 100%, transparent), 0 0 18px ${colors.onGlow80}`,
              `0 0 10px color-mix(in srgb, ${colors.on} 90%, transparent), 0 0 15px ${colors.onGlow70}`,
              `0 0 8px color-mix(in srgb, ${colors.on} 75%, transparent), 0 0 12px color-mix(in srgb, ${colors.on} 55%, transparent)`,
              `0 0 6px ${colors.onGlow60}, 0 0 9px color-mix(in srgb, ${colors.on} 40%, transparent)`,
              `0 0 4px ${colors.onGlow45}`,
              `0 0 3px ${colors.onGlow30}`,
              `0 0 2px ${colors.offGlow35}`,
              `0 0 2px ${colors.offGlow30}`,
              `0 0 2px ${colors.offGlow30}`
            ],
          }}
          transition={{
            duration: animationDuration,
            times: [0, 0.01, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 1],
            repeat: Infinity,
            ease: 'linear' as const,
            delay,
          }}
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
      <div className="lights-circle-static-7__container">{bulbs}</div>
    </div>
  );
};

export default LightsCircleStatic7;

export const metadata: AnimationMetadata = {
  id: 'lights__circle-static-7',
  title: 'Comet Trail',
  description: 'A bright head with a long trailing fadeout creates a comet-like effect around the circle.',
  tags: ['framer'],
};
