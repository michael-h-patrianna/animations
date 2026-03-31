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

/** Builds the inspector's default override record from editable prop metadata. */
export function buildPropDefaults(
  propsConfig?: PropConfig[],
  animationId?: string
): Record<string, unknown> {
  const defaults: Record<string, unknown> = {}
  const starterDefaults = getInspectorStarterDefaults(animationId)

  for (const prop of propsConfig ?? []) {
    if (prop.disabled) continue
    if (prop.type === 'style-object') {
      const styleDefaults = Object.fromEntries(
        prop.fields
          .map((field) => [field.key, buildStyleFieldDefault(field)] as const)
          .filter(([, value]) => value !== '')
      )
      if (Object.keys(styleDefaults).length > 0) {
        defaults[prop.name] = styleDefaults
      }
      continue
    }
    if (prop.type === 'color' && prop.default !== undefined) {
      defaults[prop.name] = prop.default
      continue
    }
    if (prop.type === 'colors' && prop.default !== undefined) {
      defaults[prop.name] = [...prop.default]
      continue
    }
    if (prop.default !== undefined) {
      defaults[prop.name] = shallowClone(prop.default)
    }
  }

  for (const prop of propsConfig ?? []) {
    if (prop.disabled || !(prop.name in starterDefaults)) continue

    const starterValue = starterDefaults[prop.name]
    if (starterValue !== undefined) {
      defaults[prop.name] = shallowClone(starterValue)
    }
  }

  return defaults
}

/**
 * Normalizes color-equivalent CSS values for comparison.
 * 'none' and 'transparent' are visually identical for color/stroke props.
 */
function normalizeForComparison(value: unknown): unknown {
  return value === 'none' ? 'transparent' : value
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

    if (isRecord(current) && isRecord(def)) {
      const nestedKeys = new Set([...Object.keys(current), ...Object.keys(def)])
      for (const nestedKey of nestedKeys) {
        if (current[nestedKey] !== def[nestedKey]) {
          return true
        }
      }
      continue
    }

    if (Array.isArray(current) && Array.isArray(def)) {
      if (current.length !== def.length || current.some((value, index) => value !== def[index])) {
        return true
      }
      continue
    }

    if (current !== def) {
      return true
    }
  }

  return false
}
