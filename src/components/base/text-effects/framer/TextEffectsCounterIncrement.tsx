import type { AnimationMetadata } from '@/types/animation'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import './TextEffectsCounterIncrement.css'

interface CounterIndicator {
  id: number
  isAnimating: boolean
}

export function TextEffectsCounterIncrement() {
const [isValueAnimating, setIsValueAnimating] = useState(false)
  const [count, setCount] = useState(0)
  const [counters, setCounters] = useState<CounterIndicator[]>([])
  const nextCounterIdRef = useRef(0)

  useEffect(() => {
    const animationCycle = () => {
      // Trigger number pop animation
      setIsValueAnimating(true)

      // Add a new counter with current id
      const currentId = nextCounterIdRef.current
      setCounters([{ id: currentId, isAnimating: true }])
      nextCounterIdRef.current += 1

      // Increment the displayed count
      setCount((c) => c + 1)

      // Reset number pop animation after 500ms
      setTimeout(() => {
        setIsValueAnimating(false)
      }, 500)

      // Remove counter after animation completes
      setTimeout(() => {
        setCounters([])
      }, 800)
    }

    // Start first animation
    animationCycle()

    // Set up repeating animation
    const intervalId = setInterval(animationCycle, 2000)

    return () => {
      clearInterval(intervalId)
      setCounters([])
    }
  }, [])

  const numberPopVariants = {
    initial: {
      scale: 1,
      rotate: 0,
      opacity: 1,
    },
    animate: {
      scale: [1, 1.2, 0.98, 1.08, 1],
      rotate: [0, 2, -2, 1, 0],
      opacity: [1, 1, 0.92, 1, 1],
      transition: {
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1] as const,
        times: [0, 0.25, 0.5, 0.75, 1],
      },
    },
  }

  const counterFloatVariants = {
    initial: {
      translateY: 8,
      opacity: 0,
    },
    animate: {
      translateY: [8, -4, -12, -16],
      opacity: [0, 1, 1, 0],
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
        times: [0, 0.2, 0.5, 1],
      },
    },
  }
  return (
    <div className="pf-counter-showcase" data-animation-id="text-effects__counter-increment">
      <div className="pf-counter-showcase__target">
        <motion.span
          className="pf-counter-showcase__value"
          variants={numberPopVariants}
          initial="initial"
          animate={isValueAnimating ? 'animate' : 'initial'}
        >
          <span className="pf-counter-showcase__value-glow" aria-hidden="true" />
          <span className="pf-counter-showcase__value-text">{count}</span>
        </motion.span>

        {/* Render counter indicators */}
        {counters.map((counter) => (
          <motion.span
            key={counter.id}
            className="pf-update-indicator__counter"
            variants={counterFloatVariants}
            initial="initial"
            animate={counter.isAnimating ? 'animate' : 'initial'}
          >
            +1
          </motion.span>
        ))}
      </div>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  id: 'text-effects__counter-increment',
  title: 'Counter Increment',
  description: 'Numeric counter ticks upwards with scale.',
  tags: ['framer'],
  disableReplay: false
} satisfies AnimationMetadata
