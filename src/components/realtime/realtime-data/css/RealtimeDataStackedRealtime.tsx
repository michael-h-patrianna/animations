import { useEffect, useRef } from 'react'
import './RealtimeDataStackedRealtime.css'


/**
 *
 */
export function RealtimeDataStackedRealtime() {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([])

  const stackItems = [
    { label: 'Active Players', value: '1,247', active: true },
    { label: 'Total Wins', value: '856', active: false },
    { label: 'Live Games', value: '23', active: true },
    { label: 'Pending Rewards', value: '42', active: false },
    { label: 'Daily Bonus', value: '2x', active: true },
  ]

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    const startAnimation = () => {
      // Animate each row
      stackItems.forEach((item, index) => {
        const rowElement = rowRefs.current[index]
        const valueElement = valueRefs.current[index]

        if (rowElement) {
          const initialX = index % 2 === 0 ? -16 : 16
          rowElement.animate(
            [
              { transform: `translateX(${initialX}px)`, opacity: 0 },
              { transform: 'translateX(0)', opacity: 1 },
            ],
            {
              duration: 600,
              delay: index * 80,
              easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              fill: 'forwards',
            }
          )
        }

        if (valueElement) {
          const targetColor = item.active ? 'var(--pf-anim-cyan)' : 'var(--pf-anim-gray-400)'
          valueElement.animate(
            [{ color: 'var(--pf-anim-cyan)' }, { color: targetColor }],
            {
              duration: 400,
              delay: index * 80 + 200,
              easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              fill: 'forwards',
            }
          )
        }
      })

      // Reset and restart after animation completes
      timeoutId = setTimeout(() => {
        // Animate rows out
        stackItems.forEach((_, index) => {
          const rowElement = rowRefs.current[index]
          if (rowElement) {
            const exitX = index % 2 === 0 ? -16 : 16
            rowElement.animate(
              [
                { transform: 'translateX(0)', opacity: 1 },
                { transform: `translateX(${exitX}px)`, opacity: 0 },
              ],
              {
                duration: 400,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fill: 'forwards',
              }
            )
          }
        })

        setTimeout(startAnimation, 2000)
      }, 1500)
    }

    startAnimation()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="pf-realtime-data" data-animation-id="realtime-data__stacked-realtime">
      <div className="pf-realtime-data__stack">
        {stackItems.map((item, index) => (
          <div
            key={item.label}
            ref={(el) => {
              rowRefs.current[index] = el
            }}
            className={`pf-realtime-data__stack-row ${item.active ? 'active' : ''}`}
            style={{ opacity: 0, transform: `translateX(${index % 2 === 0 ? -16 : 16}px)` }}
          >
            <span className="pf-realtime-data__stack-label">{item.label}</span>
            <span
              ref={(el) => {
                valueRefs.current[index] = el
              }}
              className="pf-realtime-data__stack-value"
              style={{ color: 'var(--pf-anim-cyan)' }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

