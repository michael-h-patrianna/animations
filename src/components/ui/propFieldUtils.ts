/**
 * Utility functions for PropField form rendering.
 *
 * Handles CSS custom property value parsing, serialization,
 * and color normalization for the animation inspector.
 */

import type { StyleObjectFieldConfig } from '@/types/animation'
import { assertNever } from '@/utils/assertNever'
import { resolveColorInputDefault } from '@/utils/colors'

/** Type guard for plain objects (not arrays). */
export function isStyleValueRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Resolves a color default, falling back to the raw value if resolution fails. */
export function normalizeColorDefault(value?: string): string {
  if (value == null) return ''
  const resolved = resolveColorInputDefault(value)
  return resolved !== '' ? resolved : value
}

/** Resolves an array of color strings, normalizing each entry. */
export function resolveColorArray(colors: string[]): string[] {
  return colors.map((c) => {
    const n = normalizeColorDefault(c)
    return n !== '' ? n : c
  })
}

/** Parses a numeric value from a style field (handles "16px" → 16). */
export function parseStyleNumberValue(value: unknown): number | undefined {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value
  }

  if (typeof value === 'string') {
    const match = value.match(/[+-]?\d*\.?\d+/)
    if (match) {
      const parsed = Number(match[0])
      if (!Number.isNaN(parsed)) {
        return parsed
      }
    }
  }

  return undefined
}

/** Serializes a style field value back to CSS string form. */
export function serializeStyleFieldValue(field: StyleObjectFieldConfig, value: unknown): string {
  switch (field.type) {
    case 'number':
      return typeof value === 'number' ? `${value}${field.unit ?? ''}` : ''
    case 'color':
    case 'string':
      return typeof value === 'string' ? value : ''
    default:
      return assertNever(field)
  }
}

/** Builds the default CSS custom property record from style-object field definitions. */
export function buildStyleObjectDefaultRecord(
  fields: StyleObjectFieldConfig[]
): Record<string, unknown> {
  return Object.fromEntries(
    fields
      .map((field) => {
        switch (field.type) {
          case 'number':
            return [
              field.key,
              field.default != null ? `${field.default}${field.unit ?? ''}` : '',
            ] as const
          case 'color':
            return [field.key, normalizeColorDefault(field.default)] as const
          case 'string':
            return [field.key, field.default ?? ''] as const
          default:
            return assertNever(field)
        }
      })
      .filter(([, value]) => value !== '')
  )
}
