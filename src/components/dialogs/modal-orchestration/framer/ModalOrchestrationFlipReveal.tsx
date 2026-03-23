/**
 * Click-to-flip cards with 3D perspective reveal, staggered entrance animation.
 *
 * Copy-paste files: this file + ModalOrchestrationFlipReveal.css
 * Runtime deps: react, motion
 *
 * @example
 * <ModalOrchestrationFlipReveal
 *   items={[
 *     { front: <div>Question 1</div>, back: <div>Answer 1</div> },
 *     { front: <div>Question 2</div>, back: <div>Answer 2</div> },
 *   ]}
 *   stagger={100}
 *   columns={3}
 * />
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

const DEFAULT_COUNT = 6

interface FlipItem {
  front: ReactNode
  back: ReactNode
}

interface ModalOrchestrationFlipRevealProps {
  /** Array of {front, back} content for each card. When omitted, renders placeholder cards. */
  items?: FlipItem[]
  /** Delay between each card's entrance in ms. Default 100. */
  stagger?: number
  /** Duration of the flip animation in ms. Default 600. */
  flipDuration?: number
  /** Number of grid columns. Default 3. */
  columns?: number
}

function generatePlaceholders(count: number): FlipItem[] {
  return Array.from({ length: count }, (_, i) => ({
    front: (
      <div>
        <h5>Card {i + 1}</h5>
        <p>Click to flip</p>
      </div>
    ),
    back: (
      <div>
        <h5>Revealed</h5>
        <p>Hidden content</p>
      </div>
    ),
  }))
}

function ModalOrchestrationFlipRevealComponent({
  items,
  stagger = 100,
  flipDuration = 600,
  columns = 3,
}: ModalOrchestrationFlipRevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const [flippedCards, setFlippedCards] = useState<Set<number>>(() => new Set())

  const renderItems =
    items !== undefined && items.length > 0 ? items : generatePlaceholders(DEFAULT_COUNT)

  const staggerS = stagger / 1000
  const flipS = flipDuration / 1000

  const toggleFlip = useCallback((index: number) => {
    setFlippedCards((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }, [])

  const containerVariants = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: prefersReducedMotion === true ? 0 : staggerS,
          delayChildren: prefersReducedMotion === true ? 0 : staggerS * 2,
        },
      },
    }),
    [staggerS, prefersReducedMotion]
  )

  const cardVariants = useMemo(
    () => ({
      hidden: {
        scale: 0.8,
        opacity: 0,
        y: 20,
      },
      visible: {
        scale: 1,
        opacity: 1,
        y: 0,
        transition: {
          duration: prefersReducedMotion === true ? 0 : 0.5,
          ease: [0.25, 0.46, 0.45, 0.94] as const,
        },
      },
    }),
    [prefersReducedMotion]
  )

  return (
    <m.div
      className="pf-flip-reveal"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      data-animation-id="modal-orchestration__flip-reveal"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, animation: 'none' }}
    >
      {renderItems.map((item, i) => {
        const isFlipped = flippedCards.has(i)
        return (
          <m.div
            key={i}
            className="pf-flip-reveal__card"
            variants={cardVariants}
            onClick={() => toggleFlip(i)}
            whileHover={
              prefersReducedMotion === true
                ? undefined
                : {
                    scale: 1.05,
                    transition: { type: 'spring', stiffness: 300, damping: 25 },
                  }
            }
            whileTap={prefersReducedMotion === true ? undefined : { scale: 0.95 }}
            style={{ animation: 'none' }}
          >
            <m.div
              className="pf-flip-reveal__inner"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{
                duration: prefersReducedMotion === true ? 0 : flipS,
                ease: [0.25, 0.46, 0.45, 0.94] as const,
              }}
              style={{ transformStyle: 'preserve-3d', animation: 'none' }}
            >
              <div className="pf-flip-reveal__face pf-flip-reveal__front">{item.front}</div>
              <div className="pf-flip-reveal__face pf-flip-reveal__back">{item.back}</div>
            </m.div>
          </m.div>
        )
      })}
    </m.div>
  )
}

export const ModalOrchestrationFlipReveal = memo(ModalOrchestrationFlipRevealComponent)
