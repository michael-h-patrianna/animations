import { animationRegistry } from '@/components/animationRegistry'
import { AnimationCard } from '@/components/ui/AnimationCard'
import { act, render } from '@testing-library/react'
import structure from '../../docs/structure.json'

// Narrow type for structure JSON
type Anim = {
  id: string
  title: string
  description: string
  categoryId: string
  groupId: string
  tags?: string[]
  disableReplay?: boolean
}

describe('Registry consistency with docs/structure.json', () => {
  const structureIds = new Set((structure.animations as Anim[]).map((a) => a.id))
  const registryIds = new Set(Object.keys(animationRegistry))

  it('every structure animation id exists in animationRegistry and mounts within AnimationCard', async () => {
    const missingInRegistry: string[] = []

    for (const id of structureIds) {
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
            `- ${id} (note: remove outdated entry from docs/structure.json if no related component)`
        )
        .join('\n')
      throw new Error(
        `The following animation ids are defined in docs/structure.json but missing from animationRegistry:\n${details}`
      )
    }
  })

  it('no registered components exist that are not represented in docs/structure.json', () => {
    const extras: string[] = []
    for (const id of registryIds) {
      if (!structureIds.has(id)) extras.push(id)
    }

    if (extras.length > 0) {
      const details = extras
        .sort()
        .map((id) => `- ${id} (remove from registry or add to docs/structure.json)`) // guidance either way
        .join('\n')
      const message = `animationRegistry contains components not represented in docs/structure.json:\n${details}`

      // In strict mode, enforce as a hard failure. Otherwise log a warning to surface actionable items
      const g = globalThis as unknown as { process?: { env?: Record<string, string> } }
      const strict = g.process?.env?.STRICT_REGISTRY === '1'
      if (strict) throw new Error(message)
      console.warn(message)
    }
  })
})
