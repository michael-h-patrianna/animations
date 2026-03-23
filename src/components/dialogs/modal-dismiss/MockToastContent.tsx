import type { ReactNode } from 'react'

import { DemoToast } from '@/components/demo-blocks'

/**
 * Default placeholder notification rendered when an animation component
 * receives no children. Provides a toast-like card with a progress bar
 * so the enter → wait → exit choreography is visible in the catalog.
 * Consumers replace this by passing their own children to the animation.
 */

/**
 * Wraps children or renders the default toast placeholder.
 * Used by animation components to provide visible content when children are omitted.
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
