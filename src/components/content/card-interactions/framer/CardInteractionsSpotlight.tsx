import * as m from 'motion/react-m'
import { useMotionValue, useMotionTemplate } from 'motion/react'
import { MouseEvent } from 'react'
import { PremiumCard } from '../PremiumCard'

/**
 *
 */
export function CardInteractionsSpotlight() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <div 
      className="premium-card-container group relative rounded-2xl bg-slate-950" 
      onMouseMove={handleMouseMove}
      data-animation-id="card-interactions__spotlight"
    >
      {/* Base Content */}
      <PremiumCard showGlow={false} />

      {/* 1. Spotlight Texture Reveal (Hexagon Pattern) */}
      <m.div
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 group-hover:opacity-100 opacity-0"
        style={{
          // eslint-disable-next-line animation-rules/no-radial-angular-gradient -- radial effect required for visual design
          background: useMotionTemplate`
            radial-gradient(
              300px circle at ${mouseX}px ${mouseY}px,
              var(--pf-anim-white-10),
              transparent 80%
            )
          `,
          maskImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0L20 5V15L10 20L0 15V5L10 0Z' fill='none' stroke='black' stroke-width='1'/%3E%3C/svg%3E")`,
          maskSize: "20px 20px",
          WebkitMaskImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0L20 5V15L10 20L0 15V5L10 0Z' fill='none' stroke='black' stroke-width='1'/%3E%3C/svg%3E")`,
          WebkitMaskSize: "20px 20px"
        }}
      />

      {/* 2. Spotlight Border Highlight (The "Light Edge" effect) */}
      <m.div
        className="pointer-events-none absolute inset-0 z-30 rounded-2xl border border-transparent transition-opacity duration-300 group-hover:opacity-100 opacity-0"
        style={{
          // eslint-disable-next-line animation-rules/no-hardcoded-colors, animation-rules/no-radial-angular-gradient -- dynamic color computation, radial effect required for visual design
          background: useMotionTemplate`
            radial-gradient(
              150px circle at ${mouseX}px ${mouseY}px,
              rgb(255 255 255 / 0.6),
              transparent 80%
            )
          `,
          maskClip: "padding-box, border-box",
          maskComposite: "intersect",
          WebkitMaskClip: "padding-box, border-box",
          WebkitMaskComposite: "source-in, xor", // Trick to show only border
          padding: "1px", // The border width
        }}
      />

      {/* 3. Volumetric Glow (Soft large glow) */}
      <m.div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 group-hover:opacity-100 opacity-0 mix-blend-color-dodge"
        style={{
          // eslint-disable-next-line animation-rules/no-hardcoded-colors, animation-rules/no-radial-angular-gradient -- dynamic color computation, radial effect required for visual design
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(99, 102, 241, 0.15),
              transparent 80%
            )
          `,
        }}
      />
    </div>
  )
}