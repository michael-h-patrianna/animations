import './demo-blocks.css'

interface DemoBadgeProps {
  label?: string
  className?: string
}

/** Inline badge label for demo modal headers. */
export function DemoBadge({ label = 'Modal', className = '' }: DemoBadgeProps) {
  return <span className={`pf-demo-badge ${className}`}>{label}</span>
}
