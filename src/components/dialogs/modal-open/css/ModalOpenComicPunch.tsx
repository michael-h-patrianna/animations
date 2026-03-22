/**
 * Modal punches in from trigger with squash-stretch impact — CSS variant.
 * Uses Web Animations API for all transforms.
 */

import { memo, useEffect, useMemo, useRef } from 'react'

import { ModalOpenPlaceholder } from '../MockOpenModalContent'
import { SharedDemoTriggers } from '../SharedDemoTriggers'
import { useModalOpenLogic, type DemoPreset } from '../SharedModalOpenLogic'
import '../shared.css'
import './shared-css-animations.css'
import {
  computeComicPunchTrajectory,
  reverseExtended,
  type ModalOpenProps,
} from '../SharedTypes'

const PRESETS: DemoPreset[] = [
  { label: 'Soft', force: 0.1, duration: 700, reveal: 55 },
  { label: 'Harder', force: 0.6, duration: 480, reveal: 60 },
  { label: "I'm scared", force: 1.0, duration: 350, reveal: 68 },
]

function ModalOpenComicPunchComponent(props: ModalOpenProps) {
  const s = useModalOpenLogic(props, PRESETS)
  const modalRef = useRef<HTMLDivElement>(null)

  const openTraj = useMemo(() => {
    if (!s.fromPoint || !s.center) return null
    return computeComicPunchTrajectory(s.fromPoint, s.center, s.force)
  }, [s.fromPoint, s.center, s.force])

  const closeTraj = useMemo(() => openTraj ? reverseExtended(openTraj) : null, [openTraj])
  const traj = s.isClosing ? closeTraj : openTraj

  useEffect(() => {
    const el = modalRef.current
    if (!el || !traj || !s.isVisible) return

    const keyframes: Keyframe[] = traj.times.map((t, i) => ({
      offset: t,
      transform: `translate(${traj.x[i]}px, ${traj.y[i]}px) scale(${traj.scale[i]}) scaleX(${traj.scaleX[i]}) scaleY(${traj.scaleY[i]}) rotate(${traj.rotate[i]}deg)`,
      opacity: traj.opacity[i],
    }))

    const anim = el.animate(keyframes, { duration: s.activeDurationMs, fill: 'forwards', easing: 'linear' })
    anim.onfinish = () => { if (s.isClosing) s.handleCloseComplete(); else s.handleOpenComplete() }
    return () => anim.cancel()
  }, [traj, s.activeDurationMs, s.isVisible, s.isClosing, s.handleCloseComplete, s.handleOpenComplete])

  return (
    <div ref={s.containerRef} className="pf-mo-container" data-animation-id="modal-open__comic-punch">
      {s.isDemoMode && s.phase === 'idle' && (
        <SharedDemoTriggers presets={PRESETS} btnRefs={s.btnRefs} onClickButton={s.handleDemoClick} />
      )}
      {s.isVisible && traj !== null && (
        <>
          <div className={`pf-mo-overlay ${s.isClosing ? 'pf-mo-overlay--closing' : 'pf-mo-overlay--css'}`} style={{ '--pf-mo-overlay-opacity': s.overlayOpacity, '--pf-mo-duration': `${s.activeDurationMs}ms` } as React.CSSProperties} />
          <div className="pf-mo-stage">
            <div ref={modalRef} className={`pf-mo-modal${props.className ? ` ${props.className}` : ''}`} style={props.style}>
              <ModalOpenPlaceholder revealed={s.contentRevealed} onClose={s.isDemoMode ? s.handleClose : undefined}>{props.children}</ModalOpenPlaceholder>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export const ModalOpenComicPunch = memo(ModalOpenComicPunchComponent)
