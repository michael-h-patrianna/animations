import '@testing-library/jest-dom/vitest'
import { act } from '@testing-library/react'

/**
 * Node.js v22+ ships a built-in `globalThis.localStorage` that requires
 * `--localstorage-file` to function. Without it, `.setItem` / `.getItem`
 * are undefined. Happy-dom provides its own implementation on `window`,
 * but zustand's persist middleware captures `window.localStorage` at module
 * init time — if it runs before happy-dom's setup, it gets Node's broken
 * version. This polyfill ensures a working in-memory Storage is always
 * available, regardless of environment initialization order.
 */
if (typeof globalThis.localStorage?.setItem !== 'function') {
  const store = new Map<string, string>()
  const memoryStorage: Storage = {
    get length() {
      return store.size
    },
    clear() {
      store.clear()
    },
    getItem(key: string) {
      return store.get(key) ?? null
    },
    key(index: number) {
      return [...store.keys()][index] ?? null
    },
    removeItem(key: string) {
      store.delete(key)
    },
    setItem(key: string, value: string) {
      store.set(key, value)
    },
  }
  Object.defineProperty(globalThis, 'localStorage', {
    value: memoryStorage,
    writable: true,
    configurable: true,
  })
}

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

globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver

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
