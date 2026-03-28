/**
 * Modal unrolls like a scroll at viewport center — CSS variant.
 * Uses Web Animations API for height reveal. No position movement.
 */

import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { ModalOpenPlaceholder } from '@/components/dialogs/modal-open/MockOpenModalContent'
import { SharedDemoTriggers } from '@/components/dialogs/modal-open/SharedDemoTriggers'
import {
  useModalOpenLogic,
  type DemoPreset,
} from '@/components/dialogs/modal-open/SharedModalOpenLogic'
import '@/components/dialogs/modal-open/shared.css'
import {
  shouldReduceMotion,
  type ModalOpenProps,
} from '@/components/dialogs/modal-open/SharedTypes'

const PRESETS: DemoPreset[] = [
  { label: 'Soy', force: 0.02, duration: 1200, reveal: 30 },
  { label: 'Soft', force: 0.1, duration: 900, reveal: 40 },
  { label: 'Harder', force: 0.6, duration: 550, reveal: 55 },
  { label: 'Daddy', force: 1.0, duration: 380, reveal: 68 },
]

const SAMPLES = 24

function computeKeyframes(
  modalHeight: number,
  force: number
): { keyframes: Keyframe[]; reverseKeyframes: Keyframe[] } {
  const f = Math.max(0, Math.min(1, force))
  const keyframes: Keyframe[] = []
  const unrollEnd = 0.78

  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES
    const tl = t * unrollEnd
    const unrollT =
      t < 0.25 ? ((t * t) / 0.25) * 0.25 : 0.25 + (1 - Math.pow(1 - (t - 0.25) / 0.75, 1.8)) * 0.75

    keyframes.push({
      offset: tl,
      height: `${modalHeight * Math.min(1, unrollT)}px`,
      opacity: t < 0.04 ? t / 0.04 : 1,
    })
  }

  const overshoot = 1.02 + f * 0.08
  const bounce = 1 - (0.01 + f * 0.04)
  const micro = 1 + (overshoot - 1) * 0.15

  keyframes.push({ offset: unrollEnd + 0.05, height: `${modalHeight * overshoot}px`, opacity: 1 })
  keyframes.push({ offset: unrollEnd + 0.11, height: `${modalHeight * bounce}px`, opacity: 1 })
  keyframes.push({ offset: unrollEnd + 0.16, height: `${modalHeight * micro}px`, opacity: 1 })
  keyframes.push({ offset: 1, height: `${modalHeight}px`, opacity: 1 })

  const reverseKeyframes = [...keyframes].reverse().map((kf, i, arr) => ({
    ...kf,
    offset: i / (arr.length - 1),
  }))

  return { keyframes, reverseKeyframes }
}

function ModalOpenWantedPosterComponent(props: ModalOpenProps) {
  const s = useModalOpenLogic(props, PRESETS)
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [modalHeight, setModalHeight] = useState(0)

  const { isVisible, isClosing, activeDurationMs, handleCloseComplete, handleOpenComplete } = s

  useLayoutEffect(() => {
    if (!contentRef.current || !isVisible) return
    setModalHeight(contentRef.current.scrollHeight)
  }, [isVisible])

  const kfData = useMemo(() => {
    if (modalHeight === 0) return null
    return computeKeyframes(modalHeight, s.force)
  }, [modalHeight, s.force])

  useEffect(() => {
    const el = modalRef.current
    if (!el || !kfData || !isVisible) return

    if (shouldReduceMotion(el)) {
      const id = requestAnimationFrame(() =>
        isClosing ? handleCloseComplete() : handleOpenComplete()
      )
      return () => cancelAnimationFrame(id)
    }

    const frames = isClosing ? kfData.reverseKeyframes : kfData.keyframes
    const anim = el.animate(frames, {
      duration: activeDurationMs,
      fill: 'forwards',
      easing: 'linear',
    })
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
  }, [kfData, activeDurationMs, isVisible, isClosing, handleCloseComplete, handleOpenComplete])

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
          <div
            ref={modalRef}
            className={`pf-mo-modal pf-mo-modal--unroll${props.className ? ` ${props.className}` : ''}`}
            style={{ ...props.style, width: 420, maxWidth: '100%', overflow: 'hidden' }}
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
          </div>
        </div>
      )}
    </div>
  )
}

export const ModalOpenWantedPoster = memo(ModalOpenWantedPosterComponent)
