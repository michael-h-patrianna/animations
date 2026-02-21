import type { CategoryExport, GroupExport } from '@/types/animation'
import { GroupSection } from '@/components/ui/GroupSection'
import { animationDataService } from '@/services/animationData'
import { CodeModeProvider } from '@/contexts/CodeModeContext'
import { act, fireEvent, render, waitFor, within } from '@testing-library/react'
import { createElement } from 'react'
import { vi } from 'vitest'

vi.mock('@/components/animationRegistry', async () => {
  const actual = await vi.importActual<typeof import('@/components/animationRegistry')>(
    '@/components/animationRegistry'
  )

  const categories = actual.categories as Record<string, CategoryExport>
  const synchronousCategories: Record<string, CategoryExport> = {}

  const mapSource = (source: GroupExport['framer']) =>
    Object.fromEntries(
      Object.entries(source).map(([animationId, animation]) => [
        animationId,
        {
          ...animation,
          component: () => createElement('div', { 'data-animation-id': animationId }),
        },
      ])
    )

  for (const [categoryId, category] of Object.entries(categories)) {
    const groups: CategoryExport['groups'] = {}

    for (const [groupId, group] of Object.entries(category.groups)) {
      groups[groupId] = {
        ...group,
        framer: mapSource(group.framer),
        css: mapSource(group.css),
      }
    }

    synchronousCategories[categoryId] = {
      ...category,
      groups,
    }
  }

  return {
    ...actual,
    categories: synchronousCategories,
  }
})

function escapeRegExp(literal: string) {
  return literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

describe('Group demo grid smoke', () => {
  it(
    'renders each group grid, verifies cards and replay remount behavior',
    async () => {
    const categories = await animationDataService.loadAnimations()

    for (const category of categories) {
      for (const group of category.groups) {
        const elementId = `${category.id}__${group.id}`

        const { container, unmount } = render(
          <CodeModeProvider>
            <GroupSection group={group} elementId={elementId} />
          </CodeModeProvider>
        )

        // Let mocked IntersectionObserver callbacks run before waiting on Suspense content.
        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 1))
        })

        // Wait until observer-triggered visibility mounts demo content.
        await waitFor(
          () => {
            const cards = Array.from(container.querySelectorAll('.pf-card'))
            expect(cards).toHaveLength(group.animations.length)

            for (const card of cards) {
              const stage = card.querySelector('.pf-demo-stage') as HTMLElement | null
              expect(stage).not.toBeNull()
              expect(stage!.children.length).toBeGreaterThan(0)
            }
          },
          { timeout: 10000 }
        )

        // Group header shows title and count
        const heading = within(container).getByRole('heading', {
          level: 2,
          name: new RegExp(`${escapeRegExp(group.title)} \\(${group.animations.length}\\)`),
        })
        expect(heading).toBeInTheDocument()

        // Each card exists with data-animation-id and a Replay control
        for (const anim of group.animations) {
          const card = container.querySelector(
            `.pf-card[data-animation-id="${anim.id}"]`
          ) as HTMLElement | null
          expect(card).not.toBeNull()

          const queries = within(card!)
          const replayBtn = queries.getByRole('button', { name: /replay/i })
          expect(replayBtn).toBeInTheDocument()

          // Verify replay remounts content unless disabled
          const stage = card!.querySelector('.pf-demo-stage') as HTMLElement | null
          expect(stage).not.toBeNull()

          if (!anim.disableReplay) {
            const stageBeforeReplay = stage
            await act(async () => {
              fireEvent.click(replayBtn)
            })
            const newStage = card!.querySelector('.pf-demo-stage') as HTMLElement | null
            expect(newStage).toBeInTheDocument()
            expect(newStage).not.toBe(stageBeforeReplay)
          }
        }

        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 1))
          expect(() => unmount()).not.toThrow()
        })
      }
    }

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1))
    })

    },
    90000
  )
})
