import { calculateBulbColors } from '@/utils/colors'
import * as m from 'motion/react-m'
import React, { useMemo } from 'react'
interface LightsCircleStatic3Props {
  numBulbs?: number
  onColor?: string
}
const animationDuration = 5 // Winner bulb glow variant (first bulb - celebration)
const glowVariantsWinner = { hidden: { opacity: 0 }, show: { opacity: [0, 0, 1, 0.95], transition: { duration: animationDuration, times: [0, 0.79, 0.8, 1], repeat: Infinity, ease: [0.42, 0, 0.58, 1] as const } } } // Winner bulb variant with big celebration glow
const bulbVariantsWinner = {
  hidden: { backgroundColor: `var(--bulb-off)`, boxShadow: `0 0 2px var(--bulb-off-glow30)` },
  show: {
    backgroundColor: [`var(--bulb-off)`, `var(--bulb-off)`, `var(--bulb-on)`, `var(--bulb-on)`],
    boxShadow: [`0 0 2px var(--bulb-off-glow30)`, `0 0 2px var(--bulb-off-glow30)`, `0 0 15px var(--bulb-on-glow100), 0 0 25px var(--bulb-on-glow80)`, `0 0 15px var(--bulb-on-glow100), 0 0 25px var(--bulb-on-glow80)`],
    transition: { duration: animationDuration, times: [0, 0.79, 0.8, 1], repeat: Infinity, ease: [0.42, 0, 0.58, 1] as const },
  },
} // Regular bulb glow variant (all other bulbs)
const glowVariantsRegular = {
  hidden: { opacity: 0 },
  show: { opacity: [0, 0.8, 0.8, 0.4, 0, 1, 0.8, 0.4, 0], transition: { duration: animationDuration, times: [0, 0.01, 0.04, 0.06, 0.08, 0.3, 0.55, 0.57, 0.59], repeat: Infinity, ease: [0.42, 0, 0.58, 1] as const } },
} // Regular bulb variant with multi-phase animation
// Phase 1: Sequential chase → Phase 2: All bulbs ON (blur) → Phase 3: Sequential again
const bulbVariantsRegular = {
  hidden: { backgroundColor: `var(--bulb-off)`, boxShadow: `0 0 2px var(--bulb-off-glow30)` },
  show: {
    backgroundColor: [`var(--bulb-off)`, `var(--bulb-on)`, `var(--bulb-on)`, `var(--bulb-blend70)`, `var(--bulb-off)`, `var(--bulb-on)`, `var(--bulb-on)`, `var(--bulb-blend70)`, `var(--bulb-off)`],
    boxShadow: [
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 8px var(--bulb-on-glow80), 0 0 12px var(--bulb-on-glow60)`,
      `0 0 8px var(--bulb-on-glow80), 0 0 12px var(--bulb-on-glow60)`,
      `0 0 4px var(--bulb-on-glow50)`,
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 12px var(--bulb-on-glow100), 0 0 18px var(--bulb-on-glow80)`,
      `0 0 8px var(--bulb-on-glow80), 0 0 12px var(--bulb-on-glow60)`,
      `0 0 4px var(--bulb-on-glow50)`,
      `0 0 2px var(--bulb-off-glow30)`,
    ],
    transition: { duration: animationDuration, times: [0, 0.01, 0.04, 0.06, 0.08, 0.3, 0.55, 0.57, 0.59], repeat: Infinity, ease: [0.42, 0, 0.58, 1] as const },
  },
}
const LightsCircleStatic3: React.FC<LightsCircleStatic3Props> = ({ numBulbs = 16, onColor = 'var(--pf-anim-gold)' }) => {
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor])
  const radius = 80
  const containerVariants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        // Preserve the same relative stagger profile for any bulb count.
        staggerChildren: (animationDuration / Math.max(1, numBulbs)) * 0.08,
      },
    },
  }
  const bulbs = Array.from({ length: numBulbs }, (_, i) => {
    const angle = (i * 360) / numBulbs - 90
    const angleRad = (angle * Math.PI) / 180
    const x = radius * Math.cos(angleRad)
    const y = radius * Math.sin(angleRad)
    const isWinner = i === 0
    return (
      <div key={i} className="lights-circle-static-3__bulb-wrapper" style={{ transform: `translate(${x}px, ${y}px)` }}>
        <m.div className="lights-circle-static-3__glow" variants={isWinner ? glowVariantsWinner : glowVariantsRegular} />
        <m.div className="lights-circle-static-3__bulb" variants={isWinner ? bulbVariantsWinner : bulbVariantsRegular} />
      </div>
    )
  })
  return (
    <div
      className="lights-circle-static-3"
      data-animation-id="lights__circle-static-3"
      style={
        {
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
        } as React.CSSProperties
      }
    >
      <m.div className="lights-circle-static-3__container" variants={containerVariants} initial="hidden" animate="show">
        {bulbs}
      </m.div>
    </div>
  )
}
export default LightsCircleStatic3
