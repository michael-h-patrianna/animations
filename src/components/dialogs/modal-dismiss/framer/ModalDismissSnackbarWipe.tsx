/**
 * Auto-dismiss wrapper — wipes in from right with slide, wipes out after timeout.
 *
 * Copy-paste files: this file + SharedTypes.ts
 * Runtime deps: react, motion
 *
 * Usage: <ModalDismissSnackbarWipe duration={5000} onDismiss={remove}><YourSnackbar /></ModalDismissSnackbarWipe>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useEffect, useRef, useState } from 'react'

import { ToastPlaceholder } from '@/components/dialogs/modal-dismiss/MockToastContent'
import type { AutoDismissProps } from '@/components/dialogs/modal-dismiss/SharedTypes'

const DEFAULT_DURATION = 4200

function ModalDismissSnackbarWipeComponent({
  children,
  duration = DEFAULT_DURATION,
  onDismiss,
  className,
  style,
}: AutoDismissProps) {
  const prefersReducedMotion = useReducedMotion()
  const [phase, setPhase] = useState<'enter' | 'exit'>('enter')
  const onDismissRef = useRef(onDismiss)
  onDismissRef.current = onDismiss

  useEffect(() => {
    const timer = setTimeout(() => setPhase('exit'), duration)
    return () => clearTimeout(timer)
  }, [duration])

  const entryS = prefersReducedMotion ? 0.15 : 0.42
  const exitS = prefersReducedMotion ? 0.12 : 0.32

  const outerVariants = {
    hidden: { x: '100%' },
    visible: {
      x: ['100%', '0%', '0%'],
      transition: { duration: entryS, times: [0, 0.7, 1], ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
    exit: {
      x: ['0%', '0%', '100%'],
      transition: { duration: exitS, times: [0, 0.55, 1], ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  }

  const innerVariants = {
    hidden: { y: 24, scale: 0.96, opacity: 0 },
    visible: {
      y: [24, -4, 0],
      scale: [0.96, 1.02, 1],
      opacity: [0, 1, 1],
      transition: { duration: entryS, times: [0, 0.7, 1], ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
    exit: {
      y: [0, 6, 0],
      scale: [1, 0.96, 0.96],
      opacity: [1, 0.6, 0],
      transition: { duration: exitS, times: [0, 0.55, 1], ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  }

  const animatePhase = phase === 'enter' ? 'visible' : 'exit'

  return (
    <div
      data-animation-id="modal-dismiss__snackbar-wipe"
      className={children === undefined ? 'pf-dismiss-stage' : undefined}
      style={{ overflow: 'hidden' }}
    >
      <m.div
        variants={outerVariants}
        initial="hidden"
        animate={animatePhase}
        style={{ animation: 'none' }}
      >
        <m.div
          className={className}
          style={{ ...style, animation: 'none' }}
          variants={innerVariants}
          initial="hidden"
          animate={animatePhase}
          onAnimationComplete={(definition: string) => {
            if (definition === 'exit') onDismissRef.current?.()
          }}
        >
          <ToastPlaceholder duration={duration}>{children}</ToastPlaceholder>
        </m.div>
      </m.div>
    </div>
  )
}

export const ModalDismissSnackbarWipe = memo(ModalDismissSnackbarWipeComponent)
