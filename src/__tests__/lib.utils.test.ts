import { describe, expect, it } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn (class name merger)', () => {
  it('merges multiple class strings', () => {
    const result = cn('foo', 'bar')
    expect(result).toBe('foo bar')
  })

  it('handles conditional classes via clsx-style objects', () => {
    const result = cn('base', { active: true, disabled: false })
    expect(result).toBe('base active')
  })

  it('resolves Tailwind conflicts (last wins)', () => {
    // twMerge resolves conflicting Tailwind utilities
    const result = cn('p-4', 'p-8')
    expect(result).toBe('p-8')
  })

  it('resolves Tailwind color conflicts', () => {
    const result = cn('text-red-500', 'text-blue-700')
    expect(result).toBe('text-blue-700')
  })

  it('preserves non-conflicting Tailwind classes', () => {
    const result = cn('p-4', 'mt-2', 'text-lg')
    expect(result).toBe('p-4 mt-2 text-lg')
  })

  it('handles undefined and null values without crashing', () => {
    const result = cn('foo', undefined, null, 'bar')
    expect(result).toBe('foo bar')
  })

  it('handles empty string input', () => {
    const result = cn('')
    expect(result).toBe('')
  })

  it('handles no arguments', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('handles arrays of class names', () => {
    const result = cn(['foo', 'bar'], 'baz')
    expect(result).toBe('foo bar baz')
  })

  it('does not deduplicate non-Tailwind classes (clsx behavior)', () => {
    // clsx concatenates and twMerge only deduplicates Tailwind utility conflicts.
    // Arbitrary class names are passed through as-is.
    const result = cn('foo', 'foo')
    expect(result).toBe('foo foo')
  })

  it('handles boolean false values from template conditionals', () => {
    const isActive = false
    const result = cn('btn', isActive && 'btn-active')
    expect(result).toBe('btn')
  })

  it('resolves responsive variant conflicts (last wins)', () => {
    const result = cn('sm:p-4', 'sm:p-8')
    expect(result).toBe('sm:p-8')
  })

  it('preserves non-conflicting responsive variants', () => {
    const result = cn('sm:p-4', 'md:p-8')
    expect(result).toBe('sm:p-4 md:p-8')
  })

  it('resolves arbitrary value vs utility conflict', () => {
    const result = cn('p-4', 'p-[10px]')
    expect(result).toBe('p-[10px]')
  })

  it('handles complex real-world class composition', () => {
    // Pattern commonly used in AnimationCard and similar components
    const result = cn('flex items-center gap-2', 'rounded-lg bg-gray-100', 'hover:bg-gray-200', {
      'opacity-50': true,
      'pointer-events-none': false,
    })
    expect(result).toContain('flex')
    expect(result).toContain('items-center')
    expect(result).toContain('opacity-50')
    expect(result).not.toContain('pointer-events-none')
  })

  it('resolves conflicting background colors', () => {
    const result = cn('bg-red-500', 'bg-blue-500')
    expect(result).toBe('bg-blue-500')
  })

  it('handles nested conditional arrays', () => {
    const isActive = true
    const isDisabled = false
    const result = cn('base', [isActive && 'active', isDisabled && 'disabled'])
    expect(result).toBe('base active')
  })
})
