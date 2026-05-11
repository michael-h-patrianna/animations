/**
 * localStorage persistence for animation inspector prop overrides.
 *
 * Handles serialization, validation, and debounced writes.
 * Corrupted data is discarded with a dev-visible warning and overwritten on next persist.
 */

import * as v from 'valibot'
import { logger } from '@/services/logger'

type PropOverridesByAnimationId = Record<string, Record<string, unknown>>

const OVERRIDES_STORAGE_KEY = 'animation-catalog-inspector'

/**
 * Schema for persisted inspector overrides.
 * Validates nested Record<string, Record<string, unknown>> structure
 * so corrupted localStorage data is rejected rather than trusted.
 */
const PersistedOverridesSchema = v.record(v.string(), v.record(v.string(), v.unknown()))

/** Loads persisted overrides from localStorage, returning empty on any failure. */
export function loadPersistedOverrides(): PropOverridesByAnimationId {
  try {
    const raw = localStorage.getItem(OVERRIDES_STORAGE_KEY)
    if (raw == null) return {}
    const parsed: unknown = JSON.parse(raw)
    return v.parse(PersistedOverridesSchema, parsed)
  } catch (err) {
    // JSON parse error, Valibot validation failure, or localStorage unavailable.
    // Remove the bad entry so subsequent mounts don't hit the same failure.
    try {
      localStorage.removeItem(OVERRIDES_STORAGE_KEY)
    } catch {
      // localStorage may be unavailable — ignore cleanup failure.
    }
    logger.warn('[inspectorPersistence] Failed to load persisted inspector overrides', err)
    return {}
  }
}

/** Writes overrides to localStorage. Removes the key when overrides are empty. */
export function persistOverrides(overrides: PropOverridesByAnimationId): void {
  try {
    const toStore = Object.keys(overrides).length > 0 ? JSON.stringify(overrides) : null
    if (toStore != null) {
      localStorage.setItem(OVERRIDES_STORAGE_KEY, toStore)
    } else {
      localStorage.removeItem(OVERRIDES_STORAGE_KEY)
    }
  } catch (err) {
    // Quota exceeded or unavailable — degrade without throwing.
    logger.warn('[inspectorPersistence] Failed to persist inspector overrides', err)
  }
}

/** Debounce interval for persisting overrides after state changes. */
export const PERSIST_DEBOUNCE_MS = 300
