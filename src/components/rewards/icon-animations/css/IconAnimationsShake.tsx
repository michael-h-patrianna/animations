/**
 * Animated image — horizontal shake with rotation wobble and compression. CSS variant.
 *
 * Copy-paste files: this file + IconAnimationsShake.css + shared.css
 * Runtime deps: react
 *
 * Usage: <IconAnimationsShake src="/bell.png" alt="notification" width={80} />
 */
import { memo } from 'react'
import './IconAnimationsShake.css'

interface IconAnimationsShakeProps {
  /** Image source URL. Renders a placeholder when omitted. */
  src?: string
  /** Alt text for the image. Default: '' */
  alt?: string
  /** Image width in px. Default: 120 */
  width?: number
  /** Animation duration in ms. Default: 500 */
  duration?: number
}

function IconAnimationsShakeComponent({
  src,
  alt = '',
  width = 120,
  duration = 500,
}: IconAnimationsShakeProps) {
  return (
    <div className="pf-icon-anim" data-animation-id="icon-animations__shake">
      <div
        className="pf-icon-shake"
        style={{ ['--pf-icon-shake-duration' as string]: `${duration}ms` }}
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

export const IconAnimationsShake = memo(IconAnimationsShakeComponent)
