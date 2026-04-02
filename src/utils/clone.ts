/**
 * Shallow-clone utilities for unknown values.
 *
 * Used by the animation inspector to clone prop defaults and starter
 * overrides so each animation card receives its own mutable copy.
 */

/** Type guard for plain objects (not arrays or class instances). */
export function isRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  const proto = Object.getPrototypeOf(value) as unknown
  return proto === Object.prototype || proto === null
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
