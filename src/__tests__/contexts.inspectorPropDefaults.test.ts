import { describe, it, expect } from 'vitest'
import {
  isRecord,
  cloneDefaultValue,
  buildPropDefaults,
  hasDirtyPropOverrides,
} from '@/contexts/inspectorPropDefaults'
import type { PropConfig } from '@/types/animation'

describe('isRecord', () => {
  it('returns true for plain objects', () => {
    expect(isRecord({ a: 1 })).toBe(true)
  })

  it('returns false for arrays', () => {
    expect(isRecord([1])).toBe(false)
  })

  it('returns false for null', () => {
    expect(isRecord(null)).toBe(false)
  })

  it('returns false for primitives', () => {
    expect(isRecord(42)).toBe(false)
    expect(isRecord('str')).toBe(false)
  })
})

describe('cloneDefaultValue', () => {
  it('shallow-clones arrays', () => {
    const arr = [1, 2, 3]
    const cloned = cloneDefaultValue(arr)
    expect(cloned).toEqual(arr)
    expect(cloned).not.toBe(arr)
  })

  it('shallow-clones plain objects', () => {
    const obj = { a: 1 }
    const cloned = cloneDefaultValue(obj)
    expect(cloned).toEqual(obj)
    expect(cloned).not.toBe(obj)
  })

  it('returns primitives as-is', () => {
    expect(cloneDefaultValue(42)).toBe(42)
    expect(cloneDefaultValue('str')).toBe('str')
    expect(cloneDefaultValue(true)).toBe(true)
  })
})

describe('buildPropDefaults', () => {
  it('returns empty object for undefined config', () => {
    expect(buildPropDefaults(undefined)).toEqual({})
  })

  it('includes number prop defaults', () => {
    const config: PropConfig[] = [{ type: 'number', name: 'speed', label: 'Speed', default: 50 }]
    expect(buildPropDefaults(config)).toEqual({ speed: 50 })
  })

  it('includes boolean prop defaults', () => {
    const config: PropConfig[] = [{ type: 'boolean', name: 'loop', label: 'Loop', default: true }]
    expect(buildPropDefaults(config)).toEqual({ loop: true })
  })

  it('includes string prop defaults', () => {
    const config: PropConfig[] = [{ type: 'string', name: 'text', label: 'Text', default: 'hello' }]
    expect(buildPropDefaults(config)).toEqual({ text: 'hello' })
  })

  it('includes color prop defaults', () => {
    const config: PropConfig[] = [{ type: 'color', name: 'bg', label: 'BG', default: '#ff0000' }]
    expect(buildPropDefaults(config)).toEqual({ bg: '#ff0000' })
  })

  it('includes colors array prop defaults (cloned)', () => {
    const colors = ['#ff0000', '#00ff00']
    const config: PropConfig[] = [
      { type: 'colors', name: 'palette', label: 'Palette', default: colors },
    ]
    const result = buildPropDefaults(config)
    expect(result.palette).toEqual(colors)
    expect(result.palette).not.toBe(colors)
  })

  it('skips disabled props', () => {
    const config: PropConfig[] = [
      { type: 'number', name: 'x', label: 'X', default: 10, disabled: true },
    ]
    expect(buildPropDefaults(config)).toEqual({})
  })

  it('builds style-object defaults from fields', () => {
    const config: PropConfig[] = [
      {
        type: 'style-object',
        name: 'style',
        label: 'Style',
        fields: [
          { type: 'number', key: '--size', label: 'Size', default: 16, unit: 'px' },
          { type: 'color', key: '--color', label: 'Color', default: '#333' },
        ],
      },
    ]
    const result = buildPropDefaults(config)
    expect(result.style).toEqual({ '--size': '16px', '--color': '#333' })
  })
})

describe('hasDirtyPropOverrides', () => {
  it('returns false when overrides match defaults', () => {
    const config: PropConfig[] = [{ type: 'number', name: 'speed', label: 'Speed', default: 50 }]
    expect(hasDirtyPropOverrides({ speed: 50 }, config)).toBe(false)
  })

  it('returns true when a value differs from default', () => {
    const config: PropConfig[] = [{ type: 'number', name: 'speed', label: 'Speed', default: 50 }]
    expect(hasDirtyPropOverrides({ speed: 75 }, config)).toBe(true)
  })

  it('returns false for matching array defaults', () => {
    const config: PropConfig[] = [
      { type: 'colors', name: 'palette', label: 'Palette', default: ['#ff0000'] },
    ]
    expect(hasDirtyPropOverrides({ palette: ['#ff0000'] }, config)).toBe(false)
  })

  it('returns true for differing array values', () => {
    const config: PropConfig[] = [
      { type: 'colors', name: 'palette', label: 'Palette', default: ['#ff0000'] },
    ]
    expect(hasDirtyPropOverrides({ palette: ['#00ff00'] }, config)).toBe(true)
  })

  it('returns true for differing array lengths', () => {
    const config: PropConfig[] = [
      { type: 'colors', name: 'palette', label: 'Palette', default: ['#ff0000'] },
    ]
    expect(hasDirtyPropOverrides({ palette: ['#ff0000', '#00ff00'] }, config)).toBe(true)
  })

  it('handles nested record comparison (style-object)', () => {
    const config: PropConfig[] = [
      {
        type: 'style-object',
        name: 'style',
        label: 'Style',
        fields: [{ type: 'number', key: '--size', label: 'Size', default: 16, unit: 'px' }],
      },
    ]
    // Matching nested value
    expect(hasDirtyPropOverrides({ style: { '--size': '16px' } }, config)).toBe(false)
    // Differing nested value
    expect(hasDirtyPropOverrides({ style: { '--size': '20px' } }, config)).toBe(true)
  })
})
