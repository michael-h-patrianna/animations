import '@testing-library/jest-dom/vitest'
import { act } from '@testing-library/react'

/**
 * IntersectionObserver mock with controllable triggering.
 *
 * By default, auto-triggers with isIntersecting: true via setTimeout(0)
 * for backward compatibility with existing tests.
 *
 * Tests that need to control intersection timing can call:
 *   MockIntersectionObserver.disableAutoTrigger()  — in beforeEach
 *   MockIntersectionObserver.triggerAll(true)       — to simulate viewport entry
 *   MockIntersectionObserver.enableAutoTrigger()    — in afterEach (restores default)
 */
class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = []
  private static autoTrigger = true

  callback: IntersectionObserverCallback
  root = null
  rootMargin = ''
  thresholds: readonly number[] = []

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    MockIntersectionObserver.instances.push(this)

    if (MockIntersectionObserver.autoTrigger) {
      setTimeout(() => {
        const entry = { isIntersecting: true } as unknown as IntersectionObserverEntry
        act(() => {
          callback([entry], this)
        })
      }, 0)
    }
  }

  observe() {
    return undefined
  }
  unobserve() {
    return undefined
  }
  disconnect() {
    return undefined
  }
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }

  /** Disable auto-triggering for tests that need manual control. */
  static disableAutoTrigger() {
    MockIntersectionObserver.autoTrigger = false
  }

  /** Re-enable auto-triggering (call in afterEach to restore default). */
  static enableAutoTrigger() {
    MockIntersectionObserver.autoTrigger = true
  }

  /** Trigger all existing observer instances with the given intersection state. */
  static triggerAll(isIntersecting: boolean) {
    const entry = { isIntersecting } as unknown as IntersectionObserverEntry
    for (const instance of MockIntersectionObserver.instances) {
      act(() => {
        instance.callback([entry], instance)
      })
    }
  }

  /** Reset all tracked instances (call in afterEach if using manual control). */
  static resetInstances() {
    MockIntersectionObserver.instances = []
  }
}

globalThis.IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver

if (typeof Element.prototype.animate !== 'function') {
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

if (typeof Element.prototype.getAnimations !== 'function') {
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
