import type { PropConfig } from '@/types/animation'

/**
 *
 */
export function isDisabledByCondition(
  config: PropConfig,
  allValues?: Record<string, unknown>
): boolean {
  return (
    config.disabledWhen != null &&
    allValues != null &&
    allValues[config.disabledWhen.prop] === config.disabledWhen.eq
  )
}

/**
 *
 */
export function coerceNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' ? value : fallback
}

/**
 *
 */
export function coerceString(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback
}

/**
 *
 */
export function coerceBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback
}

/**
 *
 */
export function coerceStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback
  return value.every((item) => typeof item === 'string') ? (value as string[]) : fallback
}

/**
 *
 */
export function coerceSelectValue(value: unknown, config: PropConfig & { type: 'select' }): string {
  if (typeof value === 'string') return value
  return config.default ?? config.options[0]?.value ?? ''
}
