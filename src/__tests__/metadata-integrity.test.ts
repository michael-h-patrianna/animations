import { categories } from '@/components/animationRegistry'
import { describe, expect, it } from 'vitest'

describe('metadata integrity', () => {
  it('all animation metadata has required fields with valid content', () => {
    for (const [catKey, cat] of Object.entries(categories)) {
      for (const [groupKey, group] of Object.entries(cat.groups)) {
        for (const [techLabel, animMap] of [
          ['framer', group.framer],
          ['css', group.css],
        ] as const) {
          for (const [animId, anim] of Object.entries(animMap)) {
            const context = `${catKey}/${groupKey}/${techLabel}/${animId}`

            expect(anim.metadata.id, `${context}: id`).toMatch(/^[a-z][a-z0-9-]*__[a-z][a-z0-9-]*$/)
            expect(anim.metadata.title, `${context}: title`).toMatch(/\w{2,}/)
            expect(anim.metadata.description, `${context}: description`).toMatch(/\w{5,}/)
            expect(anim.metadata.tags, `${context}: tags`).toEqual(expect.arrayContaining([]))
          }
        }
      }
    }
  })

  it('all animation ids follow group__variant naming convention', () => {
    for (const cat of Object.values(categories)) {
      for (const group of Object.values(cat.groups)) {
        for (const animMap of [group.framer, group.css]) {
          for (const [animId, anim] of Object.entries(animMap)) {
            expect(anim.metadata.id, `${animId} metadata.id mismatch`).toBe(animId)
            expect(animId).toMatch(/^[a-z][a-z0-9-]*__[a-z][a-z0-9-]*$/)
          }
        }
      }
    }
  })

  it('no duplicate animation ids exist within any single tech variant', () => {
    for (const cat of Object.values(categories)) {
      for (const group of Object.values(cat.groups)) {
        const framerIds = Object.keys(group.framer)
        const cssIds = Object.keys(group.css)

        expect(new Set(framerIds).size).toBe(framerIds.length)
        expect(new Set(cssIds).size).toBe(cssIds.length)
      }
    }
  })

  it('framer and css variants share the same animation ids per group', () => {
    for (const cat of Object.values(categories)) {
      for (const [groupKey, group] of Object.entries(cat.groups)) {
        const framerIds = new Set(Object.keys(group.framer))
        const cssIds = new Set(Object.keys(group.css))

        // If both variants exist, they should have the same animation ids
        if (framerIds.size > 0 && cssIds.size > 0) {
          for (const id of framerIds) {
            expect(cssIds.has(id), `${groupKey}: framer has ${id} but css doesn't`).toBe(true)
          }
          for (const id of cssIds) {
            expect(framerIds.has(id), `${groupKey}: css has ${id} but framer doesn't`).toBe(true)
          }
        }
      }
    }
  })

  it('all animation components are valid lazy React components with $$typeof', () => {
    for (const cat of Object.values(categories)) {
      for (const group of Object.values(cat.groups)) {
        for (const animMap of [group.framer, group.css]) {
          for (const [id, anim] of Object.entries(animMap)) {
            expect(anim.component, `${id}: not a lazy component`).toHaveProperty(
              '$$typeof',
              Symbol.for('react.lazy')
            )
          }
        }
      }
    }
  })

  it('animation ids are unique across groups within the same tech variant', () => {
    // This catches ID collisions where two different groups accidentally use
    // the same animation ID, which would cause one to overwrite the other
    // in the flat registry.
    const framerIdToGroup = new Map<string, string>()
    const cssIdToGroup = new Map<string, string>()
    const collisions: string[] = []

    for (const cat of Object.values(categories)) {
      for (const [groupKey, group] of Object.entries(cat.groups)) {
        for (const id of Object.keys(group.framer)) {
          if (framerIdToGroup.has(id)) {
            collisions.push(
              `framer ID "${id}" in groups "${framerIdToGroup.get(id)}" and "${groupKey}"`
            )
          }
          framerIdToGroup.set(id, groupKey)
        }
        for (const id of Object.keys(group.css)) {
          if (cssIdToGroup.has(id)) {
            collisions.push(`css ID "${id}" in groups "${cssIdToGroup.get(id)}" and "${groupKey}"`)
          }
          cssIdToGroup.set(id, groupKey)
        }
      }
    }

    expect(collisions, `Cross-group ID collisions:\n${collisions.join('\n')}`).toEqual([])
  })

  it('animation id prefix matches the group metadata id', () => {
    for (const cat of Object.values(categories)) {
      for (const [groupKey, group] of Object.entries(cat.groups)) {
        for (const animMap of [group.framer, group.css]) {
          for (const id of Object.keys(animMap)) {
            const prefix = id.split('__')[0]
            expect(
              prefix,
              `Animation "${id}" prefix "${prefix}" doesn't match group "${groupKey}"`
            ).toBe(groupKey)
          }
        }
      }
    }
  })

  it('group metadata ids match their registry keys', () => {
    for (const cat of Object.values(categories)) {
      for (const [key, group] of Object.entries(cat.groups)) {
        expect(group.metadata.id, `Group key ${key} != metadata.id ${group.metadata.id}`).toBe(key)
      }
    }
  })

  it('category metadata ids match their registry keys', () => {
    for (const [key, cat] of Object.entries(categories)) {
      expect(cat.metadata.id, `Category key ${key} != metadata.id ${cat.metadata.id}`).toBe(key)
    }
  })
})
