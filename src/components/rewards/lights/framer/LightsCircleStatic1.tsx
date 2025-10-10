import type { AnimationMetadata } from '@/types/animation';
import { calculateBulbColors } from '@/utils/colors';
import { motion, useReducedMotion } from 'framer-motion';
import React, { useMemo } from 'react';
import './LightsCircleStatic1.css';

interface LightsCircleStatic1Props {
  numBulbs?: number;
  onColor?: string;
}

const LightsCircleStatic1: React.FC<LightsCircleStatic1Props> = ({
  numBulbs = 16,
  onColor = '#ffd700'
}) => {
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor]);
  const shouldReduceMotion = useReducedMotion();
  const radius = 80;

  const bulbs = Array.from({ length: numBulbs }, (_, i) => {
    const angle = (i * 360) / numBulbs - 90;
    const angleRad = (angle * Math.PI) / 180;
    const x = radius * Math.cos(angleRad);
    const y = radius * Math.sin(angleRad);
    const isEven = i % 2 === 0;

    if (shouldReduceMotion) {
      return (
        <div
          key={i}
          className="lights-circle-static-1__bulb-wrapper"
          style={{
            transform: `translate(${x}px, ${y}px)`,
          }}
        >
          <div className="lights-circle-static-1__glow" />
          <div className="lights-circle-static-1__bulb" />
        </div>
      );
    }

    // Animation variants for even/odd bulbs
    const glowVariant = isEven ? {
      opacity: [0.9, 0.4, 0, 0, 0.4, 0.9],
      transition: {
        duration: 1.2,
        times: [0, 0.358, 0.367, 0.767, 0.775, 1],
        repeat: Infinity,
        ease: [0.42, 0, 0.58, 1] as const
      }
    } : {
      opacity: [0, 0.4, 0.9, 0.9, 0.4, 0],
      transition: {
        duration: 1.2,
        times: [0, 0.358, 0.367, 0.767, 0.775, 1],
        repeat: Infinity,
        ease: [0.42, 0, 0.58, 1] as const
      }
    };

    return (
      <div
        key={i}
        className="lights-circle-static-1__bulb-wrapper"
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
      >
        <motion.div
          className="lights-circle-static-1__glow"
          animate={glowVariant}
        />
        <motion.div
          className="lights-circle-static-1__bulb"
          animate={isEven ? {
            backgroundColor: [
              `var(--bulb-on)`,
              `var(--bulb-blend70)`,
              `var(--bulb-off)`,
              `var(--bulb-off)`,
              `var(--bulb-blend70)`,
              `var(--bulb-on)`
            ],
            boxShadow: [
              `0 0 4px var(--bulb-on-glow70), 0 0 6px var(--bulb-on-glow50)`,
              `0 0 2px var(--bulb-on-glow50)`,
              `0 0 2px var(--bulb-off-glow30)`,
              `0 0 2px var(--bulb-off-glow30)`,
              `0 0 2px var(--bulb-on-glow50)`,
              `0 0 4px var(--bulb-on-glow70), 0 0 6px var(--bulb-on-glow50)`
            ],
            transition: {
              duration: 1.2,
              times: [0, 0.358, 0.367, 0.767, 0.775, 1],
              repeat: Infinity,
              ease: [0.42, 0, 0.58, 1] as const
            }
          } : {
            backgroundColor: [
              `var(--bulb-off)`,
              `var(--bulb-blend70)`,
              `var(--bulb-on)`,
              `var(--bulb-on)`,
              `var(--bulb-blend70)`,
              `var(--bulb-off)`
            ],
            boxShadow: [
              `0 0 2px var(--bulb-off-glow30)`,
              `0 0 2px var(--bulb-on-glow50)`,
              `0 0 4px var(--bulb-on-glow70), 0 0 6px var(--bulb-on-glow50)`,
              `0 0 4px var(--bulb-on-glow70), 0 0 6px var(--bulb-on-glow50)`,
              `0 0 2px var(--bulb-on-glow50)`,
              `0 0 2px var(--bulb-off-glow30)`
            ],
            transition: {
              duration: 1.2,
              times: [0, 0.358, 0.367, 0.767, 0.775, 1],
              repeat: Infinity,
              ease: [0.42, 0, 0.58, 1] as const
            }
          }}
        />
      </div>
    );
  });

  return (
    <div
      className="lights-circle-static-1"
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
      <div className="lights-circle-static-1__container">{bulbs}</div>
    </div>
  );
};

export default LightsCircleStatic1;

export const metadata: AnimationMetadata = {
  id: 'lights__circle-static-1',
  title: 'Alternating Carnival',
  description: 'Classic carnival pattern with even/odd bulbs alternating on and off with realistic glow and fadeout.',
  tags: ['framer'],
};
