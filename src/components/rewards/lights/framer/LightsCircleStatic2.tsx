import type { AnimationMetadata } from '@/types/animation';
import { calculateBulbColors } from '@/utils/colors';
import { motion } from 'framer-motion';
import React, { useMemo } from 'react';
import './LightsCircleStatic2.css';

interface LightsCircleStatic2Props {
  numBulbs?: number;
  onColor?: string;
}

const LightsCircleStatic2: React.FC<LightsCircleStatic2Props> = ({
  numBulbs = 16,
  onColor = '#ffd700'
}) => {
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor]);
;
  const radius = 80;

  const animationDuration = 1.6; // seconds
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
        className="lights-circle-static-2__bulb-wrapper"
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
      >
        <motion.div
          className="lights-circle-static-2__glow"
          animate={{
            opacity: [0, 0.1, 0.25, 0.45, 0.7, 0.9, 0.9, 0.75, 0.6, 0.4, 0.2, 0.08, 0],
            transition: {
              duration: animationDuration,
              times: [0, 0.0063, 0.0125, 0.0188, 0.025, 0.0313, 0.0625, 0.0688, 0.075, 0.0813, 0.0875, 0.0938, 0.1],
              repeat: Infinity,
              ease: [0.42, 0, 0.58, 1] as const,
              delay
            }
          }}
        />
        <motion.div
          className="lights-circle-static-2__bulb"
          animate={{
            backgroundColor: [
              `var(--bulb-off)`,
              `color-mix(in srgb, var(--bulb-off) 90%, var(--bulb-on) 10%)`,
              `var(--bulb-off-tint30)`,
              `var(--bulb-blend40)`,
              `var(--bulb-blend70)`,
              `var(--bulb-on)`,
              `var(--bulb-on)`,
              `color-mix(in srgb, var(--bulb-on) 95%, var(--bulb-off) 5%)`,
              `var(--bulb-blend70)`,
              `var(--bulb-blend40)`,
              `var(--bulb-off-tint30)`,
              `color-mix(in srgb, var(--bulb-off) 90%, var(--bulb-on) 10%)`,
              `var(--bulb-off)`
            ],
            boxShadow: [
              `0 0 2px var(--bulb-off-glow30)`,
              `0 0 2px var(--bulb-off-glow35)`,
              `0 0 3px color-mix(in srgb, var(--bulb-off) 40%, transparent)`,
              `0 0 5px var(--bulb-on-glow50), 0 0 8px var(--bulb-on-glow35)`,
              `0 0 7px var(--bulb-on-glow70), 0 0 11px var(--bulb-on-glow50)`,
              `0 0 10px color-mix(in srgb, var(--bulb-on) 90%, transparent), 0 0 15px var(--bulb-on-glow70)`,
              `0 0 10px color-mix(in srgb, var(--bulb-on) 90%, transparent), 0 0 15px var(--bulb-on-glow70)`,
              `0 0 8px var(--bulb-on-glow80), 0 0 13px var(--bulb-on-glow60)`,
              `0 0 6px color-mix(in srgb, var(--bulb-on) 65%, transparent), 0 0 10px var(--bulb-on-glow45)`,
              `0 0 4px var(--bulb-on-glow50)`,
              `0 0 3px color-mix(in srgb, var(--bulb-off) 40%, transparent)`,
              `0 0 2px var(--bulb-off-glow35)`,
              `0 0 2px var(--bulb-off-glow30)`
            ],
            transition: {
              duration: animationDuration,
              times: [0, 0.0063, 0.0125, 0.0188, 0.025, 0.0313, 0.0625, 0.0688, 0.075, 0.0813, 0.0875, 0.0938, 0.1],
              repeat: Infinity,
              ease: [0.42, 0, 0.58, 1] as const,
              delay
            }
          }}
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
      <div className="lights-circle-static-2__container">{bulbs}</div>
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
