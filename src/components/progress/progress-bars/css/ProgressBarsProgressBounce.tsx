import { useEffect, useRef } from 'react'
import './ProgressBarsProgressBounce.css'
export function ProgressBarsProgressBounce() {
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const trackContainer = container.querySelector<HTMLElement>('.track-container')
    const track = container.querySelector<HTMLElement>('.pf-progress-track')
    const fill = container.querySelector<HTMLElement>('.pf-progress-fill')
    if (trackContainer == null || track == null || fill == null) return // Clean up any existing animations
    const existingElements = container.querySelectorAll('.animation-element')
    existingElements.forEach((el) => el.remove()) // Reset fill
    fill.style.transform = 'scaleX(0) scaleY(1)'
    fill.style.transformOrigin = 'left center'
    fill.style.background =
      'linear-gradient(90deg, var(--pf-anim-green) 0%, var(--pf-anim-green-light) 100%)' // Create squash and stretch container
    const bounceContainer = document.createElement('div')
    bounceContainer.className = 'animation-element'
    bounceContainer.style.position = 'absolute'
    bounceContainer.style.inset = '0'
    bounceContainer.style.transformOrigin = 'right center'
    fill.appendChild(bounceContainer) // Impact waves
    const impactWaves: HTMLElement[] = []
    for (let i = 0; i < 3; i++) {
      const wave = document.createElement('div')
      wave.className = 'animation-element'
      wave.style.position = 'absolute'
      wave.style.right = '0'
      wave.style.top = '0'
      wave.style.bottom = '0'
      wave.style.width = '4px'
      const waveColors = [
        'var(--pf-anim-green-60)',
        'var(--pf-anim-green-40)',
        'var(--pf-anim-green-20)',
      ]
      wave.style.background = waveColors[i]
      wave.style.opacity = '0'
      wave.style.pointerEvents = 'none'
      trackContainer.appendChild(wave)
      impactWaves.push(wave)
    } // Elastic deformation overlay
    const elasticOverlay = document.createElement('div')
    elasticOverlay.className = 'animation-element'
    elasticOverlay.style.position = 'absolute'
    elasticOverlay.style.inset = '0'
    elasticOverlay.style.background =
      'radial-gradient(ellipse at right center, var(--pf-anim-green-30) 0%, transparent 50%)' // eslint-disable-line animation-rules/no-radial-angular-gradient -- radial effect required for visual design
    elasticOverlay.style.opacity = '0'
    elasticOverlay.style.pointerEvents = 'none'
    fill.appendChild(elasticOverlay)
    const duration = 1600
    const timeoutIds: ReturnType<typeof setTimeout>[] = [] // Main fill with anticipation and overshoot
    const fillAnim = fill.animate(
      [
        { transform: 'scaleX(0) scaleY(1)' },
        { transform: 'scaleX(0.7) scaleY(1)', offset: 0.5 },
        { transform: 'scaleX(0.7) scaleY(0.8)', offset: 0.55 }, // Anticipation squash
        { transform: 'scaleX(1.15) scaleY(0.85)', offset: 0.7 }, // Overshoot with squash
        { transform: 'scaleX(0.92) scaleY(1.08)', offset: 0.78 }, // First bounce
        { transform: 'scaleX(1.06) scaleY(0.96)', offset: 0.86 }, // Second bounce
        { transform: 'scaleX(0.97) scaleY(1.02)', offset: 0.92 }, // Third bounce
        { transform: 'scaleX(1.01) scaleY(0.99)', offset: 0.96 }, // Settle
        { transform: 'scaleX(1) scaleY(1)' },
      ],
      { duration, fill: 'forwards', easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
    ) // Track deformation
    track.animate(
      [
        { transform: 'scaleY(1)' },
        { transform: 'scaleY(1)', offset: 0.55 },
        { transform: 'scaleY(1.2)', offset: 0.7 },
        { transform: 'scaleY(0.9)', offset: 0.78 },
        { transform: 'scaleY(1.1)', offset: 0.86 },
        { transform: 'scaleY(0.95)', offset: 0.92 },
        { transform: 'scaleY(1)' },
      ],
      { duration, fill: 'forwards', easing: 'ease-out' }
    ) // Impact waves animation
    {
      const t = setTimeout(() => {
        impactWaves.forEach((wave, i) => {
          const tw = setTimeout(() => {
            wave.animate(
              [
                { transform: 'translateX(0) scaleX(1)', opacity: '0' },
                { transform: 'translateX(-10px) scaleX(2)', opacity: '1', offset: 0.2 },
                { transform: 'translateX(-30px) scaleX(0.5)', opacity: '0' },
              ],
              { duration: 400, easing: 'ease-out' }
            )
          }, i * 50)
          timeoutIds.push(tw)
        })
      }, duration * 0.7)
      timeoutIds.push(t)
    } // Elastic overlay flash
    elasticOverlay.animate(
      [
        { opacity: '0' },
        { opacity: '0', offset: 0.68 },
        { opacity: '1', offset: 0.72 },
        { opacity: '0', offset: 0.85 },
      ],
      { duration, fill: 'forwards', easing: 'ease-out' }
    ) // Celebration particles on completion
    fillAnim.finished.then(() => {
      for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div')
        particle.className = 'animation-element'
        particle.style.position = 'absolute'
        particle.style.right = '10px'
        particle.style.top = '50%'
        particle.style.width = '4px'
        particle.style.height = '4px'
        particle.style.background =
          i % 2 === 0 ? 'var(--pf-anim-green)' : 'var(--pf-anim-green-dark)'
        particle.style.borderRadius = '50%'
        particle.style.pointerEvents = 'none'
        trackContainer.appendChild(particle)
        const angle = (i / 5) * Math.PI * 2
        const distance = 30 + Math.random() * 20
        const particleAnim = particle.animate(
          [
            { transform: 'translateY(-50%) translate(0px, 0px) scale(0)', opacity: '1' },
            {
              transform: `translateY(-50%) translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1)`,
              opacity: '1',
              offset: 0.5,
            },
            {
              transform: `translateY(-50%) translate(${Math.cos(angle) * distance * 1.5}px, ${Math.sin(angle) * distance * 1.5}px) scale(0)`,
              opacity: '0',
            },
          ],
          { duration: 600, easing: 'cubic-bezier(0.4, 0, 0.6, 1)' }
        ) // Remove particle after animation
        particleAnim.finished.then(() => particle.remove())
      }
    }) // Cleanup function
    return () => {
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId))
      const elements = container.querySelectorAll('.animation-element')
      elements.forEach((el) => el.remove())
    }
  }, [])
  return (
    <div
      ref={containerRef}
      className="pf-progress-demo pf-progress-bounce"
      data-animation-id="progress-bars__progress-bounce"
    >
      <div className="track-container" style={{ position: 'relative' }}>
        <div className="pf-progress-track">
          <div className="pf-progress-fill"></div>
        </div>
      </div>
    </div>
  )
}
