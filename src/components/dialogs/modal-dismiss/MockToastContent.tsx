import type { ReactNode } from 'react'

import './shared.css'

const DEFAULT_PLACEHOLDER_DURATION = 4000

/**
 * Default placeholder notification rendered when an animation component
 * receives no children. Provides a toast-like card with a progress bar
 * so the enter → wait → exit choreography is visible in the catalog.
 * Consumers replace this by passing their own children to the animation.
 */
function MockToastContent({ duration = DEFAULT_PLACEHOLDER_DURATION }: { duration?: number }) {
  return (
    <div className="pf-toast">
      <div className="pf-toast__title">Action Complete</div>
      <div className="pf-toast__body">Your changes have been saved</div>
      <div className="pf-toast__progress">
        <div className="pf-toast__progress-bar" style={{ animationDuration: `${duration}ms` }} />
      </div>
    </div>
  )
}

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
  return <MockToastContent duration={duration} />
}
