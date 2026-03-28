/**
 * Modal inflates like a bubble from trigger — CSS variant.
 * Uses Web Animations API for all transforms.
 *
 * Copy-paste files: this file + ../SharedTypes.ts + ../shared.css
 * Runtime deps: react
 */

import { memo, useEffect, useMemo, useRef } from 'react'

import { ModalOpenPlaceholder } from '@/components/dialogs/modal-open/MockOpenModalContent'
import { SharedDemoTriggers } from '@/components/dialogs/modal-open/SharedDemoTriggers'
import {
  useModalOpenLogic,
  type DemoPreset,
} from '@/components/dialogs/modal-open/SharedModalOpenLogic'
import '@/components/dialogs/modal-open/shared.css'
import '@/components/dialogs/modal-open/css/shared-css-animations.css'
import {
  computeBubblePopCloseTrajectory,
  computeBubblePopTrajectory,
} from '@/components/dialogs/modal-open/BubblePopTrajectory'
import {
  shouldReduceMotion,
  type ModalOpenProps,
} from '@/components/dialogs/modal-open/SharedTypes'

const PRESETS: DemoPreset[] = [
  { label: 'Soy', force: 0.02, duration: 1200, reveal: 35 },
  { label: 'Soft', force: 0.1, duration: 900, reveal: 45 },
  { label: 'Harder', force: 0.6, duration: 550, reveal: 60 },
  { label: 'Daddy', force: 1.0, duration: 380, reveal: 70 },
]

function ModalOpenBubblePopComponent(props: ModalOpenProps) {
  const s = useModalOpenLogic(props, PRESETS)
  const modalRef = useRef<HTMLDivElement>(null)

  const openTraj = useMemo(() => {
    if (!s.fromPoint || !s.center) return null
    return computeBubblePopTrajectory(s.fromPoint, s.center, s.force)
  }, [s.fromPoint, s.center, s.force])

  const closeTraj = useMemo(
    () =>
      s.fromPoint && s.center
        ? computeBubblePopCloseTrajectory(s.fromPoint, s.center, s.force)
        : null,
    [s.fromPoint, s.center, s.force]
  )

  const { isVisible, isClosing, activeDurationMs, handleCloseComplete, handleOpenComplete } = s
  const traj = isClosing ? closeTraj : openTraj

  // WAAPI for all transforms — skip when reduced motion is active so CSS fallback applies
  useEffect(() => {
    const el = modalRef.current
    if (!el || !traj || !isVisible) return

    if (shouldReduceMotion(el)) {
      const id = requestAnimationFrame(() =>
        isClosing ? handleCloseComplete() : handleOpenComplete()
      )
      return () => cancelAnimationFrame(id)
    }

    const keyframes: Keyframe[] = traj.times.map((t, i) => ({
      offset: t,
      transform: `translate(${traj.x[i]}px, ${traj.y[i]}px) scale(${traj.scale[i]}) scaleX(${traj.scaleX[i]}) scaleY(${traj.scaleY[i]}) skewX(${traj.skewX[i]}deg)`,
      opacity: traj.opacity[i],
    }))

    const anim = el.animate(keyframes, {
      duration: activeDurationMs,
      fill: 'forwards',
      easing: 'linear',
    })

    anim.onfinish = () => {
      if (isClosing) handleCloseComplete()
      else handleOpenComplete()
    }

    return () => anim.cancel()
  }, [traj, activeDurationMs, isVisible, isClosing, handleCloseComplete, handleOpenComplete])

  return (
    <div
      ref={s.containerRef}
      className="pf-mo-container"
      data-animation-id="modal-open__bubble-pop"
    >
      {s.isDemoMode && s.phase === 'idle' && (
        <SharedDemoTriggers
          presets={PRESETS}
          buttonListRef={s.buttonListRef}
          onClickButton={s.handleDemoClick}
        />
      )}

      {s.isVisible && traj !== null && (
        <>
          <div
            className={`pf-mo-overlay ${s.isClosing ? 'pf-mo-overlay--closing' : 'pf-mo-overlay--css'}`}
            style={
              {
                '--pf-mo-overlay-opacity': s.overlayOpacity,
                '--pf-mo-duration': `${s.activeDurationMs}ms`,
              } as React.CSSProperties
            }
          />
          <div className="pf-mo-stage">
            <div
              ref={modalRef}
              className={`pf-mo-modal${props.className ? ` ${props.className}` : ''}`}
              style={props.style}
            >
              <ModalOpenPlaceholder
                revealed={s.contentRevealed}
                onClose={s.isDemoMode ? s.handleClose : undefined}
              >
                {props.children}
              </ModalOpenPlaceholder>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export const ModalOpenBubblePop = memo(ModalOpenBubblePopComponent)
