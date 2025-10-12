import type { AnimationMetadata } from '@/types/animation';
import { calculateBulbColors } from '@/utils/colors';
import { motion } from 'framer-motion';
import React, { useMemo } from 'react';
import './LightsCircleStatic8.css';

interface LightsCircleStatic8Props {
  numBulbs?: number;
  onColor?: string;
}

const animationDuration = 4;

// Container variant - we'll handle stagger timing manually because first half
// and second half need different chase directions
const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0, // No stagger at container level - we handle it manually
    }
  }
};

// Regular bulb glow variant
const glowVariantsRegular = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0.3, 0.9, 0.9, 0.6, 0.2, 0, 0],
    transition: {
      duration: animationDuration,
      times: [0, 0.02, 0.04, 0.08, 0.10, 0.12, 0.14, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const
    }
  }
};

// Regular bulb variant
const bulbVariantsRegular = {
  hidden: {
    backgroundColor: `var(--bulb-off)`,
    boxShadow: `0 0 2px var(--bulb-off-glow30)`
  },
  show: {
    backgroundColor: [
      `var(--bulb-off)`,
      `var(--bulb-off-tint30)`,
      `var(--bulb-on)`,
      `var(--bulb-on)`,
      `color-mix(in srgb, var(--bulb-on) 95%, var(--bulb-off) 5%)`,
      `var(--bulb-off-tint30)`,
      `var(--bulb-off)`,
      `var(--bulb-off)`
    ],
    boxShadow: [
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 4px color-mix(in srgb, var(--bulb-off) 40%, transparent)`,
      `0 0 10px color-mix(in srgb, var(--bulb-on) 90%, transparent), 0 0 15px var(--bulb-on-glow70)`,
      `0 0 10px color-mix(in srgb, var(--bulb-on) 90%, transparent), 0 0 15px var(--bulb-on-glow70)`,
      `0 0 7px var(--bulb-on-glow70)`,
      `0 0 4px color-mix(in srgb, var(--bulb-off) 40%, transparent)`,
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 2px var(--bulb-off-glow30)`
    ],
    transition: {
      duration: animationDuration,
      times: [0, 0.02, 0.04, 0.08, 0.10, 0.12, 0.14, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const
    }
  }
};

// Collision bulb glow variant (where they meet with white flash)
const glowVariantsCollision = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0.4, 1, 1, 1, 0.7, 0.3, 0, 0],
    transition: {
      duration: animationDuration,
      times: [0, 0.02, 0.04, 0.06, 0.08, 0.10, 0.12, 0.14, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const
    }
  }
};

// Collision bulb variant with white flash at collision point
const bulbVariantsCollision = {
  hidden: {
    backgroundColor: `var(--bulb-off)`,
    boxShadow: `0 0 2px var(--bulb-off-glow30)`
  },
  show: {
    backgroundColor: [
      `var(--bulb-off)`,
      `var(--bulb-off-tint30)`,
      `var(--bulb-on)`,
      `#fff`,
      `var(--bulb-on)`,
      `color-mix(in srgb, var(--bulb-on) 95%, var(--bulb-off) 5%)`,
      `var(--bulb-off-tint30)`,
      `var(--bulb-off)`,
      `var(--bulb-off)`
    ],
    boxShadow: [
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 4px color-mix(in srgb, var(--bulb-off) 40%, transparent)`,
      `0 0 15px color-mix(in srgb, var(--bulb-on) 100%, transparent), 0 0 22px color-mix(in srgb, var(--bulb-on) 90%, transparent)`,
      `0 0 20px color-mix(in srgb, #fff 100%, transparent), 0 0 30px color-mix(in srgb, var(--bulb-on) 100%, transparent)`,
      `0 0 15px color-mix(in srgb, var(--bulb-on) 100%, transparent), 0 0 22px color-mix(in srgb, var(--bulb-on) 90%, transparent)`,
      `0 0 10px var(--bulb-on-glow80)`,
      `0 0 4px color-mix(in srgb, var(--bulb-off) 40%, transparent)`,
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 2px var(--bulb-off-glow30)`
    ],
    transition: {
      duration: animationDuration,
      times: [0, 0.02, 0.04, 0.06, 0.08, 0.10, 0.12, 0.14, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const
    }
  }
};

const LightsCircleStatic8: React.FC<LightsCircleStatic8Props> = ({
  numBulbs = 16,
  onColor = '#ffd700'
}) => {
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor]);
  const radius = 80;
  const halfBulbs = Math.floor(numBulbs / 2);
  const delayPerBulb = animationDuration / halfBulbs;

  const bulbs = Array.from({ length: numBulbs }, (_, i) => {
    const angle = (i * 360) / numBulbs - 90;
    const angleRad = (angle * Math.PI) / 180;
    const x = radius * Math.cos(angleRad);
    const y = radius * Math.sin(angleRad);

    // First half chases clockwise, second half counter-clockwise
    const isFirstHalf = i < halfBulbs;
    const chaseIndex = isFirstHalf ? i : numBulbs - i - 1;
    const delay = chaseIndex * delayPerBulb;

    // Check if this is a collision bulb (where they meet)
    const isCollisionBulb = (isFirstHalf && i === halfBulbs - 1) || (!isFirstHalf && i === halfBulbs);

    // Create custom variants with delay
    const customGlowVariants = {
      hidden: { opacity: 0 },
      show: {
        ...((isCollisionBulb ? glowVariantsCollision : glowVariantsRegular).show as any),
        transition: {
          ...((isCollisionBulb ? glowVariantsCollision : glowVariantsRegular).show as any).transition,
          delay,
        }
      }
    };

    const customBulbVariants = {
      hidden: (isCollisionBulb ? bulbVariantsCollision : bulbVariantsRegular).hidden,
      show: {
        ...((isCollisionBulb ? bulbVariantsCollision : bulbVariantsRegular).show as any),
        transition: {
          ...((isCollisionBulb ? bulbVariantsCollision : bulbVariantsRegular).show as any).transition,
          delay,
        }
      }
    };

    return (
      <div
        key={i}
        className={`lights-circle-static-8__bulb-wrapper ${isFirstHalf ? 'first-half' : 'second-half'}`}
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
      >
        <motion.div
          className="lights-circle-static-8__glow"
          variants={customGlowVariants}
        />
        <motion.div
          className="lights-circle-static-8__bulb"
          variants={customBulbVariants}
        />
      </div>
    );
  });

  return (
    <div
      className="lights-circle-static-8"
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
        className="lights-circle-static-8__container"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {bulbs}
      </motion.div>
    </div>
  );
};

export default LightsCircleStatic8;

export const metadata: AnimationMetadata = {
  id: 'lights__circle-static-8',
  title: 'Dual Convergence',
  description: 'Two lights chase from opposite sides, meeting with a dramatic collision flash.',
  tags: ['framer'],
};
