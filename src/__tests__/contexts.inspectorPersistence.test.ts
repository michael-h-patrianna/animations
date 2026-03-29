import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  loadPersistedOverrides,
  persistOverrides,
  PERSIST_DEBOUNCE_MS,
} from '@/contexts/inspectorPersistence'

describe('inspectorPersistence', () => {
  afterEach(() => {
    localStorage.clear()
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
      localStorage.setItem('animation-catalog-inspector', '{{invalid json')
      expect(loadPersistedOverrides()).toEqual({})
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

    it('silently handles quota exceeded', () => {
      const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('quota exceeded', 'QuotaExceededError')
      })

      // Should not throw
      persistOverrides({ 'anim-1': { x: 1 } })

      setItem.mockRestore()
    })
  })
})
