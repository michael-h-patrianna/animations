import {
  categories,
  buildRegistryFromCategories,
  getAnimationMetadata,
} from './animationRegistry'

describe('animationRegistry', () => {
  describe('categories export structure', () => {
    it('should export categories as a non-empty object', () => {
      expect(categories).toBeDefined()
      expect(typeof categories).toBe('object')
      expect(Object.keys(categories).length).toBeGreaterThan(0)
    })

    it('should have all expected category IDs', () => {
      const expectedCategories = ['base', 'dialogs', 'progress', 'realtime', 'rewards']
      const actualCategories = Object.keys(categories).sort()
      expect(actualCategories).toEqual(expectedCategories.sort())
    })

    it('should have each category conform to CategoryExport type', () => {
      Object.entries(categories).forEach(([categoryId, category]) => {
        expect(category).toBeDefined()
        expect(category.metadata).toBeDefined()
        expect(category.metadata.id).toBe(categoryId)
        expect(category.metadata.title).toBeTruthy()
        expect(typeof category.metadata.title).toBe('string')
        expect(category.groups).toBeDefined()
        expect(typeof category.groups).toBe('object')
      })
    })
  })

  describe('category metadata validation', () => {
    it('should have correct metadata for each category', () => {
      Object.values(categories).forEach(category => {
        expect(category.metadata).toMatchObject({
          id: expect.any(String),
          title: expect.any(String),
        })
        expect(category.metadata.id).toBeTruthy()
        expect(category.metadata.title).toBeTruthy()
      })
    })

    it('should have unique category IDs', () => {
      const ids = Object.values(categories).map(cat => cat.metadata.id)
      const uniqueIds = new Set(ids)
      expect(ids.length).toBe(uniqueIds.size)
    })

    it('should have category IDs matching their keys', () => {
      Object.entries(categories).forEach(([key, category]) => {
        expect(category.metadata.id).toBe(key)
      })
    })
  })

  describe('group metadata validation', () => {
    it('should have each group conform to GroupExport type', () => {
      Object.values(categories).forEach(category => {
        Object.entries(category.groups).forEach(([groupId, group]) => {
          expect(group).toBeDefined()
          expect(group.metadata).toBeDefined()
          expect(group.metadata.id).toBe(groupId)
          expect(group.metadata.title).toBeTruthy()
          expect(typeof group.metadata.title).toBe('string')
          expect(group.framer).toBeDefined()
          expect(typeof group.framer).toBe('object')
          expect(group.css).toBeDefined()
          expect(typeof group.css).toBe('object')
        })
      })
    })

    it('should have correct metadata for each group', () => {
      Object.values(categories).forEach(category => {
        Object.values(category.groups).forEach(group => {
          expect(group.metadata).toMatchObject({
            id: expect.any(String),
            title: expect.any(String),
          })
          expect(group.metadata.id).toBeTruthy()
          expect(group.metadata.title).toBeTruthy()

          // Optional fields
          if (group.metadata.tech) {
            expect(['css', 'framer', 'js']).toContain(group.metadata.tech)
          }
          if (group.metadata.demo) {
            expect(typeof group.metadata.demo).toBe('string')
          }
          if (group.metadata.icon) {
            expect(typeof group.metadata.icon).toBe('string')
          }
        })
      })
    })

    it('should have at least one group per category', () => {
      Object.values(categories).forEach(category => {
        const groupCount = Object.keys(category.groups).length
        expect(groupCount).toBeGreaterThan(0)
      })
    })

    it('should have unique group IDs within each category', () => {
      Object.values(categories).forEach(category => {
        const groupIds = Object.values(category.groups).map(g => g.metadata.id)
        const uniqueIds = new Set(groupIds)
        expect(groupIds.length).toBe(uniqueIds.size)
      })
    })

    it('should have group IDs matching their keys', () => {
      Object.values(categories).forEach(category => {
        Object.entries(category.groups).forEach(([key, group]) => {
          expect(group.metadata.id).toBe(key)
        })
      })
    })
  })

  describe('animation metadata validation', () => {
    it('should have each animation conform to AnimationExport type', () => {
      Object.values(categories).forEach(category => {
        Object.values(category.groups).forEach(group => {
          // Check framer animations
          Object.entries(group.framer).forEach(([animId, animation]) => {
            expect(animation).toBeDefined()
            expect(animation.component).toBeDefined()
            // Component can be a function or an object (lazy-loaded React component)
            expect(['function', 'object']).toContain(typeof animation.component)
            expect(animation.metadata).toBeDefined()
            expect(animation.metadata.id).toBe(animId)
          })
          // Check css animations
          Object.entries(group.css).forEach(([animId, animation]) => {
            expect(animation).toBeDefined()
            expect(animation.component).toBeDefined()
            // Component can be a function or an object (lazy-loaded React component)
            expect(['function', 'object']).toContain(typeof animation.component)
            expect(animation.metadata).toBeDefined()
            expect(animation.metadata.id).toBe(animId)
          })
        })
      })
    })

    it('should have correct metadata structure for each animation', () => {
      Object.values(categories).forEach(category => {
        Object.values(category.groups).forEach(group => {
          // Check framer animations
          Object.values(group.framer).forEach(animation => {
            expect(animation.metadata).toMatchObject({
              id: expect.any(String),
              title: expect.any(String),
              description: expect.any(String),
              tags: expect.any(Array),
            })
            expect(animation.metadata.id).toBeTruthy()
            expect(animation.metadata.title).toBeTruthy()
            expect(animation.metadata.description).toBeTruthy()
            expect(Array.isArray(animation.metadata.tags)).toBe(true)

            // Optional field
            if (animation.metadata.disableReplay !== undefined) {
              expect(typeof animation.metadata.disableReplay).toBe('boolean')
            }
          })
          // Check css animations
          Object.values(group.css).forEach(animation => {
            expect(animation.metadata).toMatchObject({
              id: expect.any(String),
              title: expect.any(String),
              description: expect.any(String),
              tags: expect.any(Array),
            })
            expect(animation.metadata.id).toBeTruthy()
            expect(animation.metadata.title).toBeTruthy()
            expect(animation.metadata.description).toBeTruthy()
            expect(Array.isArray(animation.metadata.tags)).toBe(true)

            // Optional field
            if (animation.metadata.disableReplay !== undefined) {
              expect(typeof animation.metadata.disableReplay).toBe('boolean')
            }
          })
        })
      })
    })

    it('should have at least one animation per group', () => {
      Object.values(categories).forEach(category => {
        Object.values(category.groups).forEach(group => {
          const framerCount = Object.keys(group.framer).length
          const cssCount = Object.keys(group.css).length
          const totalCount = framerCount + cssCount
          expect(totalCount).toBeGreaterThan(0)
        })
      })
    })

    it('should have unique animation IDs within each code mode (framer and css separately)', () => {
      // Check framer animations for uniqueness
      const framerAnimationIds: string[] = []
      Object.values(categories).forEach(category => {
        Object.values(category.groups).forEach(group => {
          Object.values(group.framer).forEach(animation => {
            framerAnimationIds.push(animation.metadata.id)
          })
        })
      })

      const uniqueFramerIds = new Set(framerAnimationIds)
      if (framerAnimationIds.length !== uniqueFramerIds.size) {
        const duplicates: Record<string, number> = {}
        framerAnimationIds.forEach(id => {
          duplicates[id] = (duplicates[id] || 0) + 1
        })
        const dupes = Object.entries(duplicates)
          .filter(([_, count]) => count > 1)
          .map(([id]) => id)

        throw new Error(
          `Duplicate Framer animation IDs found: ${dupes.join(', ')}\n` +
          'Each Framer animation ID must be unique.'
        )
      }

      expect(framerAnimationIds.length).toBe(uniqueFramerIds.size)

      // Check CSS animations for uniqueness
      const cssAnimationIds: string[] = []
      Object.values(categories).forEach(category => {
        Object.values(category.groups).forEach(group => {
          Object.values(group.css).forEach(animation => {
            cssAnimationIds.push(animation.metadata.id)
          })
        })
      })

      const uniqueCssIds = new Set(cssAnimationIds)
      if (cssAnimationIds.length !== uniqueCssIds.size) {
        const duplicates: Record<string, number> = {}
        cssAnimationIds.forEach(id => {
          duplicates[id] = (duplicates[id] || 0) + 1
        })
        const dupes = Object.entries(duplicates)
          .filter(([_, count]) => count > 1)
          .map(([id]) => id)

        throw new Error(
          `Duplicate CSS animation IDs found: ${dupes.join(', ')}\n` +
          'Each CSS animation ID must be unique.'
        )
      }

      expect(cssAnimationIds.length).toBe(uniqueCssIds.size)
    })

    it('should have animation IDs matching their keys', () => {
      Object.values(categories).forEach(category => {
        Object.values(category.groups).forEach(group => {
          Object.entries(group.framer).forEach(([key, animation]) => {
            expect(animation.metadata.id).toBe(key)
          })
          Object.entries(group.css).forEach(([key, animation]) => {
            expect(animation.metadata.id).toBe(key)
          })
        })
      })
    })

    it('should have all tags as strings', () => {
      Object.values(categories).forEach(category => {
        Object.values(category.groups).forEach(group => {
          Object.values(group.framer).forEach(animation => {
            animation.metadata.tags.forEach(tag => {
              expect(typeof tag).toBe('string')
              expect(tag).toBeTruthy()
            })
          })
          Object.values(group.css).forEach(animation => {
            animation.metadata.tags.forEach(tag => {
              expect(typeof tag).toBe('string')
              expect(tag).toBeTruthy()
            })
          })
        })
      })
    })
  })

  describe('buildRegistryFromCategories()', () => {
    it('should return a non-empty object', () => {
      const registry = buildRegistryFromCategories()
      expect(registry).toBeDefined()
      expect(typeof registry).toBe('object')
      expect(Object.keys(registry).length).toBeGreaterThan(0)
    })

    it('should produce a flat map of animation ID to component', () => {
      const registry = buildRegistryFromCategories()

      Object.entries(registry).forEach(([id, component]) => {
        expect(typeof id).toBe('string')
        expect(id).toBeTruthy()
        // Component can be a function or an object (lazy-loaded React component)
        expect(['function', 'object']).toContain(typeof component)
      })
    })

    it('should contain all animations from all categories for each code mode', () => {
      // Test Framer mode
      const framerRegistry = buildRegistryFromCategories('Framer')
      const framerRegistryIds = new Set(Object.keys(framerRegistry))

      Object.values(categories).forEach(category => {
        Object.values(category.groups).forEach(group => {
          Object.keys(group.framer).forEach(animId => {
            expect(framerRegistryIds.has(animId)).toBe(true)
          })
        })
      })

      // Test CSS mode
      const cssRegistry = buildRegistryFromCategories('CSS')
      const cssRegistryIds = new Set(Object.keys(cssRegistry))

      Object.values(categories).forEach(category => {
        Object.values(category.groups).forEach(group => {
          Object.keys(group.css).forEach(animId => {
            expect(cssRegistryIds.has(animId)).toBe(true)
          })
        })
      })
    })

    it('should have the same number of animations as the category hierarchy for each code mode', () => {
      // Test Framer mode
      const framerRegistry = buildRegistryFromCategories('Framer')
      let expectedFramerCount = 0
      Object.values(categories).forEach(category => {
        Object.values(category.groups).forEach(group => {
          expectedFramerCount += Object.keys(group.framer).length
        })
      })
      expect(Object.keys(framerRegistry).length).toBe(expectedFramerCount)

      // Test CSS mode
      const cssRegistry = buildRegistryFromCategories('CSS')
      let expectedCssCount = 0
      Object.values(categories).forEach(category => {
        Object.values(category.groups).forEach(group => {
          expectedCssCount += Object.keys(group.css).length
        })
      })
      expect(Object.keys(cssRegistry).length).toBe(expectedCssCount)
    })

    it('should map animation IDs to the same components as in the hierarchy for each code mode', () => {
      // Test Framer mode
      const framerRegistry = buildRegistryFromCategories('Framer')
      Object.values(categories).forEach(category => {
        Object.values(category.groups).forEach(group => {
          Object.entries(group.framer).forEach(([animId, animation]) => {
            expect(framerRegistry[animId]).toBe(animation.component)
          })
        })
      })

      // Test CSS mode
      const cssRegistry = buildRegistryFromCategories('CSS')
      Object.values(categories).forEach(category => {
        Object.values(category.groups).forEach(group => {
          Object.entries(group.css).forEach(([animId, animation]) => {
            expect(cssRegistry[animId]).toBe(animation.component)
          })
        })
      })
    })

    it('should produce deterministic results on multiple calls', () => {
      const registry1 = buildRegistryFromCategories()
      const registry2 = buildRegistryFromCategories()

      expect(Object.keys(registry1).sort()).toEqual(Object.keys(registry2).sort())

      Object.keys(registry1).forEach(id => {
        expect(registry1[id]).toBe(registry2[id])
      })
    })
  })

  describe('getAnimationMetadata()', () => {
    it('should return metadata for valid animation ID', () => {
      // Get a valid animation ID from the first available animation
      const firstCategory = Object.values(categories)[0]
      const firstGroup = Object.values(firstCategory.groups)[0]
      const firstAnimationId = Object.keys(firstGroup.framer)[0] || Object.keys(firstGroup.css)[0]

      const metadata = getAnimationMetadata(firstAnimationId)
      expect(metadata).toBeDefined()
      expect(metadata).not.toBeNull()
      expect(metadata?.id).toBe(firstAnimationId)
    })

    it('should return null for invalid animation ID', () => {
      const metadata = getAnimationMetadata('nonexistent-animation-id')
      expect(metadata).toBeNull()
    })

    it('should return null for empty string', () => {
      const metadata = getAnimationMetadata('')
      expect(metadata).toBeNull()
    })

    it('should return correct metadata for all animations when specifying code mode', () => {
      Object.values(categories).forEach(category => {
        Object.values(category.groups).forEach(group => {
          Object.entries(group.framer).forEach(([animId, animation]) => {
            const metadata = getAnimationMetadata(animId, 'Framer')
            expect(metadata).toEqual(animation.metadata)
          })
          Object.entries(group.css).forEach(([animId, animation]) => {
            const metadata = getAnimationMetadata(animId, 'CSS')
            expect(metadata).toEqual(animation.metadata)
          })
        })
      })
    })

    it('should return metadata with all required fields', () => {
      const firstCategory = Object.values(categories)[0]
      const firstGroup = Object.values(firstCategory.groups)[0]
      const firstAnimationId = Object.keys(firstGroup.framer)[0] || Object.keys(firstGroup.css)[0]

      const metadata = getAnimationMetadata(firstAnimationId)
      expect(metadata).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        tags: expect.any(Array),
      })
    })

    it('should handle case-sensitive lookup', () => {
      const firstCategory = Object.values(categories)[0]
      const firstGroup = Object.values(firstCategory.groups)[0]
      const firstAnimationId = Object.keys(firstGroup.framer)[0] || Object.keys(firstGroup.css)[0]

      const metadata = getAnimationMetadata(firstAnimationId.toUpperCase())
      expect(metadata).toBeNull()
    })
  })


  describe('type safety and validation', () => {
    it('should have all categories with required metadata fields', () => {
      Object.values(categories).forEach(category => {
        const metadata = category.metadata
        expect(metadata.id).toBeDefined()
        expect(metadata.title).toBeDefined()
        expect(typeof metadata.id).toBe('string')
        expect(typeof metadata.title).toBe('string')
        expect(metadata.id.length).toBeGreaterThan(0)
        expect(metadata.title.length).toBeGreaterThan(0)
      })
    })

    it('should have all groups with required metadata fields', () => {
      Object.values(categories).forEach(category => {
        Object.values(category.groups).forEach(group => {
          const metadata = group.metadata
          expect(metadata.id).toBeDefined()
          expect(metadata.title).toBeDefined()
          expect(typeof metadata.id).toBe('string')
          expect(typeof metadata.title).toBe('string')
          expect(metadata.id.length).toBeGreaterThan(0)
          expect(metadata.title.length).toBeGreaterThan(0)
        })
      })
    })

    it('should have all animations with required metadata fields', () => {
      Object.values(categories).forEach(category => {
        Object.values(category.groups).forEach(group => {
          Object.values(group.framer).forEach(animation => {
            const metadata = animation.metadata
            expect(metadata.id).toBeDefined()
            expect(metadata.title).toBeDefined()
            expect(metadata.description).toBeDefined()
            expect(metadata.tags).toBeDefined()
            expect(typeof metadata.id).toBe('string')
            expect(typeof metadata.title).toBe('string')
            expect(typeof metadata.description).toBe('string')
            expect(Array.isArray(metadata.tags)).toBe(true)
            expect(metadata.id.length).toBeGreaterThan(0)
            expect(metadata.title.length).toBeGreaterThan(0)
            expect(metadata.description.length).toBeGreaterThan(0)
          })
          Object.values(group.css).forEach(animation => {
            const metadata = animation.metadata
            expect(metadata.id).toBeDefined()
            expect(metadata.title).toBeDefined()
            expect(metadata.description).toBeDefined()
            expect(metadata.tags).toBeDefined()
            expect(typeof metadata.id).toBe('string')
            expect(typeof metadata.title).toBe('string')
            expect(typeof metadata.description).toBe('string')
            expect(Array.isArray(metadata.tags)).toBe(true)
            expect(metadata.id.length).toBeGreaterThan(0)
            expect(metadata.title.length).toBeGreaterThan(0)
            expect(metadata.description.length).toBeGreaterThan(0)
          })
        })
      })
    })

    it('should not have any null or undefined components', () => {
      Object.values(categories).forEach(category => {
        Object.values(category.groups).forEach(group => {
          Object.values(group.framer).forEach(animation => {
            expect(animation.component).toBeDefined()
            expect(animation.component).not.toBeNull()
          })
          Object.values(group.css).forEach(animation => {
            expect(animation.component).toBeDefined()
            expect(animation.component).not.toBeNull()
          })
        })
      })
    })

    it('should not have any empty animation collections', () => {
      Object.values(categories).forEach(category => {
        Object.values(category.groups).forEach(group => {
          const framerCount = Object.keys(group.framer).length
          const cssCount = Object.keys(group.css).length
          const totalCount = framerCount + cssCount
          expect(totalCount).toBeGreaterThan(0)
        })
      })
    })
  })

  describe('edge cases and error handling', () => {
    it('should handle getAnimationMetadata with null input gracefully', () => {
      // @ts-expect-error Testing runtime behavior with invalid input
      const metadata = getAnimationMetadata(null)
      expect(metadata).toBeNull()
    })

    it('should handle getAnimationMetadata with undefined input gracefully', () => {
      // @ts-expect-error Testing runtime behavior with invalid input
      const metadata = getAnimationMetadata(undefined)
      expect(metadata).toBeNull()
    })

    it('should handle getAnimationMetadata with numeric input gracefully', () => {
      // @ts-expect-error Testing runtime behavior with invalid input
      const metadata = getAnimationMetadata(123)
      expect(metadata).toBeNull()
    })

    it('should not mutate the categories object when building registry', () => {
      const categoriesBefore = JSON.stringify(categories)
      buildRegistryFromCategories()
      const categoriesAfter = JSON.stringify(categories)
      expect(categoriesBefore).toBe(categoriesAfter)
    })

    it('should not mutate the categories object when getting metadata', () => {
      const firstCategory = Object.values(categories)[0]
      const firstGroup = Object.values(firstCategory.groups)[0]
      const firstAnimationId = Object.keys(firstGroup.framer)[0] || Object.keys(firstGroup.css)[0]

      const categoriesBefore = JSON.stringify(categories)
      getAnimationMetadata(firstAnimationId)
      const categoriesAfter = JSON.stringify(categories)
      expect(categoriesBefore).toBe(categoriesAfter)
    })
  })
})
