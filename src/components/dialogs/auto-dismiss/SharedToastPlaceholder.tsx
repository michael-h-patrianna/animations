import type { ReactNode } from 'react'

import { DemoToast } from '@/components/demo-blocks'

/**
 * Wraps children or renders the default toast placeholder.
 * Consumers replace this by passing their own children to the animation.
 */
export function ToastPlaceholder({
  children,
  duration,
}: {
  children?: ReactNode
  duration?: number
}) {
  if (children !== undefined) return <>{children}</>
  return <DemoToast duration={duration} />
}
