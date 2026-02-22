import { useEffect, useRef } from 'react'
import './ModalCelebrationsCoinCascade.css'

import { coinImage } from '@/assets'

/**
 *
 */
export function ModalCelebrationsCoinCascade() {
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const layer = layerRef.current
    if (!layer) return

    // Clear any existing coins from previous animation
    while (layer.firstChild) {
      layer.removeChild(layer.firstChild)
    }

    const coinCount = 12
    const animations: Animation[] = []

    // Create coins and animate them cascading down like a waterfall
    for (let i = 0; i < coinCount; i++) {
      const coin = document.createElement('img')
      coin.className = 'pf-coin-cascade__coin'
      coin.src = coinImage
      coin.alt = 'coin'

      // Random starting positions across the top
      const startX = Math.random() * 200 + 50
      coin.style.position = 'absolute'
      coin.style.width = '22px'
      coin.style.height = '22px'
      coin.style.left = `${startX}px`
      coin.style.top = '-20px'
      coin.style.opacity = '0'

      layer.appendChild(coin)

      // Staggered delays for cascade effect
      const delay = i * 150 + Math.random() * 100

      // Cascade animation: coins fall down with slight horizontal drift
      const cascadeAnimation = coin.animate(
        [
          {
            transform: 'translate(0px, 0px) scale(0.3) rotate(0deg)',
            opacity: '0',
          },
          {
            transform: `translate(${(Math.random() - 0.5) * 30}px, 40px) scale(1) rotate(180deg)`,
            opacity: '1',
            offset: 0.2,
          },
          {
            transform: `translate(${(Math.random() - 0.5) * 50}px, 80px) scale(1) rotate(360deg)`,
            opacity: '1',
            offset: 0.6,
          },
          {
            transform: `translate(${(Math.random() - 0.5) * 60}px, 140px) scale(0.5) rotate(540deg)`,
            opacity: '0',
          },
        ],
        {
          duration: 2600,
          delay,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          fill: 'forwards',
        }
      )

      animations.push(cascadeAnimation)
    }

    return () => {
      animations.forEach((anim) => anim.cancel())
    }
  }, [])

  return (
    <div
      className="pf-celebration"
      data-animation-id="modal-celebrations__coin-cascade"
    >
      <div className="pf-celebration__layer" ref={layerRef} />
    </div>
  )
}
