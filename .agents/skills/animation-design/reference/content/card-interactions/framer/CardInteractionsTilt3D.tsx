import * as m from 'motion/react-m'
import { useMotionValue, useSpring, useTransform } from 'motion/react'
import { MouseEvent } from 'react'
import { PremiumCard } from '../PremiumCard'
import '../shared-premium.css'

export function CardInteractionsTilt3D() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Heavy, premium feel physics
  const mouseX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 })
  const mouseY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 })

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["12deg", "-12deg"])
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-12deg", "12deg"])
  
  // Glare moves opposite to rotation
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"])
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"])

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseXPos = e.clientX - rect.left
    const mouseYPos = e.clientY - rect.top
    
    // Normalize to -0.5 to 0.5
    const xPct = (mouseXPos / width) - 0.5
    const yPct = (mouseYPos / height) - 0.5
    
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div style={{ perspective: 1200 }} className="premium-card-container">
      <m.div
        className="relative w-full h-full"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        data-animation-id="card-interactions__tilt-3d"
      >
        <PremiumCard className="shadow-2xl shadow-black/50">
           {/* Glare Layer */}
           <m.div 
             className="absolute inset-0 pointer-events-none z-40 mix-blend-overlay"
             style={{
               background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.4) 0%, transparent 60%)`,
               opacity: useTransform(mouseX, (val) => Math.abs(val) * 0.8) // Only visible when tilted
             }}
           />
        </PremiumCard>
      </m.div>
    </div>
  )
}