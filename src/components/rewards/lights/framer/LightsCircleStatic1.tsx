import { calculateBulbColors } from '@/utils/colors'
import * as m from 'motion/react-m'
import React, { useMemo } from 'react'
import './LightsCircleStatic1.css';

interface LightsCircleStatic1Props {
  numBulbs?: number;
  onColor?: string;
}

const animationDuration = 1.2;

// Container variant with staggerChildren
const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0, // No stagger for alternating pattern
    }
  }
};

// Define variants for even bulbs with multi-layer glow effects
const glowOuterVariantsEven = {
  hidden: { opacity: 0.65 },
  show: {
    opacity: [0.65, 0.3, 0, 0, 0.3, 0.65],
    transition: {
      duration: animationDuration,
      times: [0, 0.358, 0.367, 0.767, 0.775, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const
    }
  }
};

const glowInnerVariantsEven = {
  hidden: { opacity: 0.8 },
  show: {
    opacity: [0.8, 0.4, 0, 0, 0.4, 0.8],
    transition: {
      duration: animationDuration,
      times: [0, 0.358, 0.367, 0.767, 0.775, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const
    }
  }
};

const filamentVariantsEven = {
  hidden: { opacity: 0.85 },
  show: {
    opacity: [0.85, 0.4, 0, 0, 0.4, 0.85],
    transition: {
      duration: animationDuration,
      times: [0, 0.358, 0.367, 0.767, 0.775, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const
    }
  }
};

const bulbVariantsEven = {
  hidden: {
    background: `radial-gradient(circle at 40% 40%, var(--bulb-on), var(--bulb-on-gradient))`,
    boxShadow: `0 0 4px var(--bulb-on-glow70), 0 0 6px var(--bulb-on-glow50)`,
    transform: `translate(-50%, -50%) scale(1.12) rotate(1.5deg)`,
    borderColor: `rgba(255, 255, 255, 0.35)`
  },
  show: {
    background: [
      `radial-gradient(circle at 40% 40%, var(--bulb-on), var(--bulb-on-gradient))`,
      `var(--bulb-blend70)`,
      `var(--bulb-off)`,
      `var(--bulb-off)`,
      `var(--bulb-blend70)`,
      `radial-gradient(circle at 40% 40%, var(--bulb-on), var(--bulb-on-gradient))`
    ],
    boxShadow: [
      `0 0 4px var(--bulb-on-glow70), 0 0 6px var(--bulb-on-glow50)`,
      `0 0 2px var(--bulb-on-glow50)`,
      `none`,
      `none`,
      `0 0 2px var(--bulb-on-glow50)`,
      `0 0 4px var(--bulb-on-glow70), 0 0 6px var(--bulb-on-glow50)`
    ],
    transform: [
      `translate(-50%, -50%) scale(1.12) rotate(1.5deg)`,
      `translate(-50%, -50%) scale(1.06) rotate(0.75deg)`,
      `translate(-50%, -50%) scale(1) rotate(0deg)`,
      `translate(-50%, -50%) scale(1) rotate(0deg)`,
      `translate(-50%, -50%) scale(1.06) rotate(0.75deg)`,
      `translate(-50%, -50%) scale(1.12) rotate(1.5deg)`
    ],
    borderColor: [
      `rgba(255, 255, 255, 0.35)`,
      `rgba(255, 255, 255, 0.22)`,
      `rgba(255, 255, 255, 0.1)`,
      `rgba(255, 255, 255, 0.1)`,
      `rgba(255, 255, 255, 0.22)`,
      `rgba(255, 255, 255, 0.35)`
    ],
    transition: {
      duration: animationDuration,
      times: [0, 0.358, 0.367, 0.767, 0.775, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const
    }
  }
};

// Define variants for odd bulbs with multi-layer glow effects
const glowOuterVariantsOdd = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0.3, 0.65, 0.65, 0.3, 0],
    transition: {
      duration: animationDuration,
      times: [0, 0.358, 0.367, 0.767, 0.775, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const
    }
  }
};

const glowInnerVariantsOdd = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0.4, 0.8, 0.8, 0.4, 0],
    transition: {
      duration: animationDuration,
      times: [0, 0.358, 0.367, 0.767, 0.775, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const
    }
  }
};

const filamentVariantsOdd = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0.4, 0.85, 0.85, 0.4, 0],
    transition: {
      duration: animationDuration,
      times: [0, 0.358, 0.367, 0.767, 0.775, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const
    }
  }
};

const bulbVariantsOdd = {
  hidden: {
    background: `var(--bulb-off)`,
    boxShadow: `none`,
    transform: `translate(-50%, -50%) scale(1) rotate(0deg)`,
    borderColor: `rgba(255, 255, 255, 0.1)`
  },
  show: {
    background: [
      `var(--bulb-off)`,
      `var(--bulb-blend70)`,
      `radial-gradient(circle at 40% 40%, var(--bulb-on), var(--bulb-on-gradient))`,
      `radial-gradient(circle at 40% 40%, var(--bulb-on), var(--bulb-on-gradient))`,
      `var(--bulb-blend70)`,
      `var(--bulb-off)`
    ],
    boxShadow: [
      `none`,
      `0 0 2px var(--bulb-on-glow50)`,
      `0 0 4px var(--bulb-on-glow70), 0 0 6px var(--bulb-on-glow50)`,
      `0 0 4px var(--bulb-on-glow70), 0 0 6px var(--bulb-on-glow50)`,
      `0 0 2px var(--bulb-on-glow50)`,
      `none`
    ],
    transform: [
      `translate(-50%, -50%) scale(1) rotate(0deg)`,
      `translate(-50%, -50%) scale(1.06) rotate(0.75deg)`,
      `translate(-50%, -50%) scale(1.12) rotate(1.5deg)`,
      `translate(-50%, -50%) scale(1.12) rotate(1.5deg)`,
      `translate(-50%, -50%) scale(1.06) rotate(0.75deg)`,
      `translate(-50%, -50%) scale(1) rotate(0deg)`
    ],
    borderColor: [
      `rgba(255, 255, 255, 0.1)`,
      `rgba(255, 255, 255, 0.22)`,
      `rgba(255, 255, 255, 0.35)`,
      `rgba(255, 255, 255, 0.35)`,
      `rgba(255, 255, 255, 0.22)`,
      `rgba(255, 255, 255, 0.1)`
    ],
    transition: {
      duration: animationDuration,
      times: [0, 0.358, 0.367, 0.767, 0.775, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const
    }
  }
};

const LightsCircleStatic1: React.FC<LightsCircleStatic1Props> = ({
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
    const isEven = i % 2 === 0;

    return (
      <div
        key={i}
        className="lights-circle-static-1__bulb-wrapper"
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
      >
        {/* Outer glow layer */}
        <m.div
          className="lights-circle-static-1__glow-outer"
          variants={isEven ? glowOuterVariantsEven : glowOuterVariantsOdd}
        />
        {/* Inner glow layer */}
        <m.div
          className="lights-circle-static-1__glow-inner"
          variants={isEven ? glowInnerVariantsEven : glowInnerVariantsOdd}
        />
        {/* Main bulb */}
        <m.div
          className="lights-circle-static-1__bulb"
          variants={isEven ? bulbVariantsEven : bulbVariantsOdd}
        >
          {/* Glass shine overlay */}
          <div className="lights-circle-static-1__glass-shine" />
        </m.div>
        {/* Filament (bright core) */}
        <m.div
          className="lights-circle-static-1__filament"
          variants={isEven ? filamentVariantsEven : filamentVariantsOdd}
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
        className="lights-circle-static-1__container"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {bulbs}
      </m.div>
    </div>
  );
};

export default LightsCircleStatic1;

