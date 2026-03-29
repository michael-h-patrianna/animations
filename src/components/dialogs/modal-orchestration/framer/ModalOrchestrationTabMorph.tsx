/**
 * Tab panel container with pop-scale tab entrance and sliding content transitions.
 * Supports controlled (activeIndex + onTabChange) or uncontrolled (internal state) usage.
 *
 * Copy-paste files: this file + ModalOrchestrationTabMorph.module.css
 * Runtime deps: react, motion
 *
 * @example
 * <ModalOrchestrationTabMorph labels={['Overview', 'Details', 'Pricing']}>
 *   <OverviewPanel />
 *   <DetailsPanel />
 *   <PricingPanel />
 * </ModalOrchestrationTabMorph>
 */

import * as m from 'motion/react-m'
import { AnimatePresence, useReducedMotion } from 'motion/react'
import { memo, useState } from 'react'
import type { ReactNode } from 'react'
import { DemoCard } from '@/components/demo-blocks'
import styles from './ModalOrchestrationTabMorph.module.css'

const DEFAULT_TAB_COUNT = 4

interface ModalOrchestrationTabMorphProps {
  /** Panel content — each child is one tab's content. When omitted, renders placeholder panels. */
  children?: ReactNode
  /** Tab header labels. Default generates "Tab 1", "Tab 2", etc. */
  labels?: string[]
  /** Controlled active tab index. When provided, component is controlled. */
  activeIndex?: number
  /** Callback when a tab is clicked. Fires in both controlled and uncontrolled mode. */
  onTabChange?: (index: number) => void
  /** Delay between each tab's entrance animation in ms. Default 260. */
  stagger?: number
}

function generatePlaceholders(count: number): ReactNode[] {
  return Array.from({ length: count }, (_, i) => (
    <DemoCard key={`placeholder-${i}`} title={`Content ${i + 1}`} />
  ))
}

function ModalOrchestrationTabMorphComponent({
  children,
  labels,
  activeIndex,
  onTabChange,
  stagger = 260,
}: ModalOrchestrationTabMorphProps) {
  const prefersReducedMotion = useReducedMotion()
  const [internalIndex, setInternalIndex] = useState(0)

  const items = children !== undefined ? (Array.isArray(children) ? children : [children]) : []
  const renderItems = items.length > 0 ? items : generatePlaceholders(DEFAULT_TAB_COUNT)
  const count = renderItems.length

  const isControlled = activeIndex !== undefined
  const currentIndex = isControlled ? activeIndex : internalIndex
  const safeIndex = Math.min(Math.max(currentIndex, 0), count - 1)

  const tabLabels =
    labels !== undefined && labels.length > 0
      ? labels
      : Array.from({ length: count }, (_, i) => `Tab ${i + 1}`)

  const handleTabClick = (index: number) => {
    if (onTabChange !== undefined) {
      onTabChange(index)
    }
    if (!isControlled) {
      setInternalIndex(index)
    }
  }

  const noMotion = !!prefersReducedMotion
  const staggerS = stagger / 1000
  const slideDistance = noMotion ? 0 : 300

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: noMotion ? 0 : staggerS },
    },
  }

  const tabVariants = {
    hidden: { scale: 0.9, opacity: 0.3 },
    visible: {
      scale: [0.9, 1.06, 1],
      opacity: [0.3, 1, 1],
      transition: {
        duration: noMotion ? 0.15 : 0.46,
        ease: [0.34, 1.56, 0.64, 1] as const,
      },
    },
  }

  const panelVariants = {
    initial: { x: slideDistance, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: noMotion ? 0.15 : 0.3,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
    exit: {
      x: -slideDistance,
      opacity: 0,
      transition: {
        duration: noMotion ? 0.12 : 0.2,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  }

  return (
    <m.div
      className={styles['pf-tab-morph-fm']}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      data-animation-id="modal-orchestration__tab-morph"
    >
      <div className={styles['pf-tab-morph-fm__nav']}>
        {tabLabels.map((label, i) => (
          <m.div
            key={i}
            className={`${styles['pf-tab-morph-fm__tab']}${i === safeIndex ? ` ${styles['pf-tab-morph-fm__tab--active']}` : ''}`}
            variants={tabVariants}
            onClick={() => handleTabClick(i)}
            data-testid={`tab-morph-tab-${i}`}
          >
            {label}
          </m.div>
        ))}
      </div>

      <div className={styles['pf-tab-morph-fm__content']}>
        <AnimatePresence mode="wait">
          <m.div
            key={safeIndex}
            className={styles['pf-tab-morph-fm__panel']}
            variants={panelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {renderItems[safeIndex]}
          </m.div>
        </AnimatePresence>
      </div>
    </m.div>
  )
}

export const ModalOrchestrationTabMorph = memo(ModalOrchestrationTabMorphComponent)
