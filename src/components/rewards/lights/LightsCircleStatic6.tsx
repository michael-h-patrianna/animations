import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { AnimationMetadata } from '@/types/animation';
import './LightsCircleStatic6.css';
import { calculateBulbColors } from '@/utils/colors';

interface LightsCircleStatic6Props {
  numBulbs?: number;
  onColor?: string;
}

const LightsCircleStatic6: React.FC<LightsCircleStatic6Props> = ({
  numBulbs = 16,
  onColor = '#ffd700'
}) => {
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor]);
  const shouldReduceMotion = useReducedMotion();
  const radius = 80;
  const animationDuration = 4.8; // seconds - divisible by 3 for waltz timing

  // Waltz pattern: groups of 3 bulbs
  const groupSize = 3;
  const numGroups = Math.ceil(numBulbs / groupSize);
  const delayPerGroup = animationDuration / numGroups;

  const bulbs = Array.from({ length: numBulbs }, (_, i) => {
    const angle = (i * 360) / numBulbs - 90;
    const angleRad = (angle * Math.PI) / 180;
    const x = radius * Math.cos(angleRad);
    const y = radius * Math.sin(angleRad);

    const groupIndex = Math.floor(i / groupSize);
    const positionInGroup = i % groupSize; // 0 = strong beat, 1-2 = weak beats
    const baseDelay = groupIndex * delayPerGroup;
    const beatDelay = positionInGroup * 0.15; // Stagger beats within group
    const totalDelay = baseDelay + beatDelay;

    if (shouldReduceMotion) {
      return (
        <div
          key={i}
          className={`lights-circle-static-6__bulb-wrapper beat-${positionInGroup + 1}`}
          style={{
            transform: `translate(${x}px, ${y}px)`,
          }}
        >
          <div className="lights-circle-static-6__glow" />
          <div className="lights-circle-static-6__bulb" />
        </div>
      );
    }

    // Strong beat (position 0)
    if (positionInGroup === 0) {
      return (
        <div
          key={i}
          className={`lights-circle-static-6__bulb-wrapper beat-${positionInGroup + 1}`}
          style={{
            transform: `translate(${x}px, ${y}px)`,
          }}
        >
          <motion.div
            className="lights-circle-static-6__glow"
            animate={{
              opacity: [0, 0.4, 1, 1, 0.7, 0.3, 0, 0],
            }}
            transition={{
              duration: animationDuration,
              times: [0, 0.01, 0.03, 0.08, 0.10, 0.12, 0.14, 1],
              repeat: Infinity,
              ease: [0.42, 0, 0.58, 1],
              delay: totalDelay,
            }}
          />
          <motion.div
            className="lights-circle-static-6__bulb"
            animate={{
              backgroundColor: [
                colors.off,
                colors.offTint30,
                colors.on,
                colors.on,
                `color-mix(in srgb, ${colors.on} 95%, ${colors.off} 5%)`,
                colors.offTint30,
                colors.off,
                colors.off
              ],
              boxShadow: [
                `none`,
                `0 0 4px color-mix(in srgb, ${colors.off} 40%, transparent)`,
                `0 0 12px color-mix(in srgb, ${colors.on} 100%, transparent), 0 0 18px ${colors.onGlow80}`,
                `0 0 12px color-mix(in srgb, ${colors.on} 100%, transparent), 0 0 18px ${colors.onGlow80}`,
                `0 0 8px ${colors.onGlow70}`,
                `0 0 4px color-mix(in srgb, ${colors.off} 40%, transparent)`,
                `none`,
                `none`
              ],
            }}
            transition={{
              duration: animationDuration,
              times: [0, 0.01, 0.03, 0.08, 0.10, 0.12, 0.14, 1],
              repeat: Infinity,
              ease: [0.42, 0, 0.58, 1],
              delay: totalDelay,
            }}
          />
        </div>
      );
    }

    // Weak beats (positions 1 and 2)
    return (
      <div
        key={i}
        className={`lights-circle-static-6__bulb-wrapper beat-${positionInGroup + 1}`}
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
      >
        <motion.div
          className="lights-circle-static-6__glow"
          animate={{
            opacity: [0, 0.2, 0.7, 0.7, 0.4, 0.15, 0, 0],
          }}
          transition={{
            duration: animationDuration,
            times: [0, 0.01, 0.02, 0.05, 0.07, 0.09, 0.11, 1],
            repeat: Infinity,
            ease: [0.42, 0, 0.58, 1],
            delay: totalDelay,
          }}
        />
        <motion.div
          className="lights-circle-static-6__bulb"
          animate={{
            backgroundColor: [
              colors.off,
              colors.offTint20,
              colors.blend70,
              colors.blend70,
              colors.blend40,
              colors.offTint20,
              colors.off,
              colors.off
            ],
            boxShadow: [
              `none`,
              `0 0 3px ${colors.offGlow35}`,
              `0 0 7px ${colors.onGlow70}, 0 0 10px ${colors.onGlow50}`,
              `0 0 7px ${colors.onGlow70}, 0 0 10px ${colors.onGlow50}`,
              `0 0 5px ${colors.onGlow50}`,
              `0 0 3px ${colors.offGlow35}`,
              `none`,
              `none`
            ],
          }}
          transition={{
            duration: animationDuration,
            times: [0, 0.01, 0.02, 0.05, 0.07, 0.09, 0.11, 1],
            repeat: Infinity,
            ease: [0.42, 0, 0.58, 1],
            delay: totalDelay,
          }}
        />
      </div>
    );
  });

  return (
    <div
      className="lights-circle-static-6"
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
      <div className="lights-circle-static-6__container">{bulbs}</div>
    </div>
  );
};

export default LightsCircleStatic6;

export const metadata: AnimationMetadata = {
  id: 'lights__circle-static-6',
  title: 'Carnival Waltz',
  description: 'Musical waltz pattern with groups of 3 bulbs following strong-weak-weak rhythm, like carnival organ music.',
  tags: ['framer'],
};
