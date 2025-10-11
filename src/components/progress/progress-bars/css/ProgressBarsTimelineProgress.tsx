import { useEffect, useRef } from 'react'
import type { AnimationMetadata } from '@/types/animation'
import './ProgressBarsTimelineProgress.css'

export const metadata: AnimationMetadata = {
  id: 'progress-bars__timeline-progress',
  title: 'Timeline Progress',
  description: 'Timeline progress visualization showing sequential milestones with connected flow.',
  tags: ['css', 'js'],
}

export function ProgressBarsTimelineProgress() {
  const steps = 4
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const connectorRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const stepElements = stepRefs.current.filter((el): el is HTMLDivElement => el !== null)
    const connectorElements = connectorRefs.current.filter((el): el is HTMLDivElement => el !== null)

    // Stagger delay: 260ms per child
    stepElements.forEach((stepEl, index) => {
      const delay = index * 260

      // Step animation: scale [0.9 -> 1.06 -> 1] and opacity [0.3 -> 1]
      // Duration: 460ms, easing: cubic-bezier(0.34, 1.56, 0.64, 1)
      stepEl.animate(
        [
          { transform: 'scale(0.9)', opacity: 0.3 },
          { transform: 'scale(1.06)', opacity: 1, offset: 0.5 },
          { transform: 'scale(1)', opacity: 1 },
        ],
        {
          duration: 460,
          delay,
          easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          fill: 'forwards',
        }
      )

      // Connector animation (if exists): scaleX 0 -> 1, opacity 0.3 -> 1
      // Duration: 260ms, easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)
      const connectorEl = connectorElements[index]
      if (connectorEl) {
        connectorEl.animate(
          [
            { transform: 'scaleX(0)', opacity: 0.3 },
            { transform: 'scaleX(1)', opacity: 1 },
          ],
          {
            duration: 260,
            delay,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fill: 'forwards',
          }
        )
      }
    })

    // Cleanup function
    return () => {
      stepElements.forEach((el) => {
        el.getAnimations().forEach((anim) => anim.cancel())
      })
      connectorElements.forEach((el) => {
        el.getAnimations().forEach((anim) => anim.cancel())
      })
    }
  }, [])

  return (
    <div
      className="pf-timeline-progress"
      data-animation-id="progress-bars__timeline-progress"
    >
      <div className="pf-timeline-progress__track">
        {Array.from({ length: steps }, (_, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: index === steps - 1 ? 'none' : '1',
            }}
          >
            <div
              ref={(el) => {
                stepRefs.current[index] = el
              }}
              className="pf-timeline-progress__step"
              style={{
                background: 'rgba(200, 53, 88, 0.2)',
                borderColor: 'rgba(200, 53, 88, 0.4)',
                color: '#ffffff',
                transform: 'scale(0.9)',
                opacity: 0.3,
                willChange: 'transform, opacity',
              }}
            >
              {index + 1}
            </div>
            {index < steps - 1 && (
              <div
                ref={(el) => {
                  connectorRefs.current[index] = el
                }}
                className="pf-timeline-progress__connector"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(200, 53, 88, 0.4), rgba(236, 195, 255, 0.2))',
                  transformOrigin: 'left',
                  transform: 'scaleX(0)',
                  opacity: 0.3,
                  willChange: 'transform, opacity',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
