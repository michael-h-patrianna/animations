/**
 * Drag-to-reorder tile list with lift effect on grab.
 *
 * Copy-paste files: this file + ModalOrchestrationReorderDrag.module.css
 * Runtime deps: react, motion
 *
 * @example
 * <ModalOrchestrationReorderDrag count={6} gap={10} dragScale={1.08} />
 */

import { Reorder, useReducedMotion } from 'motion/react'
import { memo, useState } from 'react'
import type { ReactNode } from 'react'
import { DemoCard } from '@/components/demo-blocks'
import styles from './ModalOrchestrationReorderDrag.module.css'

const DEFAULT_COUNT = 4

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

function ModalOrchestrationReorderDragComponent({
  count = DEFAULT_COUNT,
  gap = 12,
  dragScale = 1.05,
  children,
}: ModalOrchestrationReorderDragProps) {
  const prefersReducedMotion = useReducedMotion()
  const [items, setItems] = useState<TileItem[]>(() => generateItems(count))

  const noMotion = !!prefersReducedMotion

  const whileDrag = noMotion
    ? undefined
    : {
        scale: dragScale,
        boxShadow: 'var(--pf-drag-shadow)',
        zIndex: 10,
      }

  if (children !== undefined) {
    return (
      <div
        className={styles['pf-reorder-drag-fm']}
        style={{ gap }}
        data-animation-id="modal-orchestration__reorder-drag"
      >
        {children}
      </div>
    )
  }

  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={setItems}
      className={styles['pf-reorder-drag-fm']}
      style={{ gap }}
      data-animation-id="modal-orchestration__reorder-drag"
    >
      {items.map((item) => (
        <Reorder.Item
          key={item.id}
          value={item}
          whileDrag={whileDrag}
          className={styles['pf-reorder-drag-fm__item']}
          style={{ touchAction: 'none' }}
        >
          <DemoCard title={item.label}>
            <p>Drag to reorder</p>
          </DemoCard>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  )
}

export const ModalOrchestrationReorderDrag = memo(ModalOrchestrationReorderDragComponent)
