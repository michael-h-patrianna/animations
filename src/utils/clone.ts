/**
 * Shallow-clone utilities for unknown values.
 *
 * Used by the animation inspector to clone prop defaults and starter
 * overrides so each animation card receives its own mutable copy.
 */

/** Type guard for plain objects (not arrays). */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Shallow-clones arrays and plain objects; returns primitives as-is.
 *
 * @param value - Any value to clone
 * @returns A shallow copy if value is an array or plain object, otherwise the original value
 */
export function shallowClone(value: unknown): unknown {
  if (Array.isArray(value)) {
    return [...value]
  }

  if (isRecord(value)) {
    return { ...value }
  }

  return value
}
