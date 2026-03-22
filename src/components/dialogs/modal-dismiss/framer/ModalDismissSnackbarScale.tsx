/**
 * Auto-dismiss wrapper — bouncy scale-in, subtle pulse during visible, scale-down exit.
 *
 * Copy-paste files: this file + SharedTypes.ts
 * Runtime deps: react, motion
 *
 * Usage: <ModalDismissSnackbarScale duration={5000} onDismiss={remove}><YourSnackbar /></ModalDismissSnackbarScale>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useEffect, useRef, useState } from 'react'

import { ToastPlaceholder } from '../MockToastContent'
import type { AutoDismissProps } from '../SharedTypes'

const DEFAULT_DURATION = 4000

function ModalDismissSnackbarScaleComponent({
  children,
  duration = DEFAULT_DURATION,
  onDismiss,
  className,
  style,
}: AutoDismissProps) {
  const prefersReducedMotion = useReducedMotion()
  const [dismissed, setDismissed] = useState(false)
  const onDismissRef = useRef(onDismiss)
  onDismissRef.current = onDismiss

  useEffect(() => {
    const timer = setTimeout(() => setDismissed(true), duration)
    return () => clearTimeout(timer)
  }, [duration])

  const entryS = prefersReducedMotion ? 0.01 : 0.32
  const pulseS = prefersReducedMotion ? 0.01 : duration / 1000
  const exitS = prefersReducedMotion ? 0.01 : 0.24

  const variants = {
    hidden: { y: 16, scale: 0.84, opacity: 0 },
    visible: {
      y: [16, -6, 0],
      scale: [0.84, 1.08, 1],
      opacity: [0, 1, 1],
      transition: {
        duration: entryS,
        times: [0, 0.6, 1],
        ease: [0.68, -0.55, 0.265, 1.55] as const,
      },
    },
    pulse: {
      y: [0, -4, 6, 12],
      scale: [1, 1.05, 0.96, 0.9],
      opacity: [1, 1, 0.92, 0.85],
      transition: {
        duration: pulseS,
        times: [0, 0.18, 0.55, 1],
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
    exit: {
      y: [0, 6, 16],
      scale: [1, 0.92, 0.8],
      opacity: [1, 0.4, 0],
      transition: {
        duration: exitS,
        times: [0, 0.6, 1],
        ease: [0.68, -0.55, 0.265, 1.55] as const,
      },
    },
  }

  return (
    <div
      data-animation-id="modal-dismiss__snackbar-scale"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <m.div
        className={className}
        style={{ ...style, animation: 'none' }}
        variants={variants}
        initial="hidden"
        animate={dismissed ? 'exit' : ['visible', 'pulse']}
        onAnimationComplete={(definition: string) => {
          if (definition === 'exit') onDismissRef.current?.()
        }}
      >
        <ToastPlaceholder duration={duration}>{children}</ToastPlaceholder>
      </m.div>
    </div>
  )
}

export const ModalDismissSnackbarScale = memo(ModalDismissSnackbarScaleComponent)
