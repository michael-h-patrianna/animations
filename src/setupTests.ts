import '@testing-library/jest-dom/vitest'
import { act } from '@testing-library/react'
import { vi } from 'vitest'

type GlobalWithJest = typeof globalThis & {
  jest: typeof vi
  fail: (message?: string) => never
}

const globalWithJest = globalThis as GlobalWithJest

// @ts-expect-error - Vitest types don't match Jest types exactly, but they're compatible
globalWithJest.jest = vi
// Provide fail helper for compatibility with legacy Jest assertions
globalWithJest.fail = (message?: string): never => {
  throw new Error(message || 'Test failed')
}

globalWithJest.TextEncoder = globalThis.TextEncoder
globalWithJest.TextDecoder = globalThis.TextDecoder

globalThis.IntersectionObserver = class IntersectionObserver {
  callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
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
      currentTime: null,
      playState: 'finished' as AnimationPlayState,
      finished: Promise.resolve() as unknown as Promise<Animation>,
    }
    return anim as Animation
  }
}

if (!Element.prototype.getAnimations) {
  Element.prototype.getAnimations = function (): Animation[] {
    return []
  }
}

const w = window as unknown as {
  scrollTo?: ((options?: ScrollToOptions) => void) | ((x: number, y: number) => void)
}
w.scrollTo = () => {}

globalThis.ResizeObserver = class ResizeObserver {
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
