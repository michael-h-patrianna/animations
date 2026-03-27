/**
 * Modal flies in from a trigger element with arced trajectory, impact settle,
 * and optional staggered content reveal. Supports reverse fly-out on close.
 *
 * Copy-paste files: this file + ../SharedTypes.ts + ../shared.css
 * Runtime deps: react, motion
 *
 * @example
 * const btnRef = useRef<HTMLButtonElement>(null)
 * <button ref={btnRef} onClick={() => setOpen(true)}>Open</button>
 * {open && (
 *   <ModalOpenFlyIn from={btnRef} duration={600} impactForce={0.8}>
 *     <MyModalContent />
 *   </ModalOpenFlyIn>
 * )}
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useMemo } from 'react'

import { ModalOpenPlaceholder } from '@/components/dialogs/modal-open/MockOpenModalContent'
import { SharedDemoTriggers } from '@/components/dialogs/modal-open/SharedDemoTriggers'
import {
  useModalOpenLogic,
  type DemoPreset,
} from '@/components/dialogs/modal-open/SharedModalOpenLogic'
import '@/components/dialogs/modal-open/shared.css'
import {
  computeArcCloseTrajectory,
  computeArcTrajectory,
} from '@/components/dialogs/modal-open/FlyInTrajectory'
import {
  type ModalOpenProps,
  type TrajectoryArrays,
} from '@/components/dialogs/modal-open/SharedTypes'

const PRESETS: DemoPreset[] = [
  { label: 'Soy', force: 0.02, duration: 1200, reveal: 40 },
  { label: 'Soft', force: 0.1, duration: 900, reveal: 50 },
  { label: 'Harder', force: 0.6, duration: 520, reveal: 65 },
  { label: 'Daddy', force: 1.0, duration: 400, reveal: 72 },
]

function ModalOpenFlyInComponent(props: ModalOpenProps) {
  const s = useModalOpenLogic(props, PRESETS)
  const reduced = useReducedMotion() === true

  const openTraj = useMemo(() => {
    if (!s.fromPoint || !s.center) return null
    return computeArcTrajectory(s.fromPoint, s.center, s.force)
  }, [s.fromPoint, s.center, s.force])

  const closeTraj = useMemo(
    () =>
      s.fromPoint && s.center ? computeArcCloseTrajectory(s.fromPoint, s.center, s.force) : null,
    [s.fromPoint, s.center, s.force]
  )

  const traj: TrajectoryArrays | null = s.isClosing ? closeTraj : openTraj

  return (
    <div ref={s.containerRef} className="pf-mo-container" data-animation-id="modal-open__fly-in">
      {s.isDemoMode && s.phase === 'idle' && (
        <SharedDemoTriggers
          presets={PRESETS}
          buttonListRef={s.buttonListRef}
          onClickButton={s.handleDemoClick}
        />
      )}

      {s.isVisible && traj !== null && (
        <>
          <m.div
            className="pf-mo-overlay"
            initial={{ opacity: s.isClosing ? s.overlayOpacity : 0 }}
            animate={{ opacity: s.isClosing ? 0 : s.overlayOpacity }}
            transition={{
              duration: reduced ? 0.2 : s.activeDurationS * 0.5,
              ease: [0, 0, 0.2, 1],
            }}
            style={{ animation: 'none' }}
          />

          <div className="pf-mo-stage">
            <m.div
              key={s.isClosing ? 'close' : 'open'}
              className={`pf-mo-modal${props.className ? ` ${props.className}` : ''}`}
              style={{ ...props.style, animation: 'none' }}
              initial={
                reduced
                  ? { scale: s.isClosing ? 1 : 0.85, opacity: s.isClosing ? 1 : 0 }
                  : {
                      x: traj.x[0],
                      y: traj.y[0],
                      scale: traj.scale[0],
                      opacity: traj.opacity[0],
                    }
              }
              animate={
                reduced
                  ? { scale: s.isClosing ? 0.85 : 1, opacity: s.isClosing ? 0 : 1 }
                  : {
                      x: traj.x,
                      y: traj.y,
                      scale: traj.scale,
                      opacity: traj.opacity,
                    }
              }
              transition={
                reduced
                  ? { duration: 0.01 }
                  : {
                      duration: s.activeDurationS,
                      times: traj.times,
                      ease: 'linear',
                    }
              }
              onAnimationComplete={s.isClosing ? s.handleCloseComplete : s.handleOpenComplete}
            >
              {!s.isClosing && (
                <m.div
                  className="pf-mo-impact-glow"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: reduced ? 0 : [0, 0, s.force * 1.0, s.force * 0.4, s.force * 0.1, 0],
                  }}
                  transition={{
                    duration: s.activeDurationS,
                    times: [0, 0.68, 0.78, 0.88, 0.95, 1],
                  }}
                  style={{ animation: 'none' }}
                />
              )}
              <ModalOpenPlaceholder
                revealed={s.contentRevealed}
                onClose={s.isDemoMode ? s.handleClose : undefined}
              >
                {props.children}
              </ModalOpenPlaceholder>
            </m.div>
          </div>
        </>
      )}
    </div>
  )
}

export const ModalOpenFlyIn = memo(ModalOpenFlyInComponent)
