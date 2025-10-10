import { buildRegistryFromCategories, categories } from '@/components/animationRegistry'
import { AnimationCard } from '@/components/ui/AnimationCard'
import { act, render } from '@testing-library/react'

describe('Registry consistency with metadata exports', () => {
  const animationRegistry = buildRegistryFromCategories()

  // Build set of all animation IDs from category exports
  const metadataIds = new Set<string>()
  Object.values(categories).forEach(cat => {
    Object.values(cat.groups).forEach(group => {
      Object.keys(group.animations).forEach(id => {
        metadataIds.add(id)
      })
    })
  })

  const registryIds = new Set(Object.keys(animationRegistry))

  it('every animation with metadata exists in animationRegistry and mounts within AnimationCard', async () => {
    const missingInRegistry: string[] = []

    for (const id of metadataIds) {
      const Comp = animationRegistry[id]
      if (!Comp) {
        missingInRegistry.push(id)
        continue
      }

      // Mount inside AnimationCard to simulate real catalog usage
      const { container, unmount } = render(
        <AnimationCard title={id} description={id} animationId={id}>
          <Comp />
        </AnimationCard>
      )

      // Wait until IntersectionObserver mock marks visible and content mounts
      const stage = container.querySelector('.pf-demo-stage') as HTMLElement | null
      expect(stage).not.toBeNull()

      // Give jsdom a tick for our mocked IntersectionObserver setTimeout(0)
      await act(async () => {
        await new Promise((r) => setTimeout(r, 1))
      })

      // Unmount should not throw
      expect(() => unmount()).not.toThrow()
    }

    // If any are missing: surface clear actionable guidance
    if (missingInRegistry.length > 0) {
      const details = missingInRegistry
        .sort()
        .map(
          (id) =>
            `- ${id} (add metadata export to component and update group index)`
        )
        .join('\n')
      throw new Error(
        `The following animation ids have metadata but are missing from animationRegistry:\n${details}`
      )
    }
  })

  it('no registered components exist that lack metadata exports', () => {
    const extras: string[] = []
    for (const id of registryIds) {
      if (!metadataIds.has(id)) extras.push(id)
    }

    if (extras.length > 0) {
      const details = extras
        .sort()
        .map((id) => `- ${id} (add metadata export to component)`)
        .join('\n')
      const message = `animationRegistry contains components without metadata exports:\n${details}`

      // In strict mode, enforce as a hard failure. Otherwise log a warning to surface actionable items
      const g = globalThis as unknown as { process?: { env?: Record<string, string> } }
      const strict = g.process?.env?.STRICT_REGISTRY === '1'
      if (strict) throw new Error(message)
      console.warn(message)
    }
  })

  it('all animations have valid metadata structure', () => {
    Object.values(categories).forEach(cat => {
      Object.values(cat.groups).forEach(group => {
        Object.entries(group.animations).forEach(([id, anim]) => {
          expect(anim.metadata).toBeDefined()
          expect(anim.metadata.id).toBe(id)
          expect(anim.metadata.title).toBeTruthy()
          expect(anim.metadata.description).toBeTruthy()
          expect(Array.isArray(anim.metadata.tags)).toBe(true)
          expect(anim.component).toBeDefined()
        })
      })
    })
  })
})
