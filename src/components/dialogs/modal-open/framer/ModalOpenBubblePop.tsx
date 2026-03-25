/**
 * Modal inflates like a bubble from trigger with asymmetric wobble and jello settle.
 *
 * Copy-paste files: this file + ../SharedTypes.ts + ../shared.css
 * Runtime deps: react, motion
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
  computeBubblePopCloseTrajectory,
  computeBubblePopTrajectory,
} from '@/components/dialogs/modal-open/BubblePopTrajectory'
import {
  type ExtendedTrajectoryArrays,
  type ModalOpenProps,
} from '@/components/dialogs/modal-open/SharedTypes'

const PRESETS: DemoPreset[] = [
  { label: 'Gentle', force: 0.02, duration: 1200, reveal: 35 },
  { label: 'Soft', force: 0.1, duration: 900, reveal: 45 },
  { label: 'Harder', force: 0.6, duration: 550, reveal: 60 },
  { label: 'Strong', force: 1.0, duration: 380, reveal: 70 },
]

function ModalOpenBubblePopComponent(props: ModalOpenProps) {
  const s = useModalOpenLogic(props, PRESETS)
  const reduced = useReducedMotion() === true

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

  const traj: ExtendedTrajectoryArrays | null = s.isClosing ? closeTraj : openTraj

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
          <m.div
            className="pf-mo-overlay"
            initial={{ opacity: s.isClosing ? s.overlayOpacity : 0 }}
            animate={{ opacity: s.isClosing ? 0 : s.overlayOpacity }}
            transition={{
              duration: reduced ? 0.01 : s.activeDurationS * 0.5,
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
                      scaleX: traj.scaleX[0],
                      scaleY: traj.scaleY[0],
                      skewX: traj.skewX[0],
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
                      scaleX: traj.scaleX,
                      scaleY: traj.scaleY,
                      skewX: traj.skewX,
                      opacity: traj.opacity,
                    }
              }
              transition={
                reduced
                  ? { duration: 0.01 }
                  : { duration: s.activeDurationS, times: traj.times, ease: 'linear' }
              }
              onAnimationComplete={s.isClosing ? s.handleCloseComplete : s.handleOpenComplete}
            >
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

export const ModalOpenBubblePop = memo(ModalOpenBubblePopComponent)
