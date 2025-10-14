import { calculateBulbColors } from '@/utils/colors';
import * as m from 'motion/react-m'
;
import React, { useMemo } from 'react';
import './LightsCircleStatic6.css';

interface LightsCircleStatic6Props {
  numBulbs?: number;
  onColor?: string;
}

const animationDuration = 4.8; // Divisible by 3 for waltz timing
const groupSize = 3;

// Container variant with staggerChildren for waltz group pattern
// Note: We cannot use staggerChildren for the waltz pattern because each group member
// needs a different animation AND a different delay offset within the group.
// The parent container will not stagger, but we'll handle timing via custom delays.
const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0, // No stagger at container level
    }
  }
};

// Strong beat glow variant (1st in group) - brightest and longest
const glowVariantsStrong = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0.4, 1, 1, 0.7, 0.3, 0, 0],
    transition: {
      duration: animationDuration,
      times: [0, 0.01, 0.03, 0.08, 0.10, 0.12, 0.14, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const
    }
  }
};

// Strong beat bulb variant (1st in group)
const bulbVariantsStrong = {
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
      `var(--bulb-on-blend-5off)`,
      `var(--bulb-off-tint30)`,
      `var(--bulb-off)`,
      `var(--bulb-off)`
    ],
    boxShadow: [
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 4px var(--bulb-off-glow40)`,
      `0 0 12px var(--bulb-on-glow100), 0 0 18px var(--bulb-on-glow80)`,
      `0 0 12px var(--bulb-on-glow100), 0 0 18px var(--bulb-on-glow80)`,
      `0 0 8px var(--bulb-on-glow70)`,
      `0 0 4px var(--bulb-off-glow40)`,
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 2px var(--bulb-off-glow30)`
    ],
    transition: {
      duration: animationDuration,
      times: [0, 0.01, 0.03, 0.08, 0.10, 0.12, 0.14, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const
    }
  }
};

// Weak beat glow variant (2nd and 3rd in group) - dimmer and shorter
const glowVariantsWeak = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0.2, 0.7, 0.7, 0.4, 0.15, 0, 0],
    transition: {
      duration: animationDuration,
      times: [0, 0.01, 0.02, 0.05, 0.07, 0.09, 0.11, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const
    }
  }
};

// Weak beat bulb variant (2nd and 3rd in group)
const bulbVariantsWeak = {
  hidden: {
    backgroundColor: `var(--bulb-off)`,
    boxShadow: `0 0 2px var(--bulb-off-glow30)`
  },
  show: {
    backgroundColor: [
      `var(--bulb-off)`,
      `var(--bulb-off-tint20)`,
      `var(--bulb-blend70)`,
      `var(--bulb-blend70)`,
      `var(--bulb-blend40)`,
      `var(--bulb-off-tint20)`,
      `var(--bulb-off)`,
      `var(--bulb-off)`
    ],
    boxShadow: [
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 3px var(--bulb-off-glow35)`,
      `0 0 7px var(--bulb-on-glow70), 0 0 10px var(--bulb-on-glow50)`,
      `0 0 7px var(--bulb-on-glow70), 0 0 10px var(--bulb-on-glow50)`,
      `0 0 5px var(--bulb-on-glow50)`,
      `0 0 3px var(--bulb-off-glow35)`,
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 2px var(--bulb-off-glow30)`
    ],
    transition: {
      duration: animationDuration,
      times: [0, 0.01, 0.02, 0.05, 0.07, 0.09, 0.11, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const
    }
  }
};

const LightsCircleStatic6: React.FC<LightsCircleStatic6Props> = ({
  numBulbs = 16,
  onColor = '#ffd700'
}) => {
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor]);
  const radius = 80;
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

    const isStrongBeat = positionInGroup === 0;

    // Create custom transition with delay for this specific bulb
    const customGlowVariants = {
      hidden: { opacity: 0 },
      show: {
        ...((isStrongBeat ? glowVariantsStrong : glowVariantsWeak).show as any),
        transition: {
          ...((isStrongBeat ? glowVariantsStrong : glowVariantsWeak).show as any).transition,
          delay: totalDelay,
        }
      }
    };

    const customBulbVariants = {
      hidden: (isStrongBeat ? bulbVariantsStrong : bulbVariantsWeak).hidden,
      show: {
        ...((isStrongBeat ? bulbVariantsStrong : bulbVariantsWeak).show as any),
        transition: {
          ...((isStrongBeat ? bulbVariantsStrong : bulbVariantsWeak).show as any).transition,
          delay: totalDelay,
        }
      }
    };

    return (
      <div
        key={i}
        className={`lights-circle-static-6__bulb-wrapper beat-${positionInGroup + 1}`}
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
      >
        <m.div
          className="lights-circle-static-6__glow"
          variants={customGlowVariants}
        />
        <m.div
          className="lights-circle-static-6__bulb"
          variants={customBulbVariants}
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
        className="lights-circle-static-6__container"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {bulbs}
      </m.div>
    </div>
  );
};

export default LightsCircleStatic6;

