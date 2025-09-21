import '@testing-library/jest-dom';

// Mock IntersectionObserver
globalThis.IntersectionObserver = class IntersectionObserver {
  callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    // Immediately call the callback to simulate intersection
    setTimeout(() => {
      callback([{ isIntersecting: true } as any], this);
    }, 0);
  }

  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
  takeRecords() {
    return [];
  }
  root = null;
  rootMargin = '';
  thresholds = [];
};

// Mock ResizeObserver
globalThis.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
};
