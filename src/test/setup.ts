import '@testing-library/jest-dom'
import { act } from '@testing-library/react'

// Mock IntersectionObserver
globalThis.IntersectionObserver = class IntersectionObserver {
  callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    // Immediately call the callback to simulate intersection
    setTimeout(() => {
      const entry = { isIntersecting: true } as unknown as IntersectionObserverEntry
      act(() => {
        callback([entry], this)
      })
    }, 0)
  }

  observe() {
    return null
  }
  unobserve() {
    return null
  }
  disconnect() {
    return null
  }
  takeRecords() {
    return []
  }
  root = null
  rootMargin = ''
  thresholds = []
}

// Minimal Web Animations API polyfill for jsdom tests
// Do NOT augment DOM lib types here; just polyfill runtime methods if missing.
if (!Element.prototype.animate) {
  Element.prototype.animate = function (): Animation {
    const anim: Partial<Animation> = {
      cancel() {},
      finish() {},
      play() {},
      pause() {},
      reverse() {},
      addEventListener() {},
      removeEventListener() {},
      onfinish: null,
  // currentTime is number | null, use null to indicate unknown time
  currentTime: null,
      playState: 'finished' as AnimationPlayState,
      // finished should be a Promise<Animation> per spec; a resolved promise is fine for tests
      finished: Promise.resolve() as unknown as Promise<Animation>,
    }
    return anim as Animation
  }
}

// Minimal getAnimations stub used by some components to cancel animations on unmount
if (!Element.prototype.getAnimations) {
  Element.prototype.getAnimations = function (): Animation[] {
    return []
  }
}

// jsdom does not implement scrollTo; silence not implemented error paths in tests
// Override jsdom's not-implemented scrollTo with a no-op to reduce console noise during tests
const w = window as unknown as {
  scrollTo?: ((options?: ScrollToOptions) => void) | ((x: number, y: number) => void)
}
w.scrollTo = () => {}

// Mock ResizeObserver
globalThis.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null
  }
  unobserve() {
    return null
  }
  disconnect() {
    return null
  }
}
