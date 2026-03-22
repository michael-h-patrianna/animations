/**
 * Animated image — scale pulse with rotation wobble and opacity breathing. CSS variant.
 *
 * Copy-paste files: this file + IconAnimationsPulse.css + shared.css
 * Runtime deps: react
 *
 * Usage: <IconAnimationsPulse src="/scroll.png" alt="scroll" width={100} />
 */
import { memo } from 'react'
import './IconAnimationsPulse.css'

interface IconAnimationsPulseProps {
  /** Image source URL. Renders a placeholder when omitted. */
  src?: string
  /** Alt text for the image. Default: '' */
  alt?: string
  /** Image width in px. Default: 140 */
  width?: number
  /** Duration of one full cycle in ms. Default: 2000 */
  duration?: number
}

function IconAnimationsPulseComponent({
  src,
  alt = '',
  width = 140,
  duration = 2000,
}: IconAnimationsPulseProps) {
  return (
    <div className="pf-icon-anim" data-animation-id="icon-animations__pulse">
      <div
        className="pf-icon-pulse"
        style={{ ['--pf-icon-pulse-duration' as string]: `${duration}ms` }}
      >
        {src !== undefined ? (
          <img
            src={src}
            alt={alt}
            className="pf-icon-anim__image"
            style={{ width }}
          />
        ) : (
          <div className="pf-icon-anim__placeholder" style={{ width, height: width }} />
        )}
      </div>
    </div>
  )
}

export const IconAnimationsPulse = memo(IconAnimationsPulseComponent)
