/**
 * Auto-dismiss wrapper — content slides in from the left, exits left after timeout.
 *
 * Copy-paste files: this file + SharedTypes.ts
 * Runtime deps: react, motion
 *
 * Usage: <ModalDismissToastSlideLeft duration={5000} onDismiss={remove}><YourToast /></ModalDismissToastSlideLeft>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useEffect, useRef, useState } from 'react'

import { ToastPlaceholder } from '@/components/dialogs/modal-dismiss/MockToastContent'
import type { AutoDismissProps } from '@/components/dialogs/modal-dismiss/SharedTypes'

const DEFAULT_DURATION = 3800

function ModalDismissToastSlideLeftComponent({
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

  const entryS = prefersReducedMotion ? 0.15 : 0.32
  const exitS = prefersReducedMotion ? 0.12 : 0.24

  const variants = {
    hidden: { x: '-140%', scale: 0.96, opacity: 0 },
    visible: {
      x: ['-140%', '8%', '0%'],
      scale: [0.96, 1.02, 1],
      opacity: [0, 1, 1],
      transition: { duration: entryS, times: [0, 0.7, 1], ease: [0.4, 0, 0.2, 1] as const },
    },
    exit: {
      x: ['0%', '-6%', '-160%'],
      scale: [1, 1.0, 0.94],
      opacity: [1, 0.92, 0],
      transition: { duration: exitS, times: [0, 0.35, 1], ease: [0.4, 0, 0.2, 1] as const },
    },
  }

  return (
    <div
      data-animation-id="modal-dismiss__toast-slide-left"
      className={children === undefined ? 'pf-dismiss-stage' : undefined}
    >
      <m.div
        className={className}
        style={{ ...style, animation: 'none' }}
        variants={variants}
        initial="hidden"
        animate={phase === 'enter' ? 'visible' : 'exit'}
        onAnimationComplete={(definition: string) => {
          if (definition === 'exit') onDismissRef.current?.()
        }}
      >
        <ToastPlaceholder duration={duration}>{children}</ToastPlaceholder>
      </m.div>
    </div>
  )
}

export const ModalDismissToastSlideLeft = memo(ModalDismissToastSlideLeftComponent)
