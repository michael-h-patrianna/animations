/**
 * SVG fallback coin rendered when no coinImage URL is provided.
 * Golden circle with radial gradient and shadow — lightweight, no image loading.
 *
 * Copy-paste files: this file (used by coin/treasure celebration components)
 * Runtime deps: react
 */

import { memo, useId } from 'react'

interface FallbackCoinProps {
  size: number
}

function FallbackCoinComponent({ size }: FallbackCoinProps) {
  const gradientId = useId()

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <defs>
        <radialGradient id={gradientId} cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="45%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="10.5" fill={`url(#${gradientId})`} />
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="#b45309"
        strokeWidth="0.5"
        strokeOpacity="0.3"
      />
      <circle cx="9" cy="9" r="3" fill="#fef3c7" fillOpacity="0.4" />
    </svg>
  )
}

export const FallbackCoin = memo(FallbackCoinComponent)
