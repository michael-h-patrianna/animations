/**
 * Drag-to-reorder tile list with lift effect on grab — CSS variant.
 *
 * Pointer events drive drag tracking; CSS transitions animate displaced items
 * to match Framer Motion Reorder behavior (items slide out of the way live).
 *
 * Copy-paste files: this file + ModalOrchestrationReorderDrag.module.css
 * Runtime deps: react
 *
 * @example
 * <ModalOrchestrationReorderDrag count={6} gap={10} dragScale={1.08} />
 */

import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { DemoCard } from '@/components/demo-blocks'
import styles from './ModalOrchestrationReorderDrag.module.css'

const DEFAULT_COUNT = 4
const SETTLE_MS = 250
/** Approximates a spring settle with slight overshoot. */
const SPRING_EASE = 'cubic-bezier(0.25, 1, 0.5, 1)'

interface TileItem {
  id: number
  label: string
}

interface ModalOrchestrationReorderDragProps {
  /** Number of placeholder tiles when no children provided. Default 4. */
  count?: number
  /** Gap between items in px. Default 12. */
  gap?: number
  /** Scale factor applied while dragging. Default 1.05. */
  dragScale?: number
  /** Custom tile content. Overrides generated placeholders. */
  children?: ReactNode
}

function generateItems(count: number): TileItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    label: `Tile ${i + 1}`,
  }))
}

/** Mutable drag state kept in a ref to avoid React re-renders during drag. */
interface DragState {
  active: boolean
  index: number
  overIndex: number
  startY: number
  offsetY: number
  rects: DOMRect[]
  itemHeight: number
  settling: boolean
}

function createDragState(): DragState {
  return {
    active: false,
    index: -1,
    overIndex: -1,
    startY: 0,
    offsetY: 0,
    rects: [],
    itemHeight: 0,
    settling: false,
  }
}

function ModalOrchestrationReorderDragComponent({
  count = DEFAULT_COUNT,
  gap = 12,
  dragScale = 1.05,
  children,
}: ModalOrchestrationReorderDragProps) {
  const [items, setItems] = useState<TileItem[]>(() => generateItems(count))
  const containerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState>(createDragState())
  const rafRef = useRef(0)

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  /** Snapshot DOM rects of all children at drag start. */
  const captureRects = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const ds = dragRef.current
    ds.rects = Array.from(el.children, (child) => child.getBoundingClientRect())
    const first = ds.rects[0]
    ds.itemHeight = first !== undefined ? first.height + gap : 0
  }, [gap])

  /**
   * Push visual state to DOM without React re-renders.
   *
   * - Dragged item: follows pointer via translateY, no transform transition
   * - Displaced items: shift by ±itemHeight with CSS transition (spring-like)
   * - Unaffected items: clear to identity transform
   */
  const applyVisuals = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const ds = dragRef.current
    if (!ds.active) return
    const kids = el.children

    for (let i = 0; i < kids.length; i++) {
      const child = kids[i] as HTMLElement

      if (i === ds.index) {
        // Dragged item — track pointer, no transform transition
        child.style.transform = `translateY(${ds.offsetY}px) scale(${dragScale})`
        child.style.transition = `box-shadow 200ms ease`
        child.style.zIndex = '10'
        child.classList.add(styles['pf-reorder-drag__item--dragging'] ?? '')
        continue
      }

      // Non-dragged items — compute shift direction
      let shiftY = 0
      if (ds.index < ds.overIndex && i > ds.index && i <= ds.overIndex) {
        shiftY = -ds.itemHeight
      } else if (ds.index > ds.overIndex && i < ds.index && i >= ds.overIndex) {
        shiftY = ds.itemHeight
      }

      // Let CSS transition handle the animation (don't override transition)
      child.style.transition = ''
      child.style.zIndex = ''
      child.style.transform = shiftY !== 0 ? `translateY(${shiftY}px)` : ''
      child.classList.remove(styles['pf-reorder-drag__item--dragging'] ?? '')
    }
  }, [dragScale])

  const handlePointerDown = useCallback(
    (index: number, e: ReactPointerEvent<HTMLDivElement>) => {
      const ds = dragRef.current
      if (ds.settling) return

      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)

      ds.active = true
      ds.index = index
      ds.overIndex = index
      ds.startY = e.clientY
      ds.offsetY = 0
      captureRects()

      // Apply grab effect on first frame: scale up + shadow with a transition
      const el = containerRef.current
      if (el) {
        const child = el.children[index] as HTMLElement | undefined
        if (child) {
          child.style.transition = `transform 150ms ${SPRING_EASE}, box-shadow 200ms ease`
          child.style.transform = `scale(${dragScale})`
          child.style.zIndex = '10'
          child.classList.add(styles['pf-reorder-drag__item--dragging'] ?? '')
        }
      }
    },
    [captureRects, dragScale]
  )

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const ds = dragRef.current
      if (!ds.active) return

      ds.offsetY = e.clientY - ds.startY

      // Determine which slot the dragged item is hovering over
      const dragRect = ds.rects[ds.index]
      if (dragRect !== undefined) {
        const dragCenterY = dragRect.top + dragRect.height / 2 + ds.offsetY
        let newOver = ds.index
        for (let i = 0; i < ds.rects.length; i++) {
          const rect = ds.rects[i]
          if (rect === undefined) continue
          const centerY = rect.top + rect.height / 2
          if (i < ds.index && dragCenterY < centerY) {
            newOver = i
            break
          }
          if (i > ds.index && dragCenterY > centerY) {
            newOver = i
          }
        }
        ds.overIndex = newOver
      }

      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(applyVisuals)
    },
    [applyVisuals]
  )

  const handlePointerUp = useCallback(() => {
    const ds = dragRef.current
    if (!ds.active) return
    ds.active = false
    cancelAnimationFrame(rafRef.current)

    const { index: fromIndex, overIndex: toIndex, itemHeight } = ds

    if (fromIndex === toIndex) {
      // No reorder — animate scale back to 1, then clear
      const container = containerRef.current
      if (container) {
        const child = container.children[fromIndex] as HTMLElement | undefined
        if (child) {
          child.style.transition = `transform ${SETTLE_MS}ms ${SPRING_EASE}, box-shadow ${SETTLE_MS}ms ease`
          child.style.transform = ''
        }
      }
      ds.settling = true
      setTimeout(() => {
        if (container) {
          for (let i = 0; i < container.children.length; i++) {
            const child = container.children[i] as HTMLElement
            child.style.transition = 'none'
            child.style.transform = ''
            child.style.zIndex = ''
            child.classList.remove(styles['pf-reorder-drag__item--dragging'] ?? '')
          }
          requestAnimationFrame(() => {
            for (let i = 0; i < container.children.length; i++) {
              ;(container.children[i] as HTMLElement).style.transition = ''
            }
          })
        }
        dragRef.current = createDragState()
      }, SETTLE_MS)
      return
    }

    // Animate dragged item to its target slot, scale back to 1
    ds.settling = true
    const targetY = (toIndex - fromIndex) * itemHeight
    const el = containerRef.current
    if (el) {
      const draggedChild = el.children[fromIndex] as HTMLElement | undefined
      if (draggedChild) {
        draggedChild.style.transition = `transform ${SETTLE_MS}ms ${SPRING_EASE}, box-shadow ${SETTLE_MS}ms ease`
        draggedChild.style.transform = `translateY(${targetY}px) scale(1)`
      }
    }

    // After settle, commit reorder and clean up in one paint frame.
    // flushSync guarantees React commits to DOM synchronously so the browser
    // never paints the intermediate state (transforms cleared, old DOM order).
    setTimeout(() => {
      const container = containerRef.current
      if (!container) return

      // Suppress CSS transitions so clearing transforms doesn't animate
      for (let i = 0; i < container.children.length; i++) {
        const child = container.children[i] as HTMLElement
        child.style.transition = 'none'
        child.style.transform = ''
        child.style.zIndex = ''
        child.classList.remove(styles['pf-reorder-drag__item--dragging'] ?? '')
      }

      // Commit reorder synchronously — DOM updated before browser paints.
      // flushSync is required: without it React defers the commit, the browser
      // paints the intermediate state (transforms cleared, old DOM order), and
      // the user sees the dragged tile jump to its original slot then back.
      // eslint-disable-next-line @eslint-react/dom/no-flush-sync
      flushSync(() => {
        setItems((prev) => {
          const next = [...prev]
          const moved = next.splice(fromIndex, 1)[0]
          if (moved === undefined) return prev
          next.splice(toIndex, 0, moved)
          return next
        })
      })
      dragRef.current = createDragState()

      // Re-enable CSS transitions after layout settles
      requestAnimationFrame(() => {
        for (let i = 0; i < container.children.length; i++) {
          ;(container.children[i] as HTMLElement).style.transition = ''
        }
      })
    }, SETTLE_MS)
  }, [])

  if (children !== undefined) {
    return (
      <div
        className={styles['pf-reorder-drag']}
        style={{ gap }}
        data-animation-id="modal-orchestration__reorder-drag"
      >
        {children}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={styles['pf-reorder-drag']}
      style={{ gap } as CSSProperties}
      data-animation-id="modal-orchestration__reorder-drag"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {items.map((item, i) => (
        <div
          key={item.id}
          className={styles['pf-reorder-drag__item']}
          onPointerDown={(e) => handlePointerDown(i, e)}
        >
          <DemoCard title={item.label}>
            <p>Drag to reorder</p>
          </DemoCard>
        </div>
      ))}
    </div>
  )
}

export const ModalOrchestrationReorderDrag = memo(ModalOrchestrationReorderDragComponent)
