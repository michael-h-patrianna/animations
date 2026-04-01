/**
 * Modal unrolls like a scroll at viewport center — pure height reveal,
 * no position movement. Content is never distorted. Paper curl shadow at
 * the leading edge. On close, rolls back up then snaps to trigger.
 *
 * Copy-paste files: this file + ../SharedTypes.ts + ../shared.css
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { ModalOpenPlaceholder } from '@/components/dialogs/modal-open/SharedOpenModalPlaceholder'
import { SharedDemoTriggers } from '@/components/dialogs/modal-open/SharedDemoTriggers'
import {
  useModalOpenLogic,
  type DemoPreset,
} from '@/components/dialogs/modal-open/SharedModalOpenLogic'
import '@/components/dialogs/modal-open/shared.css'
import { type ModalOpenProps } from '@/components/dialogs/modal-open/SharedTypes'

const PRESETS: DemoPreset[] = [
  { label: 'Soy', force: 0.02, duration: 1200, reveal: 30 },
  { label: 'Soft', force: 0.1, duration: 900, reveal: 40 },
  { label: 'Harder', force: 0.6, duration: 550, reveal: 55 },
  { label: 'Daddy', force: 1.0, duration: 380, reveal: 68 },
]

const SAMPLES = 24

interface UnrollData {
  h: number[]
  opacity: number[]
  times: number[]
}

function computeUnroll(modalHeight: number, force: number): UnrollData {
  const f = Math.max(0, Math.min(1, force))

  const h: number[] = [],
    opacity: number[] = [],
    times: number[] = []
  const unrollEnd = 0.78

  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES
    const tl = t * unrollEnd

    // Gravity-inspired: ease-in (inertia) → accelerating → ease-out at end
    const unrollT =
      t < 0.25 ? ((t * t) / 0.25) * 0.25 : 0.25 + (1 - Math.pow(1 - (t - 0.25) / 0.75, 1.8)) * 0.75

    h.push(modalHeight * Math.min(1, unrollT))
    times.push(tl)
    opacity.push(t < 0.04 ? t / 0.04 : 1)
  }

  // Paper-snap settle
  const overshoot = 1.02 + f * 0.08
  const bounce = 1 - (0.01 + f * 0.04)
  const micro = 1 + (overshoot - 1) * 0.15

  h.push(modalHeight * overshoot)
  opacity.push(1)
  times.push(unrollEnd + 0.05)
  h.push(modalHeight * bounce)
  opacity.push(1)
  times.push(unrollEnd + 0.11)
  h.push(modalHeight * micro)
  opacity.push(1)
  times.push(unrollEnd + 0.16)
  h.push(modalHeight)
  opacity.push(1)
  times.push(1)

  return { h, opacity, times }
}

function reverseUnroll(data: UnrollData): UnrollData {
  const n = data.times.length
  const maxT = data.times[n - 1]!
  return {
    h: [...data.h].reverse(),
    opacity: [...data.opacity].reverse(),
    times: [...data.times].reverse().map((v) => (maxT - v) / maxT),
  }
}

function ModalOpenWantedPosterComponent(props: ModalOpenProps) {
  const s = useModalOpenLogic(props, PRESETS)
  const reduced = useReducedMotion() === true
  const contentRef = useRef<HTMLDivElement>(null)
  const [modalHeight, setModalHeight] = useState(0)

  useLayoutEffect(() => {
    if (!contentRef.current || !s.isVisible) return
    setModalHeight(contentRef.current.scrollHeight)
  }, [s.isVisible])

  const openData = useMemo(() => {
    if (modalHeight === 0) return null
    return computeUnroll(modalHeight, s.force)
  }, [modalHeight, s.force])

  const closeData = useMemo(() => (openData ? reverseUnroll(openData) : null), [openData])
  const data = s.isClosing ? closeData : openData

  return (
    <div
      ref={s.containerRef}
      className="pf-mo-container"
      data-animation-id="modal-open__wanted-poster"
    >
      {s.isDemoMode && s.phase === 'idle' && (
        <SharedDemoTriggers
          presets={PRESETS}
          buttonListRef={s.buttonListRef}
          onClickButton={s.handleDemoClick}
        />
      )}

      {s.isVisible && (
        <div className="pf-mo-stage">
          <m.div
            key={s.isClosing ? 'close' : 'open'}
            className={`pf-mo-modal pf-mo-modal--unroll${props.className ? ` ${props.className}` : ''}`}
            style={{
              ...props.style,
              width: 420,
              maxWidth: '100%',
              overflow: 'hidden',
            }}
            initial={
              reduced
                ? { height: s.isClosing ? 'auto' : 0, opacity: s.isClosing ? 1 : 0 }
                : data
                  ? { height: data.h[0], opacity: data.opacity[0] }
                  : { height: 0, opacity: 0 }
            }
            animate={
              reduced
                ? { height: s.isClosing ? 0 : 'auto', opacity: s.isClosing ? 0 : 1 }
                : data
                  ? { height: data.h, opacity: data.opacity }
                  : { height: modalHeight, opacity: 1 }
            }
            transition={
              reduced
                ? { duration: 0.01 }
                : data
                  ? { duration: s.activeDurationS, times: data.times, ease: 'linear' }
                  : { duration: s.activeDurationS }
            }
            onAnimationComplete={s.isClosing ? s.handleCloseComplete : s.handleOpenComplete}
          >
            <div ref={contentRef} style={{ position: 'relative' }}>
              <ModalOpenPlaceholder
                revealed={s.contentRevealed}
                onClose={s.isDemoMode ? s.handleClose : undefined}
              >
                {props.children}
              </ModalOpenPlaceholder>
            </div>
            <div className="pf-mo-paper-curl" />
          </m.div>
        </div>
      )}
    </div>
  )
}

export const ModalOpenWantedPoster = memo(ModalOpenWantedPosterComponent)
