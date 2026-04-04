/**
 * Prop default value computation for the animation inspector.
 *
 * Builds the initial override record from editable prop metadata,
 * merging config defaults with per-animation starter defaults.
 */

import type { PropConfig, StyleObjectFieldConfig } from '@/types/animation'
import { getInspectorStarterDefaults } from '@/contexts/inspectorStarterDefaults'
import { assertNever } from '@/utils/assertNever'
import { isRecord, shallowClone } from '@/utils/clone'

/** Computes the default serialized value for a style-object field. */
function buildStyleFieldDefault(field: StyleObjectFieldConfig): string {
  switch (field.type) {
    case 'color':
      return field.default ?? ''
    case 'number':
      return field.default != null ? `${field.default}${field.unit ?? ''}` : ''
    case 'string':
      return field.default ?? ''
    default:
      return assertNever(field)
  }
}

// Re-export clone utilities for backward compatibility with existing consumers.
export { isRecord, shallowClone as cloneDefaultValue } from '@/utils/clone'

/** Resolves the default value for a single prop config entry. */
function resolveConfigDefault(prop: PropConfig): unknown | undefined {
  if (prop.disabled) return undefined
  if (prop.type === 'style-object') {
    const styleDefaults = Object.fromEntries(
      prop.fields
        .map((field) => [field.key, buildStyleFieldDefault(field)] as const)
        .filter(([, value]) => value !== '')
    )
    return Object.keys(styleDefaults).length > 0 ? styleDefaults : undefined
  }
  if (prop.type === 'color' && prop.default !== undefined) return prop.default
  if (prop.type === 'colors' && prop.default !== undefined) return [...prop.default]
  if (prop.default !== undefined) return shallowClone(prop.default)
  return undefined
}

/** Applies starter defaults (per-animation overrides) on top of config defaults. */
function applyStarterDefaults(
  defaults: Record<string, unknown>,
  propsConfig: PropConfig[],
  animationId?: string
): void {
  const starterDefaults = getInspectorStarterDefaults(animationId)
  for (const prop of propsConfig) {
    if (prop.disabled || !(prop.name in starterDefaults)) continue
    const starterValue = starterDefaults[prop.name]
    if (starterValue !== undefined) {
      defaults[prop.name] = shallowClone(starterValue)
    }
  }
}

/** Builds the inspector's default override record from editable prop metadata. */
export function buildPropDefaults(
  propsConfig?: PropConfig[],
  animationId?: string
): Record<string, unknown> {
  const defaults: Record<string, unknown> = {}
  const configs = propsConfig ?? []

  for (const prop of configs) {
    const resolved = resolveConfigDefault(prop)
    if (resolved !== undefined) defaults[prop.name] = resolved
  }

  applyStarterDefaults(defaults, configs, animationId)
  return defaults
}

/**
 * Normalizes color-equivalent CSS values for comparison.
 * 'none' and 'transparent' are visually identical for color/stroke props.
 */
function normalizeForComparison(value: unknown): unknown {
  return value === 'none' ? 'transparent' : value
}

/** Shallow-equality check that handles records, arrays, and primitives. */
function valuesEqual(a: unknown, b: unknown): boolean {
  if (isRecord(a) && isRecord(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)])
    for (const key of keys) {
      if (a[key] !== b[key]) return false
    }
    return true
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => v === b[i])
  }
  return a === b
}

/** Returns true when any interactive prop differs from its default value. */
export function hasDirtyPropOverrides(
  overrides: Record<string, unknown>,
  propsConfig?: PropConfig[],
  animationId?: string
): boolean {
  const defaults = buildPropDefaults(propsConfig, animationId)
  for (const key of Object.keys(overrides)) {
    const current = normalizeForComparison(overrides[key])
    const def = normalizeForComparison(defaults[key])
    if (!valuesEqual(current, def)) return true
  }
  return false
}
