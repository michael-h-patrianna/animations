/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Animated image — horizontal shake with rotation wobble and compression. CSS variant.
 *
 * Copy-paste files: this file + IconAnimationsShake.module.css + shared.css
 * Runtime deps: react
 *
 * Usage: <IconAnimationsShake src="/bell.png" alt="notification" width={80} />
 */
import { memo } from 'react'
import styles from './IconAnimationsShake.module.css'

interface IconAnimationsShakeProps {
  /** Image source URL. No default bundled — renders no image when omitted. */
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
    <div data-animation-id="icon-animations__shake">
      <div
        className={styles['pf-icon-shake']}
        style={{ ['--pf-icon-shake-duration' as string]: `${duration}ms` }}
      >
        {src !== undefined && (
          <img src={src} alt={alt} className="pf-icon-anim__image" style={{ width }} />
        )}
      </div>
    </div>
  )
}

export const IconAnimationsShake = memo(IconAnimationsShakeComponent)
