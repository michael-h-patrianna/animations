/**
 * Auto-dismiss wrapper — content drops from above, exits downward after timeout.
 *
 * Copy-paste files: this file + SharedTypes.ts
 * Runtime deps: react, motion
 *
 * Usage: <ModalDismissToastDrop duration={5000} onDismiss={remove}><YourToast /></ModalDismissToastDrop>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useEffect, useRef, useState } from 'react'

import { ToastPlaceholder } from '@/components/dialogs/modal-dismiss/MockToastContent'
import type { AutoDismissProps } from '@/components/dialogs/modal-dismiss/SharedTypes'

const DEFAULT_DURATION = 3600

function ModalDismissToastDropComponent({
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

  const entryS = prefersReducedMotion ? 0.01 : 0.42
  const exitS = prefersReducedMotion ? 0.01 : 0.32

  const variants = {
    hidden: { y: '-120%', scale: 0.96, opacity: 0 },
    visible: {
      y: ['-120%', '10%', '0%'],
      scale: [0.96, 1.02, 1],
      opacity: [0, 1, 1],
      transition: { duration: entryS, times: [0, 0.7, 1], ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
    exit: {
      y: ['0%', '-5%', '120%'],
      scale: [1, 0.97, 0.82],
      opacity: [1, 0.65, 0],
      transition: { duration: exitS, times: [0, 0.2, 1], ease: [0.45, 0, 0.85, 0.25] as const },
    },
  }

  return (
    <div
      data-animation-id="modal-dismiss__toast-drop"
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

export const ModalDismissToastDrop = memo(ModalDismissToastDropComponent)
