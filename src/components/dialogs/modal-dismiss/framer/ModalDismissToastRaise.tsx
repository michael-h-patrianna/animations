/**
 * Auto-dismiss wrapper — content rises from below, exits upward after timeout.
 *
 * Copy-paste files: this file + SharedTypes.ts
 * Runtime deps: react, motion
 *
 * Usage: <ModalDismissToastRaise duration={5000} onDismiss={remove}><YourToast /></ModalDismissToastRaise>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useEffect, useRef, useState } from 'react'

import { ToastPlaceholder } from '@/components/dialogs/modal-dismiss/MockToastContent'
import type { AutoDismissProps } from '@/components/dialogs/modal-dismiss/SharedTypes'

const DEFAULT_DURATION = 3600

function ModalDismissToastRaiseComponent({
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

  const variants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' as const } },
        exit: { opacity: 0, transition: { duration: 0.25, ease: 'easeIn' as const } },
      }
    : {
        hidden: { y: '120%', scale: 0.96, opacity: 0 },
        visible: {
          y: ['120%', '-8%', '0%'],
          scale: [0.96, 1.02, 1],
          opacity: [0, 1, 1],
          transition: { duration: 0.42, times: [0, 0.7, 1], ease: [0.25, 0.46, 0.45, 0.94] as const },
        },
        exit: {
          y: ['0%', '5%', '-120%'],
          scale: [1, 1.04, 0.92],
          opacity: [1, 1, 0],
          transition: { duration: 0.32, times: [0, 0.3, 1], ease: [0.25, 0.46, 0.45, 0.94] as const },
        },
      }

  return (
    <div
      data-animation-id="modal-dismiss__toast-raise"
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

export const ModalDismissToastRaise = memo(ModalDismissToastRaiseComponent)
