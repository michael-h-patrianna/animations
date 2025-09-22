import { useEffect, useRef } from 'react'
import './ProgressBarsProgressThin.css'

export function ProgressBarsProgressThin() {
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

    // Style thin track
    track.style.height = '2px'
    track.style.background =
      'linear-gradient(90deg, rgba(78,24,124,0.2) 0%, rgba(78,24,124,0.1) 100%)'
    track.style.overflow = 'visible'
    track.style.borderRadius = '1px'

    // Ultra-thin fill
    fill.style.transform = 'scaleX(0)'
    fill.style.transformOrigin = 'left center'
    fill.style.height = '100%'
    fill.style.background = 'linear-gradient(90deg, #c47ae5 0%, #d79af3 60%, #c6ff77 100%)'
    fill.style.borderRadius = 'inherit'
    fill.style.position = 'relative'
    fill.style.overflow = 'visible'

    // Photon trail (leading light)
    const photonTrail = document.createElement('div')
    photonTrail.className = 'animation-element'
    photonTrail.style.position = 'absolute'
    photonTrail.style.right = '-20px'
    photonTrail.style.top = '50%'
    photonTrail.style.transform = 'translateY(-50%)'
    photonTrail.style.width = '60px'
    photonTrail.style.height = '1px'
    photonTrail.style.background =
      'linear-gradient(90deg, rgba(198,255,119,0) 0%, rgba(198,255,119,0.6) 50%, rgba(198,255,119,1) 100%)'
    photonTrail.style.pointerEvents = 'none'
    // Simulate subtle blur with opacity gradient for RN compatibility
    photonTrail.style.opacity = '0'
    fill.appendChild(photonTrail)

    // Micro pulse dots
    const pulseDots = []
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div')
      dot.className = 'animation-element'
      dot.style.position = 'absolute'
      dot.style.left = `${30 + i * 25}%`
      dot.style.top = '50%'
      dot.style.transform = 'translate(-50%, -50%)'
      dot.style.width = '4px'
      dot.style.height = '4px'
      dot.style.background = 'rgba(198,255,119,0.8)'
      dot.style.borderRadius = '50%'
      dot.style.opacity = '0'
      dot.style.pointerEvents = 'none'
      trackContainer.appendChild(dot)
      pulseDots.push(dot)
    }

    // Subtle halo
    const halo = document.createElement('div')
    halo.className = 'animation-element'
    halo.style.position = 'absolute'
    halo.style.inset = '-8px'
    halo.style.background =
      'radial-gradient(ellipse at right center, rgba(198,255,119,0.2) 0%, transparent 70%)'
    halo.style.opacity = '0'
    halo.style.pointerEvents = 'none'
    // Use larger gradient and scale for blur simulation in RN
    halo.style.transform = 'scale(1.3)'
    trackContainer.insertBefore(halo, track)

    const duration = 1200

    // Main glide animation
    const fillAnim = fill.animate(
      [
        { transform: 'scaleX(0)', opacity: '0.3' },
        { transform: 'scaleX(0.3)', opacity: '0.6', offset: 0.3 },
        { transform: 'scaleX(0.7)', opacity: '0.8', offset: 0.7 },
        { transform: 'scaleX(1)', opacity: '1' },
      ],
      {
        duration,
        fill: 'forwards',
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }
    )

    // Photon trail glide
    photonTrail.animate(
      [
        { opacity: '0', transform: 'translateY(-50%) translateX(20px)' },
        { opacity: '0', transform: 'translateY(-50%) translateX(20px)', offset: 0.2 },
        { opacity: '1', transform: 'translateY(-50%) translateX(0)', offset: 0.5 },
        { opacity: '0.5', transform: 'translateY(-50%) translateX(-10px)', offset: 0.9 },
        { opacity: '0', transform: 'translateY(-50%) translateX(-20px)' },
      ],
      {
        duration,
        fill: 'forwards',
        easing: 'ease-out',
      }
    )

    // Pulse dots sequence
    pulseDots.forEach((dot, i) => {
      setTimeout(
        () => {
          dot.animate(
            [
              { opacity: '0', transform: 'translate(-50%, -50%) scale(0)' },
              { opacity: '1', transform: 'translate(-50%, -50%) scale(1.5)', offset: 0.3 },
              { opacity: '0', transform: 'translate(-50%, -50%) scale(0)' },
            ],
            { duration: 400, easing: 'ease-out' }
          )
        },
        duration * 0.3 + i * 100
      )
    })

    // Halo fade
    halo.animate(
      [
        { opacity: '0' },
        { opacity: '0', offset: 0.3 },
        { opacity: '0.5', offset: 0.6 },
        { opacity: '0.3', offset: 0.9 },
        { opacity: '0' },
      ],
      {
        duration,
        fill: 'forwards',
        easing: 'ease-out',
      }
    )

    // Completion flash
    fillAnim.finished.then(() => {
      const flash = document.createElement('div')
      flash.className = 'animation-element'
      flash.style.position = 'absolute'
      flash.style.inset = '-4px'
      flash.style.background = 'linear-gradient(90deg, transparent 0%, rgba(198,255,119,0.4) 100%)'
      flash.style.pointerEvents = 'none'
      trackContainer.appendChild(flash)

      const flashAnim = flash.animate(
        [
          { opacity: '0', transform: 'scaleX(0.8)' },
          { opacity: '1', transform: 'scaleX(1)', offset: 0.3 },
          { opacity: '0', transform: 'scaleX(1)' },
        ],
        { duration: 300, easing: 'ease-out' }
      )

      flashAnim.finished.then(() => flash.remove())
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
      className="pf-progress-demo pf-progress-thin"
      data-animation-id="progress-bars__progress-thin"
    >
      <div className="pf-progress-demo__label">Level progress</div>
      <div className="track-container" style={{ position: 'relative' }}>
        <div className="pf-progress-track">
          <div className="pf-progress-fill"></div>
        </div>
      </div>
    </div>
  )
}
