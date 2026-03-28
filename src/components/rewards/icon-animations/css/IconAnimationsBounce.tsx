/**
 * Animated image — bounce with squash-stretch deformation and tilt. CSS variant.
 *
 * Copy-paste files: this file + IconAnimationsBounce.css + shared.css
 * Runtime deps: react
 *
 * Usage: <IconAnimationsBounce src="/icon.png" alt="reward" width={80} />
 */
import { memo } from 'react'
import styles from './IconAnimationsBounce.module.css'

interface IconAnimationsBounceProps {
  /** Image source URL. Renders a placeholder when omitted. */
  src?: string
  /** Alt text for the image. Default: '' */
  alt?: string
  /** Image width in px. Default: 120 */
  width?: number
  /** Animation duration in ms. Default: 800 */
  duration?: number
}

function IconAnimationsBounceComponent({
  src,
  alt = '',
  width = 120,
  duration = 800,
}: IconAnimationsBounceProps) {
  return (
    <div data-animation-id="icon-animations__bounce">
      <div
        className={styles['pf-icon-bounce']}
        style={{ ['--pf-icon-bounce-duration' as string]: `${duration}ms` }}
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

export const IconAnimationsBounce = memo(IconAnimationsBounceComponent)
