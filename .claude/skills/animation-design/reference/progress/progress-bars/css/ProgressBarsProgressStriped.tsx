import { useEffect, useRef } from 'react'
import './ProgressBarsProgressStriped.css'


export function ProgressBarsProgressStriped() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const track = container.querySelector('.pf-progress-track') as HTMLElement
    if (!track) return

    // Clean up any existing animation elements
    const existingElements = container.querySelectorAll('.animation-element')
    existingElements.forEach((el) => el.remove())

    // Create fill bar
    const fill = document.createElement('div')
    fill.className = 'animation-element pf-progress-fill'
    track.appendChild(fill)

    // Create stripes container
    const stripesContainer = document.createElement('div')
    stripesContainer.className = 'animation-element stripes-container'
    fill.appendChild(stripesContainer)

    // Generate 20 stripe elements
    const stripeCount = 20
    for (let i = 0; i < stripeCount; i++) {
      const stripe = document.createElement('div')
      stripe.className = 'animation-element stripe'
      stripe.style.setProperty('--stripe-index', String(i))
      stripesContainer.appendChild(stripe)
    }

    // Create shimmer overlay
    const shimmer = document.createElement('div')
    shimmer.className = 'animation-element shimmer'
    fill.appendChild(shimmer)

    // Cleanup function
    return () => {
      const elements = container.querySelectorAll('.animation-element')
      elements.forEach((el) => el.remove())
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="pf-progress-demo pf-progress-striped"
      data-animation-id="progress-bars__progress-striped"
    >
      <div className="pf-progress-demo__label">Level progress</div>
      <div className="track-container">
        <div className="pf-progress-track"></div>
      </div>
    </div>
  )
}

