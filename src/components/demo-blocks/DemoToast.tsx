import './demo-blocks.css'

interface DemoToastProps {
  title?: string
  body?: string
  duration?: number
  className?: string
}

const DEFAULT_DURATION = 4000

/** Auto-dismissing toast notification for demo feedback. */
export function DemoToast({
  title = 'Action Complete',
  body = 'Your changes have been saved',
  duration = DEFAULT_DURATION,
  className = '',
}: DemoToastProps) {
  return (
    <div className={`pf-demo-toast ${className}`}>
      <div className="pf-demo-toast__title">{title}</div>
      <div className="pf-demo-toast__body">{body}</div>
      <div className="pf-demo-toast__progress">
        <div
          className="pf-demo-toast__progress-bar"
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  )
}
