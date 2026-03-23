/**
 * Animated image — gentle floating with sway and subtle scale breathing. CSS variant.
 *
 * Copy-paste files: this file + IconAnimationsFloat.css + shared.css
 * Runtime deps: react
 *
 * Usage: <IconAnimationsFloat src="/balloon.png" alt="balloon" duration={8000} />
 */
import { memo } from 'react'
import './IconAnimationsFloat.css'

interface IconAnimationsFloatProps {
  /** Image source URL. Renders a placeholder when omitted. */
  src?: string
  /** Alt text for the image. Default: '' */
  alt?: string
  /** Image width in px. Default: 120 */
  width?: number
  /** Duration of one full cycle in ms. Default: 6000 */
  duration?: number
}

function IconAnimationsFloatComponent({
  src,
  alt = '',
  width = 120,
  duration = 6000,
}: IconAnimationsFloatProps) {
  return (
    <div data-animation-id="icon-animations__float">
      <div
        className="pf-icon-float"
        style={{ ['--pf-icon-float-duration' as string]: `${duration}ms` }}
      >
        {src !== undefined ? (
          <img src={src} alt={alt} className="pf-icon-anim__image" style={{ width }} />
        ) : (
          <div className="pf-icon-anim__placeholder" style={{ width, height: width }} />
        )}
      </div>
    </div>
  )
}

export const IconAnimationsFloat = memo(IconAnimationsFloatComponent)
