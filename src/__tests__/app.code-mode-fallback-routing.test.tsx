import App from '@/App'
import { CodeModeProvider } from '@/contexts/CodeModeContext'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { HTMLAttributes, ReactNode } from 'react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

const mockedCategories = vi.hoisted(() => [
  {
    id: 'category-a',
    title: 'Category A',
    groups: [
      {
        id: 'alpha-framer',
        title: 'Alpha (Framer only)',
        tech: 'framer',
        demo: 'Alpha demos',
        animations: [],
      },
    ],
  },
  {
    id: 'category-b',
    title: 'Category B',
    groups: [
      {
        id: 'beta-framer',
        title: 'Beta (Framer)',
        tech: 'framer',
        demo: 'Beta demos',
        animations: [],
      },
      {
        id: 'beta-css',
        title: 'Beta (CSS)',
        tech: 'css',
        demo: 'Beta demos',
        animations: [],
      },
    ],
  },
])

vi.mock('@/hooks/useAnimations', () => ({
  useAnimations: () => ({
    categories: mockedCategories,
    isLoading: false,
    error: null,
    refreshAnimations: vi.fn(),
  }),
}))

vi.mock('@/hooks/useKeyboardShortcut', () => ({
  useKeyboardShortcut: () => undefined,
}))

vi.mock('@/hooks/useScrollLock', () => ({
  useScrollLock: () => undefined,
}))

vi.mock('@/hooks/useScrollToGroup', () => ({
  useScrollToGroup: () => undefined,
}))

vi.mock('@/components/ui/catalog', () => ({
  GroupSection: ({
    group,
    elementId,
  }: {
    group: { title: string }
    elementId?: string
  }) => (
    <section id={elementId}>
      <h2>{group.title}</h2>
    </section>
  ),
}))

vi.mock('motion/react', () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
  LazyMotion: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

vi.mock('motion/react-m', () => ({
  div: ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
}))

const LocationProbe = () => {
  const location = useLocation()
  return <div data-testid="location-path">{location.pathname}</div>
}

const TestScreen = () => (
  <>
    <LocationProbe />
    <App />
  </>
)

const renderRoutedApp = (initialEntry: string) =>
  render(
    <CodeModeProvider>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/" element={<TestScreen />} />
          <Route path="/:groupId" element={<TestScreen />} />
        </Routes>
      </MemoryRouter>
    </CodeModeProvider>
  )

describe('App code mode fallback routing', () => {
  it('does not jump to another category when counterpart variant is missing', async () => {
    const user = userEvent.setup()
    renderRoutedApp('/alpha-framer')

    await waitFor(() => {
      expect(screen.getByTestId('location-path')).toHaveTextContent('/alpha-framer')
    })

    await user.click(screen.getByRole('button', { name: /Open menu/i }))
    await user.click(screen.getByRole('button', { name: 'CSS' }))

    await waitFor(() => {
      expect(screen.getByTestId('location-path')).toHaveTextContent('/alpha-framer')
      expect(screen.getByTestId('location-path')).not.toHaveTextContent('/beta-css')
    })
  })
})
