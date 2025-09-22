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
type MockAnimation = {
  cancel: () => void
  finish: () => void
  play: () => void
  pause: () => void
  reverse: () => void
  addEventListener: () => void
  removeEventListener: () => void
  onfinish: null | (() => void)
  currentTime: number
  playState: 'idle' | 'running' | 'paused' | 'finished'
  finished: Promise<void>
}

declare global {
  interface Element {
    animate?: (...args: unknown[]) => MockAnimation
  }
}

if (!Element.prototype.animate) {
  Element.prototype.animate = function (): MockAnimation {
    return {
      cancel() {},
      finish() {},
      play() {},
      pause() {},
      reverse() {},
      addEventListener() {},
      removeEventListener() {},
      onfinish: null,
      currentTime: 0,
      playState: 'finished',
      finished: Promise.resolve(),
    }
  }
}

// Minimal getAnimations stub used by some components to cancel animations on unmount
declare global {
  interface Element {
    getAnimations?: () => Array<{ cancel: () => void }>
  }
}

if (!Element.prototype.getAnimations) {
  Element.prototype.getAnimations = function () {
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
