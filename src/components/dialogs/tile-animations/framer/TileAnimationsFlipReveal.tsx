/**
 * Click-to-flip cards with 3D perspective reveal, staggered entrance animation.
 *
 * Copy-paste files: this file + TileAnimationsFlipReveal.module.css
 * Runtime deps: react, motion
 *
 * @example
 * <TileAnimationsFlipReveal
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
import { memo, useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import { DemoCard } from '@/components/demo-blocks'
import styles from './TileAnimationsFlipReveal.module.css'

const DEFAULT_COUNT = 6

interface FlipItem {
  front: ReactNode
  back: ReactNode
}

interface TileAnimationsFlipRevealProps {
  /** Array of {front, back} content for each card. When omitted, renders placeholder cards. */
  items?: FlipItem[]
  /** Delay between each card's entrance in ms. Default 100. */
  stagger?: number
  /** Duration of the flip animation in ms. Default 600. */
  flipDuration?: number
  /** Number of grid columns. Default 3. */
  columns?: number
  /** Height of each flip card in px. Default 120. */
  cardHeight?: number
}

function generatePlaceholders(count: number): FlipItem[] {
  return Array.from({ length: count }, (_, i) => ({
    front: (
      <DemoCard title={`Card ${i + 1}`}>
        <p>Click to flip</p>
      </DemoCard>
    ),
    back: (
      <DemoCard title="Revealed">
        <p>Hidden content</p>
      </DemoCard>
    ),
  }))
}

function TileAnimationsFlipRevealComponent({
  items,
  stagger = 100,
  flipDuration = 600,
  columns = 3,
  cardHeight = 120,
}: TileAnimationsFlipRevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const [flippedCards, setFlippedCards] = useState<Set<number>>(() => new Set())

  const renderItems =
    items !== undefined && items.length > 0 ? items : generatePlaceholders(DEFAULT_COUNT)

  const noMotion = !!prefersReducedMotion
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

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: noMotion ? 0 : staggerS,
        delayChildren: noMotion ? 0 : staggerS * 2,
      },
    },
  }

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0, y: 20 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        duration: noMotion ? 0.15 : 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  }

  return (
    <m.div
      className={styles['pf-flip-reveal-fm']}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      data-animation-id="tile-animations__flip-reveal"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {renderItems.map((item, i) => {
        const isFlipped = flippedCards.has(i)
        return (
          <m.div
            key={i}
            className={styles['pf-flip-reveal-fm__card']}
            variants={cardVariants}
            onClick={() => toggleFlip(i)}
            whileHover={
              noMotion
                ? undefined
                : {
                    scale: 1.05,
                    transition: { type: 'spring', stiffness: 300, damping: 25 },
                  }
            }
            whileTap={noMotion ? undefined : { scale: 0.95 }}
            style={{ minHeight: cardHeight }}
          >
            <m.div
              className={styles['pf-flip-reveal-fm__inner']}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{
                duration: noMotion ? 0.15 : flipS,
                ease: [0.25, 0.46, 0.45, 0.94] as const,
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div
                className={`${styles['pf-flip-reveal-fm__face']} ${styles['pf-flip-reveal-fm__front']}`}
              >
                {item.front}
              </div>
              <div
                className={`${styles['pf-flip-reveal-fm__face']} ${styles['pf-flip-reveal-fm__back']}`}
              >
                {item.back}
              </div>
            </m.div>
          </m.div>
        )
      })}
    </m.div>
  )
}

export const TileAnimationsFlipReveal = memo(TileAnimationsFlipRevealComponent)
