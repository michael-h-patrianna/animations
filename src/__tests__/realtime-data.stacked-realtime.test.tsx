import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { RealtimeDataStackedRealtime } from '@/components/realtime/realtime-data/css/RealtimeDataStackedRealtime'
import type { StatEntry } from '@/components/realtime/realtime-data/SharedTypes'

interface MockAnimation {
  keyframes: Keyframe[] | PropertyIndexedKeyframes | null
  options: KeyframeAnimationOptions | number | undefined
}

let animations: MockAnimation[] = []
let originalAnimate: typeof Element.prototype.animate

beforeEach(() => {
  animations = []
  originalAnimate = Element.prototype.animate
  Element.prototype.animate = function (
    keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
    options?: KeyframeAnimationOptions | number
  ): Animation {
    animations.push({ keyframes, options })
    return {
      cancel() {},
      finish() {},
      play() {},
      pause() {},
      reverse() {},
      addEventListener() {},
      removeEventListener() {},
      onfinish: null,
      currentTime: null,
      playState: 'finished' as AnimationPlayState,
      finished: Promise.resolve() as unknown as Promise<Animation>,
    } as unknown as Animation
  }
})

afterEach(() => {
  Element.prototype.animate = originalAnimate
  animations = []
})

const initialItems: StatEntry[] = [
  { label: 'Active Players', value: '1,247', active: true },
  { label: 'Total Wins', value: '856', active: false },
]

const isRowEntrance = (anim: MockAnimation): boolean => {
  if (!Array.isArray(anim.keyframes)) return false
  const first = anim.keyframes[0]
  const last = anim.keyframes[anim.keyframes.length - 1]
  if (first === undefined || last === undefined) return false
  return (
    first.opacity === 0 &&
    last.opacity === 1 &&
    typeof first.transform === 'string' &&
    String(first.transform).startsWith('translateX(') &&
    last.transform === 'translateX(0)'
  )
}

describe('RealtimeDataStackedRealtime CSS — items change while visible=true', () => {
  it('runs an entrance animation for a row added to items after initial mount', () => {
    const { rerender } = render(<RealtimeDataStackedRealtime items={initialItems} visible={true} />)

    // Initial mount fires entrance animations for both rows.
    expect(animations.filter(isRowEntrance).length).toBe(initialItems.length)

    const previousEntranceCount = animations.filter(isRowEntrance).length

    // Add a new row by label — visibility unchanged.
    const expanded: StatEntry[] = [
      ...initialItems,
      { label: 'Live Games', value: '23', active: true },
    ]
    rerender(<RealtimeDataStackedRealtime items={expanded} visible={true} />)

    const totalAfterAdd = animations.filter(isRowEntrance).length
    const newEntrances = totalAfterAdd - previousEntranceCount

    // Exactly ONE new entrance animation must fire — for the new row only.
    // Without the fix, no animation runs and the row stays at inline opacity:0.
    // Re-animating existing rows would cause flicker, so the count must be 1.
    expect(newEntrances).toBe(1)
  })

  it('does not re-animate when only item values change (same labels)', () => {
    const { rerender } = render(<RealtimeDataStackedRealtime items={initialItems} visible={true} />)
    const previousEntranceCount = animations.filter(isRowEntrance).length

    const updated: StatEntry[] = [
      { label: 'Active Players', value: '9,999', active: true },
      { label: 'Total Wins', value: '1,000', active: false },
    ]
    rerender(<RealtimeDataStackedRealtime items={updated} visible={true} />)

    // Same labels → no extra entrance animations.
    expect(animations.filter(isRowEntrance).length).toBe(previousEntranceCount)
  })

  it('runs an entrance animation for every row when visible toggles back to true', () => {
    const { rerender } = render(<RealtimeDataStackedRealtime items={initialItems} visible={true} />)

    rerender(<RealtimeDataStackedRealtime items={initialItems} visible={false} />)
    const beforeReentry = animations.filter(isRowEntrance).length

    rerender(<RealtimeDataStackedRealtime items={initialItems} visible={true} />)

    const afterReentry = animations.filter(isRowEntrance).length
    expect(afterReentry - beforeReentry).toBe(initialItems.length)
  })
})
