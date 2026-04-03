/**
 * Modal punches in from trigger with exaggerated squash-stretch impact.
 *
 * Copy-paste files: this file + ../SharedTypes.ts + ../shared.css
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useMemo } from 'react'

import { ModalOpenPlaceholder } from '@/components/dialogs/modal-open/SharedOpenModalPlaceholder'
import { SharedDemoTriggers } from '@/components/dialogs/modal-open/SharedDemoTriggers'
import { useModalOpenLogic } from '@/components/dialogs/modal-open/SharedModalOpenLogic'
import '@/components/dialogs/modal-open/shared.css'
import {
  computeComicPunchCloseTrajectory,
  computeComicPunchTrajectory,
} from '@/components/dialogs/modal-open/ComicPunchTrajectory'
import { COMIC_PUNCH_PRESETS } from '@/components/dialogs/modal-open/SharedPresets'
import {
  type ExtendedTrajectoryArrays,
  type ModalOpenProps,
} from '@/components/dialogs/modal-open/SharedTypes'

function ModalOpenComicPunchComponent(props: ModalOpenProps) {
  const s = useModalOpenLogic(props, COMIC_PUNCH_PRESETS)
  const reduced = useReducedMotion() === true

  const openTraj = useMemo(() => {
    if (!s.fromPoint || !s.center) return null
    return computeComicPunchTrajectory(s.fromPoint, s.center, s.force)
  }, [s.fromPoint, s.center, s.force])

  const closeTraj = useMemo(
    () =>
      s.fromPoint && s.center
        ? computeComicPunchCloseTrajectory(s.fromPoint, s.center, s.force)
        : null,
    [s.fromPoint, s.center, s.force]
  )

  const traj: ExtendedTrajectoryArrays | null = s.isClosing ? closeTraj : openTraj

  return (
    <div
      ref={s.containerRef}
      className="pf-mo-container"
      data-animation-id="modal-open__comic-punch"
    >
      {s.isDemoMode && s.phase === 'idle' && (
        <SharedDemoTriggers
          presets={COMIC_PUNCH_PRESETS}
          buttonListRef={s.buttonListRef}
          onClickButton={s.handleDemoClick}
        />
      )}

      {s.isVisible && traj !== null && (
        <div className="pf-mo-stage">
          <m.div
            key={s.isClosing ? 'close' : 'open'}
            className={`pf-mo-modal${props.className ? ` ${props.className}` : ''}`}
            style={{ ...props.style }}
            initial={
              reduced
                ? { scale: s.isClosing ? 1 : 0.85, opacity: s.isClosing ? 1 : 0 }
                : {
                    x: traj.x[0],
                    y: traj.y[0],
                    scale: traj.scale[0],
                    scaleX: traj.scaleX[0],
                    scaleY: traj.scaleY[0],
                    rotate: traj.rotate[0],
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
                    rotate: traj.rotate,
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
      )}
    </div>
  )
}

export const ModalOpenComicPunch = memo(ModalOpenComicPunchComponent)
