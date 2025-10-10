import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { AnimationMetadata } from '@/types/animation';
import './LightsCircleStatic3.css';
import { calculateBulbColors } from '@/utils/colors';

interface LightsCircleStatic3Props {
  numBulbs?: number;
  onColor?: string;
}

const LightsCircleStatic3: React.FC<LightsCircleStatic3Props> = ({
  numBulbs = 16,
  onColor = '#ffd700'
}) => {
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor]);
  const shouldReduceMotion = useReducedMotion();
  const radius = 80;
  const animationDuration = 5; // seconds
  const delayPerBulb = animationDuration / numBulbs * 0.08;

  const bulbs = Array.from({ length: numBulbs }, (_, i) => {
    const angle = (i * 360) / numBulbs - 90;
    const angleRad = (angle * Math.PI) / 180;
    const x = radius * Math.cos(angleRad);
    const y = radius * Math.sin(angleRad);

    if (shouldReduceMotion) {
      return (
        <div
          key={i}
          className="lights-circle-static-3__bulb-wrapper"
          style={{
            transform: `translate(${x}px, ${y}px)`,
          }}
        >
          <div className="lights-circle-static-3__glow" />
          <div className="lights-circle-static-3__bulb" />
        </div>
      );
    }

    const delay = i * delayPerBulb;
    const isWinner = i === 0;

    return (
      <div
        key={i}
        className="lights-circle-static-3__bulb-wrapper"
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
      >
        <motion.div
          className="lights-circle-static-3__glow"
          animate={isWinner ? {
            opacity: [0, 0, 1, 0.95],
            transition: {
              duration: animationDuration,
              times: [0, 0.79, 0.80, 1],
              repeat: Infinity,
              ease: [0.42, 0, 0.58, 1],
              delay
            }
          } : {
            opacity: [0, 0.8, 0.8, 0.4, 0, 1, 0.8, 0.4, 0],
            transition: {
              duration: animationDuration,
              times: [0, 0.01, 0.04, 0.06, 0.08, 0.30, 0.55, 0.57, 0.59],
              repeat: Infinity,
              ease: [0.42, 0, 0.58, 1],
              delay
            }
          }}
        />
        <motion.div
          className="lights-circle-static-3__bulb"
          animate={isWinner ? {
            backgroundColor: [
              `var(--bulb-off)`,
              `var(--bulb-off)`,
              `var(--bulb-on)`,
              `var(--bulb-on)`
            ],
            boxShadow: [
              `0 0 2px var(--bulb-off-glow30)`,
              `0 0 2px var(--bulb-off-glow30)`,
              `0 0 15px color-mix(in srgb, var(--bulb-on) 100%, transparent), 0 0 25px var(--bulb-on-glow80)`,
              `0 0 15px color-mix(in srgb, var(--bulb-on) 100%, transparent), 0 0 25px var(--bulb-on-glow80)`
            ],
            transition: {
              duration: animationDuration,
              times: [0, 0.79, 0.80, 1],
              repeat: Infinity,
              ease: [0.42, 0, 0.58, 1],
              delay
            }
          } : {
            backgroundColor: [
              `var(--bulb-off)`,
              `var(--bulb-on)`,
              `var(--bulb-on)`,
              `var(--bulb-blend70)`,
              `var(--bulb-off)`,
              `var(--bulb-on)`,
              `var(--bulb-on)`,
              `var(--bulb-blend70)`,
              `var(--bulb-off)`
            ],
            boxShadow: [
              `0 0 2px var(--bulb-off-glow30)`,
              `0 0 8px var(--bulb-on-glow80), 0 0 12px var(--bulb-on-glow60)`,
              `0 0 8px var(--bulb-on-glow80), 0 0 12px var(--bulb-on-glow60)`,
              `0 0 4px var(--bulb-on-glow50)`,
              `0 0 2px var(--bulb-off-glow30)`,
              `0 0 12px color-mix(in srgb, var(--bulb-on) 100%, transparent), 0 0 18px var(--bulb-on-glow80)`,
              `0 0 8px var(--bulb-on-glow80), 0 0 12px var(--bulb-on-glow60)`,
              `0 0 4px var(--bulb-on-glow50)`,
              `0 0 2px var(--bulb-off-glow30)`
            ],
            transition: {
              duration: animationDuration,
              times: [0, 0.01, 0.04, 0.06, 0.08, 0.30, 0.55, 0.57, 0.59],
              repeat: Infinity,
              ease: [0.42, 0, 0.58, 1],
              delay
            }
          }}
        />
      </div>
    );
  });

  return (
    <div
      className="lights-circle-static-3"
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
      <div className="lights-circle-static-3__container">{bulbs}</div>
    </div>
  );
};

export default LightsCircleStatic3;

export const metadata: AnimationMetadata = {
  id: 'lights__circle-static-3',
  title: 'Accelerating Spin',
  description: 'Wheel of fortune spin: starts slow, accelerates to blur, decelerates, and settles on winner with celebration.',
  tags: ['framer'],
};
