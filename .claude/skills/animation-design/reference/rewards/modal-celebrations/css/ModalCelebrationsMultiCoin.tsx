import coinImage from '@/assets/coin.png'
import { useEffect, useRef } from 'react'
import './ModalCelebrationsMultiCoin.css'

export function ModalCelebrationsMultiCoin() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Clear any existing content
    container.innerHTML = ''

    const groupCount = 3
    const coinsPerGroup = 5
    const animations: Animation[] = []

    // Create multiple groups of coins
    for (let g = 0; g < groupCount; g++) {
      const group = document.createElement('div')
      group.className = 'pf-multi-coin__group'

      // Position groups across the container
      const groupX = 60 + g * 80
      group.style.left = `${groupX}px`
      group.style.top = '30px'

      container.appendChild(group)

      // Create coins within each group
      for (let i = 0; i < coinsPerGroup; i++) {
        const coin = document.createElement('img')
        coin.className = 'pf-multi-coin__coin'
        coin.src = coinImage
        coin.alt = 'coin'

        // Starting position at center of group
        coin.style.position = 'absolute'
        coin.style.width = '20px'
        coin.style.height = '20px'
        coin.style.left = '20px'
        coin.style.top = '20px'
        coin.style.opacity = '0'

        group.appendChild(coin)

        // Staggered delays for each group and coin
        const groupDelay = g * 300
        const coinDelay = i * 80
        const totalDelay = groupDelay + coinDelay

        // Multi-coin animation: coins burst out in different directions
        const angle = (i / coinsPerGroup) * 2 * Math.PI
        const radius = 40
        const endX = Math.cos(angle) * radius
        const endY = Math.sin(angle) * radius

        const coinAnimation = coin.animate(
          [
            {
              transform: 'translate(0px, 0px) scale(0.2) rotate(0deg)',
              opacity: '0',
            },
            {
              transform: `translate(${endX * 0.3}px, ${endY * 0.3}px) scale(1.2) rotate(180deg)`,
              opacity: '1',
              offset: 0.3,
            },
            {
              transform: `translate(${endX}px, ${endY}px) scale(1) rotate(360deg)`,
              opacity: '1',
              offset: 0.7,
            },
            {
              transform: `translate(${endX * 1.2}px, ${endY * 1.2}px) scale(0.4) rotate(540deg)`,
              opacity: '0',
            },
          ],
          {
            duration: 2600,
            delay: totalDelay,
            easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            fill: 'forwards',
          }
        )

        animations.push(coinAnimation)
      }
    }

    return () => {
      animations.forEach((anim) => anim.cancel())
    }
  }, [])

  return (
    <div
      className="pf-modal-celebration pf-modal-celebration--multi-coin"
      data-animation-id="modal-celebrations__multi-coin"
      ref={containerRef}
    >
      <div className="pf-multi-coin"></div>
    </div>
  )
}
