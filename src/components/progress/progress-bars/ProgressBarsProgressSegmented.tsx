import { useEffect, useRef } from 'react'
import './ProgressBarsProgressSegmented.css'

export function ProgressBarsProgressSegmented() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const trackContainer = container.querySelector('.track-container') as HTMLElement
    const track = container.querySelector('.pf-progress-track') as HTMLElement
    const fill = container.querySelector('.pf-progress-fill') as HTMLElement
    if (!trackContainer || !track || !fill) return

    // Clean up any existing animations
    const existingElements = container.querySelectorAll('.animation-element')
    existingElements.forEach((el) => el.remove())

    // Reset fill
    fill.style.transform = 'scaleX(0)'
    fill.style.transformOrigin = 'left center'
    fill.style.background = 'linear-gradient(90deg, #c47ae5 0%, #e8b4ff 100%)'
    fill.style.borderRadius = '8px 0 0 8px'
    fill.style.overflow = 'hidden'

    // Create gaps ABOVE the fill as static overlays
    const segmentCount = 4
    const segmentGap = 4

    // Create gap overlays that sit on top of the fill
    const gapOverlay = document.createElement('div')
    gapOverlay.className = 'animation-element'
    gapOverlay.style.position = 'absolute'
    gapOverlay.style.inset = '0'
    gapOverlay.style.pointerEvents = 'none'
    gapOverlay.style.zIndex = '10'
    trackContainer.appendChild(gapOverlay)

    // Add vertical gap bars
    for (let i = 1; i < segmentCount; i++) {
      const gap = document.createElement('div')
      gap.style.position = 'absolute'
      gap.style.width = `${segmentGap}px`
      gap.style.top = '0'
      gap.style.bottom = '0'
      gap.style.left = `calc(${(i * 100) / segmentCount}% - ${segmentGap / 2}px)`
      gap.style.background = track.style.background || '#2a1040'
      gapOverlay.appendChild(gap)
    }

    // Create segment overlay for animations
    const segmentOverlay = document.createElement('div')
    segmentOverlay.className = 'animation-element'
    segmentOverlay.style.position = 'absolute'
    segmentOverlay.style.inset = '0'
    segmentOverlay.style.display = 'flex'
    segmentOverlay.style.gap = `${segmentGap}px`
    segmentOverlay.style.pointerEvents = 'none'
    segmentOverlay.style.borderRadius = 'inherit'
    segmentOverlay.style.zIndex = '5'
    trackContainer.appendChild(segmentOverlay)

    // Create visual segments for animation purposes
    const segments = []
    for (let i = 0; i < segmentCount; i++) {
      const segment = document.createElement('div')
      segment.style.flex = '1'
      segment.style.position = 'relative'
      // First and last segments get special border radius
      if (i === 0) {
        segment.style.borderRadius = '8px 2px 2px 8px'
      } else if (i === segmentCount - 1) {
        segment.style.borderRadius = '2px 8px 8px 2px'
      } else {
        segment.style.borderRadius = '2px'
      }
      segment.style.border = '1px solid rgba(196,122,229,0.3)'
      segment.style.background = 'rgba(78,24,124,0.1)'
      segment.style.overflow = 'hidden'
      segmentOverlay.appendChild(segment)
      segments.push(segment)
    }

    const duration = 3000

    // Main fill animation
    fill.animate(
      [
        { transform: 'scaleX(0)' },
        { transform: 'scaleX(0.25)', offset: 0.25 },
        { transform: 'scaleX(0.5)', offset: 0.5 },
        { transform: 'scaleX(0.75)', offset: 0.75 },
        { transform: 'scaleX(1)' },
      ],
      {
        duration,
        fill: 'forwards',
        // Use linear to ensure segment thresholds are hit at exact times
        easing: 'linear',
      }
    )

    // Animate segment checkmarks as fill passes
    segments.forEach((segment, index) => {
      const threshold = (index + 1) / segmentCount
      setTimeout(() => {
        // Create glow effect
        const glow = document.createElement('div')
        glow.style.position = 'absolute'
        glow.style.inset = '0'
        glow.style.background = 'rgba(198,255,119,0.3)'
        glow.style.opacity = '0'
        segment.appendChild(glow)

        glow.animate([{ opacity: '0' }, { opacity: '1', offset: 0.3 }, { opacity: '0' }], {
          duration: 400,
          easing: 'ease-out',
        })

        // Pulse the segment
        segment.animate(
          [
            { transform: 'scale(1)', boxShadow: 'none' },
            { transform: 'scale(1.1)', boxShadow: '0 0 20px rgba(198,255,119,0.5)', offset: 0.3 },
            { transform: 'scale(1)', boxShadow: 'none' },
          ],
          { duration: 400, easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' }
        )
      }, duration * threshold)
    })

    // Cleanup function
    return () => {
      const elements = container.querySelectorAll('.animation-element')
      elements.forEach((el) => el.remove())
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="pf-progress-demo pf-progress-segmented"
      data-animation-id="progress-bars__progress-segmented"
    >
      <div className="track-container" style={{ position: 'relative' }}>
        <div className="pf-progress-track">
          <div className="pf-progress-fill"></div>
        </div>
      </div>
    </div>
  )
}
