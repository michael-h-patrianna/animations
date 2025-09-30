import { useEffect, useRef } from 'react'
import './ProgressBarsProgressStriped.css'

export function ProgressBarsProgressStriped() {
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
    fill.style.background = 'linear-gradient(90deg, #c47ae5 0%, #d79af3 100%)'
    fill.style.position = 'relative'
    fill.style.overflow = 'hidden'

    // RN-friendly stripes: build slanted stripe elements we can animate via transform
    const stripesContainer = document.createElement('div')
    stripesContainer.className = 'animation-element'
    stripesContainer.style.position = 'absolute'
    stripesContainer.style.inset = '0'
    stripesContainer.style.overflow = 'hidden'
    stripesContainer.style.willChange = 'transform'
    fill.appendChild(stripesContainer)

    const stripeWidth = 16
    const stripeGap = 16
    const stripeColor = 'rgba(255,255,255,0.08)'
    const diagonal = Math.hypot(track.offsetWidth, track.offsetHeight)
    const stripeCount = Math.ceil((track.offsetWidth + track.offsetHeight) / (stripeWidth + stripeGap)) + 2

    for (let i = 0; i < stripeCount; i++) {
      const stripe = document.createElement('div')
      stripe.style.position = 'absolute'
      stripe.style.top = `${-diagonal * 0.2}px`
      stripe.style.left = `${i * (stripeWidth + stripeGap) - 100}px`
      stripe.style.width = `${stripeWidth}px`
      stripe.style.height = `${diagonal * 1.4}px`
      stripe.style.background = stripeColor
      stripe.style.transform = 'rotate(-45deg)'
      stripesContainer.appendChild(stripe)
    }

    // Add shimmer overlay for extra polish
    const shimmer = document.createElement('div')
    shimmer.className = 'animation-element'
    shimmer.style.position = 'absolute'
    shimmer.style.inset = '0'
    shimmer.style.background =
      'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)'
    shimmer.style.backgroundSize = '200% 100%'
    shimmer.style.opacity = '0'
    shimmer.style.pointerEvents = 'none'
    fill.appendChild(shimmer)

    const duration = 1400

    // Main fill animation
    const fillAnim = fill.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
      duration,
      fill: 'forwards',
      easing: 'cubic-bezier(0.4, 0, 0.6, 1)',
    })

    // Animate stripes by translating the container
    let stripeOffset = 0
    let raf = 0
    const animateStripes = () => {
      const speed = fillAnim.playState === 'finished' ? 1.5 : 6
      stripeOffset += speed
      stripesContainer.style.transform = `translateX(${stripeOffset}px)`
      raf = requestAnimationFrame(animateStripes)
    }
    raf = requestAnimationFrame(animateStripes)

    // Shimmer effect during fill
    shimmer.animate(
      [
        { backgroundPosition: '-100% 0', opacity: '0' },
        { backgroundPosition: '-100% 0', opacity: '0', offset: 0.3 },
        { backgroundPosition: '0% 0', opacity: '0.4', offset: 0.5 },
        { backgroundPosition: '100% 0', opacity: '0.4', offset: 0.7 },
        { backgroundPosition: '200% 0', opacity: '0' },
      ],
      {
        duration,
        fill: 'forwards',
        easing: 'ease-in-out',
      }
    )

    // Cleanup function
    return () => {
      const elements = container.querySelectorAll('.animation-element')
      elements.forEach((el) => el.remove())
      cancelAnimationFrame(raf)
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
        <div className="pf-progress-track">
          <div className="pf-progress-fill"></div>
        </div>
      </div>
    </div>
  )
}
