import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  loadPersistedOverrides,
  persistOverrides,
  PERSIST_DEBOUNCE_MS,
} from '@/contexts/inspectorPersistence'
import { logger } from '@/services/logger'

describe('inspectorPersistence', () => {
  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  describe('PERSIST_DEBOUNCE_MS', () => {
    it('is a positive number', () => {
      expect(PERSIST_DEBOUNCE_MS).toBe(300)
    })
  })

  describe('loadPersistedOverrides', () => {
    it('returns empty object when localStorage is empty', () => {
      expect(loadPersistedOverrides()).toEqual({})
    })

    it('returns parsed overrides from valid stored data', () => {
      const data = { 'anim-1': { duration: 500 }, 'anim-2': { color: 'red' } }
      localStorage.setItem('animation-catalog-inspector', JSON.stringify(data))

      expect(loadPersistedOverrides()).toEqual(data)
    })

    it('returns empty object for corrupted JSON', () => {
      const warn = vi.spyOn(logger, 'warn').mockImplementation(() => undefined)
      localStorage.setItem('animation-catalog-inspector', '{{invalid json')

      expect(loadPersistedOverrides()).toEqual({})
      expect(warn).toHaveBeenCalledWith(
        '[inspectorPersistence] Failed to load persisted inspector overrides',
        expect.any(SyntaxError)
      )
    })

    it('returns empty object for invalid schema (array instead of object)', () => {
      localStorage.setItem('animation-catalog-inspector', '[1,2,3]')
      expect(loadPersistedOverrides()).toEqual({})
    })

    it('returns empty object for invalid nested schema', () => {
      localStorage.setItem(
        'animation-catalog-inspector',
        JSON.stringify({ 'anim-1': 'not-an-object' })
      )
      expect(loadPersistedOverrides()).toEqual({})
    })
  })

  describe('persistOverrides', () => {
    it('stores overrides as JSON', () => {
      const data = { 'anim-1': { x: 1 } }
      persistOverrides(data)

      const stored = localStorage.getItem('animation-catalog-inspector')
      expect(JSON.parse(stored!)).toEqual(data)
    })

    it('removes key when overrides are empty', () => {
      localStorage.setItem('animation-catalog-inspector', '{"old": {}}')
      persistOverrides({})

      expect(localStorage.getItem('animation-catalog-inspector')).toBeNull()
    })

    it('warns and preserves runtime flow when quota is exceeded', () => {
      const warn = vi.spyOn(logger, 'warn').mockImplementation(() => undefined)
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new DOMException('quota exceeded', 'QuotaExceededError')
      })

      expect(() => persistOverrides({ 'anim-1': { x: 1 } })).not.toThrow()
      expect(warn).toHaveBeenCalledWith(
        '[inspectorPersistence] Failed to persist inspector overrides',
        expect.any(DOMException)
      )
    })
  })
})
