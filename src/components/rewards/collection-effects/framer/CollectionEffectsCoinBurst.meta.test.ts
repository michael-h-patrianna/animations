import { describe, it, expect } from 'vitest'
import { metadata } from './CollectionEffectsCoinBurst.meta'

describe('CollectionEffectsCoinBurst metadata (Framer Motion)', () => {
  it('exports metadata object', () => {
    expect(metadata).toBeDefined()
    expect(typeof metadata).toBe('object')
  })

  it('has correct animation id', () => {
    expect(metadata.id).toBe('collection-effects__coin-burst')
  })

  it('id follows naming convention (group__variant)', () => {
    expect(metadata.id).toMatch(/^[a-z-]+__[a-z-]+(-[a-z]+)*$/)
  })

  it('has non-empty title', () => {
    expect(metadata.title).toBeDefined()
    expect(metadata.title).toBe('Coin Burst')
    expect(metadata.title.length).toBeGreaterThan(0)
  })

  it('has non-empty description', () => {
    expect(metadata.description).toBeDefined()
    expect(metadata.description.length).toBeGreaterThan(0)
    expect(metadata.description).toContain('radial')
    expect(metadata.description).toContain('burst')
  })

  it('has tags array with appropriate tags', () => {
    expect(metadata.tags).toBeDefined()
    expect(Array.isArray(metadata.tags)).toBe(true)
    expect(metadata.tags.length).toBeGreaterThan(0)
  })

  it('includes framer tag', () => {
    expect(metadata.tags).toContain('framer')
  })

  it('includes relevant animation tags', () => {
    const relevantTags = ['celebration', 'coins', 'burst', 'rewards']
    const hasRelevantTags = relevantTags.some((tag) => metadata.tags.includes(tag))
    expect(hasRelevantTags).toBe(true)
  })

  it('all tags are lowercase strings', () => {
    metadata.tags.forEach((tag) => {
      expect(typeof tag).toBe('string')
      expect(tag).toBe(tag.toLowerCase())
    })
  })

  it('has no duplicate tags', () => {
    const uniqueTags = new Set(metadata.tags)
    expect(uniqueTags.size).toBe(metadata.tags.length)
  })

  it('metadata structure matches AnimationMetadata type', () => {
    expect(metadata).toHaveProperty('id')
    expect(metadata).toHaveProperty('title')
    expect(metadata).toHaveProperty('description')
    expect(metadata).toHaveProperty('tags')
  })
})
