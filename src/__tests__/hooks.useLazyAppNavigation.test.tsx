import { CodeModeProvider, useCodeMode } from '@/contexts/CodeModeContext'
import { useLazyAppNavigation } from '@/hooks/useLazyAppNavigation'
import type { Group } from '@/types/animation'
import type { LazyGroup, LazyNavCatalog } from '@/types/lazy'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

type GroupId = 'alpha-framer' | 'beta-framer' | 'beta-css' | 'gamma-framer'

const mockRegistry = vi.hoisted(() => {
  const makeLazyGroup = (
    id: GroupId,
    title: string,
    tech: 'framer' | 'css',
    baseGroupId: string
  ) => ({
    id,
    title,
    tech,
    baseGroupId,
    categoryId: 'fixtures',
    metadata: { id: baseGroupId, title },
  })

  const lazyGroups = [
    makeLazyGroup('alpha-framer', 'Alpha (Framer)', 'framer', 'alpha'),
    makeLazyGroup('beta-framer', 'Beta (Framer)', 'framer', 'beta'),
    makeLazyGroup('beta-css', 'Beta (CSS)', 'css', 'beta'),
    makeLazyGroup('gamma-framer', 'Gamma (Framer)', 'framer', 'gamma'),
  ]

  const groupMap = Object.fromEntries(lazyGroups.map((group) => [group.id, group]))
  const navCatalog = {
    categories: [{ id: 'fixtures', title: 'Fixtures', groups: lazyGroups }],
    groupMap,
  }

  const makeGroup = (id: GroupId, title: string, tech: 'framer' | 'css'): Group => ({
    id: id as never,
    title,
    tech,
    animations: [
      {
        id: `${id}__animation` as never,
        title: `${title} Animation`,
        description: `${title} test animation`,
        categoryId: 'fixtures' as never,
        groupId: id as never,
        urlSlugFramer: `/${id}?animation=${id}__animation`,
        urlSlugCss: `/${id.replace(/-framer$/, '-css')}?animation=${id}__animation`,
      },
    ],
  })

  const loadedGroups = {
    'alpha-framer': makeGroup('alpha-framer', 'Alpha (Framer)', 'framer'),
    'beta-framer': makeGroup('beta-framer', 'Beta (Framer)', 'framer'),
    'beta-css': makeGroup('beta-css', 'Beta (CSS)', 'css'),
    'gamma-framer': makeGroup('gamma-framer', 'Gamma (Framer)', 'framer'),
  }

  return {
    groupMap,
    loadedGroups,
    navCatalog,
    loadLazyGroup: vi.fn(),
    preloadLazyGroup: vi.fn(),
  }
})

vi.mock('@/components/lazyBootstrap', () => ({}))

vi.mock('@/lib/lazyGroupRegistry', () => ({
  getLazyNavCatalog: (): LazyNavCatalog => mockRegistry.navCatalog as LazyNavCatalog,
  findLazyGroup: (groupId: string): LazyGroup | undefined =>
    mockRegistry.groupMap[groupId] as LazyGroup | undefined,
  preloadLazyGroup: mockRegistry.preloadLazyGroup,
  loadLazyGroup: mockRegistry.loadLazyGroup,
  isGroupCached: () => false,
}))

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((res) => {
    resolve = res
  })
  return { promise, resolve }
}

function resultFor(groupId: GroupId) {
  const group = mockRegistry.loadedGroups[groupId]
  return { metadata: { id: group.id, title: group.title }, animations: {}, group }
}

function Probe() {
  const navigation = useLazyAppNavigation()
  const { codeMode } = useCodeMode()
  const location = useLocation()

  return (
    <div>
      <output
        data-testid="state"
        data-current-group-id={navigation.currentGroupId}
        data-current-group={navigation.currentGroup?.id ?? ''}
        data-filter={navigation.animationFilter ?? ''}
        data-location={`${location.pathname}${location.search}`}
        data-mode={codeMode}
      />
      <button onClick={() => navigation.handleGroupSelect('beta-framer')}>beta</button>
    </div>
  )
}

function renderNavigation(initialRoute: string) {
  return render(
    <CodeModeProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/" element={<Probe />} />
          <Route path="/:groupId" element={<Probe />} />
        </Routes>
      </MemoryRouter>
    </CodeModeProvider>
  )
}

describe('useLazyAppNavigation', () => {
  beforeEach(() => {
    mockRegistry.loadLazyGroup.mockReset()
    mockRegistry.preloadLazyGroup.mockReset()
    mockRegistry.loadLazyGroup.mockImplementation((groupId: GroupId) =>
      Promise.resolve(resultFor(groupId))
    )
  })

  it('redirects an empty route to the first registered group', async () => {
    renderNavigation('/')

    await waitFor(() => {
      expect(screen.getByTestId('state')).toHaveAttribute('data-location', '/alpha-framer')
    })

    await waitFor(() => {
      expect(screen.getByTestId('state')).toHaveAttribute('data-current-group-id', 'alpha-framer')
    })
    expect(mockRegistry.loadLazyGroup).toHaveBeenCalledWith('alpha-framer')
  })

  it('keeps the latest group visible when an earlier load resolves after rapid navigation', async () => {
    const alpha = deferred<ReturnType<typeof resultFor>>()
    mockRegistry.loadLazyGroup.mockImplementation((groupId: GroupId) => {
      if (groupId === 'alpha-framer') return alpha.promise
      return Promise.resolve(resultFor(groupId))
    })

    renderNavigation('/alpha-framer')

    await waitFor(() => {
      expect(mockRegistry.loadLazyGroup).toHaveBeenCalledWith('alpha-framer')
    })

    fireEvent.click(screen.getByRole('button', { name: 'beta' }))

    await waitFor(() => {
      expect(screen.getByTestId('state')).toHaveAttribute('data-current-group', 'beta-framer')
    })

    await act(async () => {
      alpha.resolve(resultFor('alpha-framer'))
      await alpha.promise
    })

    expect(screen.getByTestId('state')).toHaveAttribute('data-current-group', 'beta-framer')
    expect(screen.getByTestId('state')).toHaveAttribute('data-current-group-id', 'beta-framer')
  })

  it('syncs code mode from a CSS group in the URL', async () => {
    renderNavigation('/beta-css?animation=beta__scale')

    await waitFor(() => {
      expect(screen.getByTestId('state')).toHaveAttribute('data-mode', 'CSS')
    })

    expect(screen.getByTestId('state')).toHaveAttribute('data-filter', 'beta__scale')
  })

  it('preloads adjacent groups after the current group resolves', async () => {
    renderNavigation('/beta-framer')

    await waitFor(() => {
      expect(screen.getByTestId('state')).toHaveAttribute('data-current-group-id', 'beta-framer')
    })

    await waitFor(() => {
      expect(mockRegistry.preloadLazyGroup).toHaveBeenCalledWith('alpha-framer')
    })
    await waitFor(() => {
      expect(mockRegistry.preloadLazyGroup).toHaveBeenCalledWith('beta-css')
    })
  })
})
