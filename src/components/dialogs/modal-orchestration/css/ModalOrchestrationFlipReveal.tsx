/**
 * Click-to-flip cards with 3D perspective reveal, staggered entrance — CSS variant.
 *
 * Copy-paste files: this file + ModalOrchestrationFlipReveal.css
 * Runtime deps: react
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

import { memo, useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import './ModalOrchestrationFlipReveal.css'

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
  const [flippedCards, setFlippedCards] = useState<Set<number>>(() => new Set())
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  const renderItems =
    items !== undefined && items.length > 0 ? items : generatePlaceholders(DEFAULT_COUNT)

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

  useEffect(() => {
    cardsRef.current.filter(Boolean).forEach((el, index) => {
      if (el !== null) {
        el.style.animationDelay = `${(0.2 * 1000 + index * stagger) / 1000}s`
        el.classList.add('pf-flip-reveal__card--visible')
      }
    })
  }, [stagger])

  return (
    <div
      className="pf-flip-reveal"
      data-animation-id="modal-orchestration__flip-reveal"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {renderItems.map((item, i) => {
        const isFlipped = flippedCards.has(i)
        return (
          <div
            key={i}
            ref={(el) => {
              cardsRef.current[i] = el
            }}
            className="pf-flip-reveal__card"
            onClick={() => toggleFlip(i)}
          >
            <div
              className={`pf-flip-reveal__inner${isFlipped ? ' pf-flip-reveal__inner--flipped' : ''}`}
              style={{ transitionDuration: `${flipDuration}ms` }}
            >
              <div className="pf-flip-reveal__face pf-flip-reveal__front">{item.front}</div>
              <div className="pf-flip-reveal__face pf-flip-reveal__back">{item.back}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export const ModalOrchestrationFlipReveal = memo(ModalOrchestrationFlipRevealComponent)
