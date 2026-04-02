import { afterEach, describe, expect, it } from 'vitest'
import { useDropdownStore } from '@/demo-ui/stores/dropdownStore'

afterEach(() => {
  // Reset store state between tests
  useDropdownStore.setState({ openDropdownId: null })
})

describe('dropdownStore', () => {
  describe('openDropdown', () => {
    it('sets the open dropdown ID', () => {
      useDropdownStore.getState().openDropdown('menu-1')
      expect(useDropdownStore.getState().openDropdownId).toBe('menu-1')
    })

    it('replaces the previous open dropdown (only one at a time)', () => {
      useDropdownStore.getState().openDropdown('menu-1')
      useDropdownStore.getState().openDropdown('menu-2')
      expect(useDropdownStore.getState().openDropdownId).toBe('menu-2')
    })
  })

  describe('closeDropdown', () => {
    it('closes the dropdown when the matching ID is passed', () => {
      useDropdownStore.getState().openDropdown('menu-1')
      useDropdownStore.getState().closeDropdown('menu-1')
      expect(useDropdownStore.getState().openDropdownId).toBe(null)
    })

    it('does not close when a different ID is passed', () => {
      useDropdownStore.getState().openDropdown('menu-1')
      useDropdownStore.getState().closeDropdown('menu-2')
      expect(useDropdownStore.getState().openDropdownId).toBe('menu-1')
    })

    it('closes any dropdown when called without an ID', () => {
      useDropdownStore.getState().openDropdown('menu-1')
      useDropdownStore.getState().closeDropdown()
      expect(useDropdownStore.getState().openDropdownId).toBe(null)
    })

    it('is safe to call when no dropdown is open', () => {
      useDropdownStore.getState().closeDropdown('menu-1')
      expect(useDropdownStore.getState().openDropdownId).toBe(null)
    })
  })

  describe('toggleDropdown', () => {
    it('opens a closed dropdown', () => {
      useDropdownStore.getState().toggleDropdown('menu-1')
      expect(useDropdownStore.getState().openDropdownId).toBe('menu-1')
    })

    it('closes an open dropdown with the same ID', () => {
      useDropdownStore.getState().openDropdown('menu-1')
      useDropdownStore.getState().toggleDropdown('menu-1')
      expect(useDropdownStore.getState().openDropdownId).toBe(null)
    })

    it('switches to a different dropdown when another is already open', () => {
      useDropdownStore.getState().openDropdown('menu-1')
      useDropdownStore.getState().toggleDropdown('menu-2')
      expect(useDropdownStore.getState().openDropdownId).toBe('menu-2')
    })
  })

  describe('initial state', () => {
    it('starts with no dropdown open', () => {
      expect(useDropdownStore.getState().openDropdownId).toBe(null)
    })
  })
})
