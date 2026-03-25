/**
 * Modal flies in from a trigger element with arced trajectory — CSS variant.
 * Uses Web Animations API for trajectory, CSS @keyframes for scale/opacity/glow.
 * Supports reverse fly-out on close.
 *
 * Copy-paste files: this file + ModalOpenFlyIn.css + ../SharedTypes.ts + ../shared.css
 * Runtime deps: react
 */

import { memo, useEffect, useMemo, useRef } from 'react'

import { ModalOpenPlaceholder } from '@/components/dialogs/modal-open/MockOpenModalContent'
import { SharedDemoTriggers } from '@/components/dialogs/modal-open/SharedDemoTriggers'
import { useModalOpenLogic, type DemoPreset } from '@/components/dialogs/modal-open/SharedModalOpenLogic'
import '@/components/dialogs/modal-open/shared.css'
import './ModalOpenFlyIn.css'
import { computeArcCloseTrajectory, computeArcTrajectory } from '@/components/dialogs/modal-open/FlyInTrajectory'
import { MIN_ARC_DISTANCE, type ModalOpenProps } from '@/components/dialogs/modal-open/SharedTypes'

const PRESETS: DemoPreset[] = [
  { label: 'Soy', force: 0.02, duration: 1200, reveal: 40 },
  { label: 'Soft', force: 0.1, duration: 900, reveal: 50 },
  { label: 'Harder', force: 0.6, duration: 520, reveal: 65 },
  { label: 'Daddy', force: 1.0, duration: 400, reveal: 72 },
]

function ModalOpenFlyInComponent(props: ModalOpenProps) {
  const s = useModalOpenLogic(props, PRESETS)
  const modalRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<Animation | null>(null)

  const openTraj = useMemo(() => {
    if (!s.fromPoint || !s.center) return null
    return computeArcTrajectory(s.fromPoint, s.center, s.force)
  }, [s.fromPoint, s.center, s.force])

  const closeTraj = useMemo(() => {
    if (!s.fromPoint || !s.center) return null
    return computeArcCloseTrajectory(s.fromPoint, s.center, s.force)
  }, [s.fromPoint, s.center, s.force])

  const { isVisible, isClosing, activeDurationMs, handleCloseComplete, handleOpenComplete } = s
  const activeTrajectory = isClosing ? closeTraj : openTraj

  const distance =
    s.fromPoint && s.center
      ? Math.sqrt((s.fromPoint.x - s.center.x) ** 2 + (s.fromPoint.y - s.center.y) ** 2)
      : 0
  const isArc = distance >= MIN_ARC_DISTANCE

  // Web Animations API for trajectory
  useEffect(() => {
    const el = modalRef.current
    if (!el || !activeTrajectory || !isVisible || !isArc) return

    animRef.current?.cancel()

    const keyframes: Keyframe[] = activeTrajectory.times.map((t, i) => ({
      offset: t,
      transform: `translate(${activeTrajectory.x[i]}px, ${activeTrajectory.y[i]}px)`,
    }))

    const anim = el.animate(keyframes, {
      duration: activeDurationMs,
      fill: 'forwards',
      easing: 'linear',
    })
    animRef.current = anim

    anim.onfinish = () => {
      if (isClosing) handleCloseComplete()
      else handleOpenComplete()
    }

    return () => anim.cancel()
  }, [
    activeTrajectory,
    activeDurationMs,
    isVisible,
    isArc,
    isClosing,
    handleCloseComplete,
    handleOpenComplete,
  ])

  return (
    <div ref={s.containerRef} className="pf-mo-container" data-animation-id="modal-open__fly-in">
      {s.isDemoMode && s.phase === 'idle' && (
        <SharedDemoTriggers
          presets={PRESETS}
          buttonListRef={s.buttonListRef}
          onClickButton={s.handleDemoClick}
        />
      )}

      {isVisible && activeTrajectory !== null && (
        <>
          <div
            className={`pf-mo-overlay ${isClosing ? 'pf-mo-overlay--closing' : 'pf-mo-overlay--css'}`}
            style={
              {
                '--pf-mo-overlay-opacity': s.overlayOpacity,
                '--pf-mo-duration': `${activeDurationMs}ms`,
              } as React.CSSProperties
            }
          />

          <div className="pf-mo-stage">
            <div
              ref={modalRef}
              className={`pf-mo-modal ${isArc ? (isClosing ? 'pf-mo-modal--arc-close' : 'pf-mo-modal--arc') : 'pf-mo-modal--pop'}${props.className ? ` ${props.className}` : ''}`}
              style={
                {
                  ...props.style,
                  '--pf-mo-duration': `${activeDurationMs}ms`,
                } as React.CSSProperties
              }
            >
              {!isClosing && (
                <div
                  className="pf-mo-impact-glow pf-mo-impact-glow--css"
                  style={{ '--pf-mo-duration': `${activeDurationMs}ms` } as React.CSSProperties}
                />
              )}
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

export const ModalOpenFlyIn = memo(ModalOpenFlyInComponent)
