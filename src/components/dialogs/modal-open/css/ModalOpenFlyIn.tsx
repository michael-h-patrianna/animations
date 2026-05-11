/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Modal flies in from a trigger element with arced trajectory — CSS variant.
 * Uses Web Animations API for trajectory, CSS @keyframes for scale/opacity/glow.
 * Supports reverse fly-out on close.
 *
 * Copy-paste files: this file + ModalOpenFlyIn.module.css + ../SharedTypes.ts + ../shared.css
 * Runtime deps: react
 */

import { memo, useEffect, useMemo, useRef } from 'react'

import { ModalOpenPlaceholder } from '@/components/dialogs/modal-open/SharedOpenModalPlaceholder'
import { SharedDemoTriggers } from '@/components/dialogs/modal-open/SharedDemoTriggers'
import { useModalOpenLogic } from '@/components/dialogs/modal-open/SharedModalOpenLogic'
import '@/components/dialogs/modal-open/shared.css'
import styles from './ModalOpenFlyIn.module.css'
import {
  computeArcCloseTrajectory,
  computeArcTrajectory,
} from '@/components/dialogs/modal-open/FlyInTrajectory'
import { FLY_IN_PRESETS } from '@/components/dialogs/modal-open/SharedPresets'
import {
  MIN_ARC_DISTANCE,
  shouldReduceMotion,
  type ModalOpenProps,
} from '@/components/dialogs/modal-open/SharedTypes'

function ModalOpenFlyInComponent(props: ModalOpenProps) {
  const s = useModalOpenLogic(props, FLY_IN_PRESETS)
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

  // Web Animations API for trajectory — skip when reduced motion is active so CSS fallback applies
  useEffect(() => {
    const el = modalRef.current
    if (!el || !activeTrajectory || !isVisible || !isArc) return

    if (shouldReduceMotion(el)) {
      animRef.current?.cancel()
      const id = requestAnimationFrame(() =>
        isClosing ? handleCloseComplete() : handleOpenComplete()
      )
      return () => cancelAnimationFrame(id)
    }

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
      if (isClosing) {
        handleCloseComplete()
      } else {
        try {
          anim.commitStyles()
        } catch {
          /* commitStyles unsupported */
        }
        anim.cancel()
        handleOpenComplete()
      }
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
          presets={FLY_IN_PRESETS}
          buttonListRef={s.buttonListRef}
          onClickButton={s.handleDemoClick}
        />
      )}

      {isVisible && activeTrajectory !== null && (
        <div className="pf-mo-stage">
          <div
            ref={modalRef}
            className={`pf-mo-modal ${isArc ? (isClosing ? styles['pf-mo-modal--arc-close'] : styles['pf-mo-modal--arc']) : styles['pf-mo-modal--pop']}${props.className ? ` ${props.className}` : ''}`}
            style={
              {
                ...props.style,
                '--pf-mo-duration': `${activeDurationMs}ms`,
              } as React.CSSProperties
            }
          >
            {!isClosing && (
              <div
                className={`pf-mo-impact-glow ${styles['pf-mo-impact-glow--css']}`}
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
      )}
    </div>
  )
}

export const ModalOpenFlyIn = memo(ModalOpenFlyInComponent)
