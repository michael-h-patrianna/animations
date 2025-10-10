import type { AnimationMetadata } from '@/types/animation'
import { motion } from 'framer-motion'
import './LoadingStatesDotsPortal.css'

export function LoadingStatesDotsPortal() {
  return (
    <div data-animation-id="loading-states__dots-portal" className="pf-loading-container">
      <div className="pf-dots pf-dots-portal">
        <motion.span animate={{ x: [-20, 0, -20], scale: [1, 0.5, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] as const, repeat: Infinity }} />
        <motion.span animate={{ scale: [1, 0.5, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] as const, repeat: Infinity }} />
        <motion.span animate={{ x: [20, 0, 20], scale: [1, 0.5, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] as const, repeat: Infinity }} />
      </div>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  id: 'loading-states__dots-portal',
  title: 'Dots Portal',
  description: 'Dots fold into portal centre to indicate processing.',
  tags: ['framer']
} satisfies AnimationMetadata
