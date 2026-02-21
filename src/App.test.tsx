import App from '@/App'
import { CodeModeProvider } from '@/contexts/CodeModeContext'
import { render, screen, waitFor, within } from '@testing-library/react'
import type { HTMLAttributes, ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'

const mockedCategories = vi.hoisted(() => [
  {
    id: 'base-effects',
    title: 'Base effects',
    groups: [
      { id: 'text-effects-framer', title: 'Text effects (Framer)', animations: [] },
      { id: 'text-effects-css', title: 'Text effects (CSS)', animations: [] },
    ],
  },
  {
    id: 'dialogs',
    title: 'Dialog & Modal Animations',
    groups: [
      { id: 'modal-base-framer', title: 'Base modal animations (Framer)', animations: [] },
      { id: 'modal-base-css', title: 'Base modal animations (CSS)', animations: [] },
    ],
  },
])

vi.mock('@/hooks/useAnimations', () => ({
  useAnimations: () => ({
    categories: mockedCategories,
    isLoading: false,
    error: null,
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
      <button type="button">Replay</button>
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

const renderApp = () => {
  return render(
    <CodeModeProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/:groupId" element={<App />} />
        </Routes>
      </MemoryRouter>
    </CodeModeProvider>
  )
}

const waitForCurrentMobileGroupTitle = async () => {
  await waitFor(() => {
    const mobileTitle = document.querySelector('.pf-mobile-header__title')
    expect(mobileTitle).toBeInTheDocument()
    expect(mobileTitle).toHaveTextContent(/Text effects \(Framer\)/i)
  }, { timeout: 15000 })
}

describe('App', () => {
  it('renders the current group with animation cards', async () => {
    renderApp()

    // Should show first group (text-effects-framer) by default
    await waitForCurrentMobileGroupTitle()

    // Should have animation cards with replay buttons
    const replayButtons = await screen.findAllByRole('button', { name: /replay/i }, { timeout: 15000 })
    expect(replayButtons.length).toBeGreaterThan(0)
  }, 20000)

  it('shows only the current group, not other groups', async () => {
    renderApp()

    // Wait for initial load
    await waitForCurrentMobileGroupTitle()

    // Should not show groups from other categories in main content
    // (App shows one group at a time now)
    expect(
      screen.queryByRole('heading', { level: 2, name: /Base modal animations/i })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 2, name: /Progress bars/i })
    ).not.toBeInTheDocument()
  }, 20000)

  it('shows active state for current category in sidebar', async () => {
    renderApp()

    // Wait for initial load
    await waitForCurrentMobileGroupTitle()

    const categoryButtons = Array.from(
      document.querySelectorAll<HTMLButtonElement>('.pf-sidebar .pf-sidebar__link--category')
    )
    const baseButton = categoryButtons.find((button) => /Base effects/i.test(button.textContent ?? ''))
    const dialogsButton = categoryButtons.find((button) =>
      /Dialog & Modal Animations/i.test(button.textContent ?? '')
    )

    // Should have active class
    expect(baseButton).toBeDefined()
    expect(dialogsButton).toBeDefined()
    expect(baseButton?.className).toContain('pf-sidebar__link--active')

    // Should not have active class
    expect(dialogsButton?.className).not.toContain('pf-sidebar__link--active')
  }, 20000)

  it('displays current group title in mobile header', async () => {
    renderApp()

    // Wait for initial load
    await waitForCurrentMobileGroupTitle()

    // Mobile header should show current group title
    const mobileHeader = document.querySelector('.pf-mobile-header') as HTMLElement
    expect(within(mobileHeader).getByText(/Text effects/i)).toBeInTheDocument()
  }, 20000)
})
