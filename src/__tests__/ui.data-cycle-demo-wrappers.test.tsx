import { render, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  ListRotateDemo,
  ScorePulseDemo,
  VisibilityCycleDemo,
} from '@/components/ui/DataCycleDemoWrappers'
import type { RankedEntry } from '@/components/realtime/realtime-data/SharedTypes'

// Capture props passed to the wrapped component
function createPropCapture() {
  const calls: Record<string, unknown>[] = []
  function Capture(props: Record<string, unknown>) {
    calls.push({ ...props })
    return <div data-testid="capture" />
  }
  return { Capture, calls }
}

describe('ListRotateDemo', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the wrapped component with default leaderboard items', () => {
    const { Capture, calls } = createPropCapture()
    render(<ListRotateDemo Component={Capture} controlProps={{}} />)

    const items = calls[0]!.items as RankedEntry[]
    expect(items).toHaveLength(4)
    expect(items[0]!.id).toBe('phoenix')
    expect(items[3]!.id).toBe('apex')
  })

  it('rotates items after pause delay', () => {
    const { Capture, calls } = createPropCapture()
    render(<ListRotateDemo Component={Capture} controlProps={{}} />)

    const initialFirst = (calls[0]!.items as RankedEntry[])[0]!.id

    // Advance past the first cycle (PAUSE_MS = 2000)
    act(() => {
      vi.advanceTimersByTime(2100)
    })

    // After rotation, the first item should have changed
    const latestCall = calls[calls.length - 1]!
    const rotatedFirst = (latestCall.items as RankedEntry[])[0]!.id
    expect(rotatedFirst).not.toBe(initialFirst)
  })

  it('cleans up timers on unmount', () => {
    const { Capture } = createPropCapture()
    const { unmount } = render(<ListRotateDemo Component={Capture} controlProps={{}} />)

    unmount()

    // Should not throw when advancing timers after unmount
    act(() => {
      vi.advanceTimersByTime(10000)
    })
  })
})

describe('ScorePulseDemo', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders with initial scores matching default data', () => {
    const { Capture, calls } = createPropCapture()
    render(<ScorePulseDemo Component={Capture} controlProps={{}} />)

    const items = calls[0]!.items as RankedEntry[]
    expect(items[0]!.score).toBe(1450)
    expect(items[1]!.score).toBe(1320)
  })

  it('increments scores after delay', () => {
    const { Capture, calls } = createPropCapture()
    render(<ScorePulseDemo Component={Capture} controlProps={{}} />)

    const initialScore = (calls[0]!.items as RankedEntry[])[0]!.score

    act(() => {
      vi.advanceTimersByTime(2100)
    })

    const latestItems = calls[calls.length - 1]!.items as RankedEntry[]
    expect(latestItems[0]!.score).toBe(initialScore + 120)
  })

  it('cleans up timers on unmount', () => {
    const { Capture } = createPropCapture()
    const { unmount } = render(<ScorePulseDemo Component={Capture} controlProps={{}} />)

    unmount()

    act(() => {
      vi.advanceTimersByTime(10000)
    })
  })
})

describe('VisibilityCycleDemo', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts with visible=true', () => {
    const { Capture, calls } = createPropCapture()
    render(<VisibilityCycleDemo Component={Capture} controlProps={{}} />)

    expect(calls[0]!.visible).toBe(true)
  })

  it('toggles visible to false after 1500ms', () => {
    const { Capture, calls } = createPropCapture()
    render(<VisibilityCycleDemo Component={Capture} controlProps={{}} />)

    act(() => {
      vi.advanceTimersByTime(1600)
    })

    const latestCall = calls[calls.length - 1]!
    expect(latestCall.visible).toBe(false)
  })

  it('cycles back to visible=true after full cycle', () => {
    const { Capture, calls } = createPropCapture()
    render(<VisibilityCycleDemo Component={Capture} controlProps={{}} />)

    // First visible → false at 1500ms, then true again after PAUSE_MS (2000ms)
    act(() => {
      vi.advanceTimersByTime(3600)
    })

    const latestCall = calls[calls.length - 1]!
    expect(latestCall.visible).toBe(true)
  })

  it('cleans up timers on unmount', () => {
    const { Capture } = createPropCapture()
    const { unmount } = render(<VisibilityCycleDemo Component={Capture} controlProps={{}} />)

    unmount()

    act(() => {
      vi.advanceTimersByTime(10000)
    })
  })
})
