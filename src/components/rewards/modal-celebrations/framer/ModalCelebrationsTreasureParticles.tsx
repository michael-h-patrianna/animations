import * as m from 'motion/react-m'
import { useMemo } from 'react'
/**
 *
 */ export function ModalCelebrationsTreasureParticles() {
  const particles = useMemo(() => {
    const particleCount = 20
    const startRadius = 20
    return Array.from({ length: particleCount }, (_, i) => {
      const startAngle = Math.random() * 2 * Math.PI
      const startX = Math.cos(startAngle) * startRadius
      const startY = Math.sin(startAngle) * startRadius
      const delay = i * 0.05 + Math.random() * 0.2
      const endAngle = startAngle + (Math.random() - 0.5) * Math.PI
      const endRadius = 60 + Math.random() * 40
      const endX = Math.cos(endAngle) * endRadius
      const endY = Math.sin(endAngle) * endRadius
      return { id: i, startX, startY, endX: endX - startX, endY: endY - startY, delay }
    })
  }, [])
  const gems = useMemo(() => {
    const gemCount = 6
    const radius = 25
    return Array.from({ length: gemCount }, (_, i) => {
      const angle = (i / gemCount) * 2 * Math.PI
      const gemX = Math.cos(angle) * radius
      const gemY = Math.sin(angle) * radius
      const delay = i * 0.2 + 0.5
      return { id: i, x: gemX, y: gemY, delay }
    })
  }, [])
  return (
    <div className="pf-modal-celebration pf-modal-celebration--treasure-particles" data-animation-id="modal-celebrations__treasure-particles">
      <div className="pf-treasure-particles">
        {particles.map((p) => (
          <m.div
            key={p.id}
            className="pf-treasure-particles__particle"
            initial={{ x: p.startX, y: p.startY, scale: 0.1, opacity: 0 }}
            animate={{ x: [p.startX, p.startX + p.endX * 0.3, p.startX + p.endX * 0.7, p.startX + p.endX], y: [p.startY, p.startY + p.endY * 0.3, p.startY + p.endY * 0.7, p.startY + p.endY], scale: [0.1, 1.5, 1, 0.2], opacity: [0, 1, 0.8, 0] }}
            transition={{ duration: 2.6, delay: p.delay, times: [0, 0.2, 0.6, 1], ease: [0.4, 0, 0.2, 1] as const }}
          />
        ))}
        {gems.map((gem) => (
          <m.div
            key={gem.id}
            className="pf-treasure-particles__gem"
            initial={{ x: gem.x, y: gem.y, scale: 0.1, rotate: 0, opacity: 0 }}
            animate={{ scale: [0.1, 1.3, 1, 0.2], rotate: [0, 180, 360, 540], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.6, delay: gem.delay, times: [0, 0.3, 0.7, 1], ease: [0.175, 0.885, 0.32, 1.275] as const }}
          >
            <span className="pf-treasure-particles__gem-top" />
            <span className="pf-treasure-particles__gem-bottom" />
          </m.div>
        ))}
      </div>
    </div>
  )
}
