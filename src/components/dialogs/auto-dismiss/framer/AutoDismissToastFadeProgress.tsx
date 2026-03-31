/**
 * Auto-dismiss wrapper — soft fade-in with scale, fades out after timeout.
 *
 * Copy-paste files: this file + SharedTypes.ts
 * Runtime deps: react, motion
 *
 * Usage: <AutoDismissToastFadeProgress duration={5000} onDismiss={remove}><YourToast /></AutoDismissToastFadeProgress>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useEffect, useRef, useState } from 'react'

import { ToastPlaceholder } from '@/components/dialogs/auto-dismiss/MockToastContent'
import type { AutoDismissProps } from '@/components/dialogs/auto-dismiss/SharedTypes'

const DEFAULT_DURATION = 4600

function AutoDismissToastFadeProgressComponent({
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
        hidden: { y: 18, scale: 0.94, opacity: 0 },
        visible: {
          y: 0,
          scale: 1,
          opacity: 1,
          transition: { duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] as const },
        },
        exit: {
          y: [0, 12, 24],
          scale: [1, 0.92, 0.88],
          opacity: [1, 0.4, 0],
          transition: {
            duration: 0.32,
            times: [0, 0.6, 1],
            ease: [0.25, 0.46, 0.45, 0.94] as const,
          },
        },
      }

  return (
    <div
      data-animation-id="auto-dismiss__toast-fade-progress"
      className={children === undefined ? 'pf-dismiss-stage' : undefined}
    >
      <m.div
        className={className}
        style={style}
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

export const AutoDismissToastFadeProgress = memo(AutoDismissToastFadeProgressComponent)
