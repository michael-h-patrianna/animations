import App from '@/App'
import { CodeModeProvider } from '@/contexts/CodeModeContext'
import { _resetScrollLockState } from '@/hooks/useScrollLock'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'

afterEach(() => {
  cleanup()
  _resetScrollLockState()
  document.body.style.overflow = ''
})

const renderApp = (initialRoute = '/') =>
  render(
    <CodeModeProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/:groupId?" element={<App />} />
        </Routes>
      </MemoryRouter>
    </CodeModeProvider>
  )

describe('App', () => {
  it('renders desktop sidebar and mobile header', () => {
    renderApp()

    // Desktop sidebar + mobile drawer both render AppSidebar, so there are 2
    const sidebars = screen.getAllByTestId('sidebar')
    expect(sidebars.length).toBe(2)

    expect(screen.getByTestId('mobile-header')).toBeVisible()
  })

  it('renders code mode switch with Framer active by default', () => {
    renderApp()

    // Two code mode switches: one in sidebar, one in drawer
    const switches = screen.getAllByTestId('code-mode-switch')
    expect(switches.length).toBe(2)

    // Desktop sidebar switch should show Framer as active
    const framerButtons = screen.getAllByTestId('code-mode-framer')
    expect(framerButtons[0]).toHaveAttribute('aria-pressed', 'true')
  })

  it('renders the mobile drawer in hidden state initially', () => {
    renderApp()

    const drawer = screen.getByRole('dialog', { hidden: true })
    expect(drawer).toHaveAttribute('hidden')
  })

  it('renders animation cards from the real catalog', () => {
    renderApp()

    // The real registry has 100+ animations; a framer group alone has 5+.
    // If this drops below 5, something is broken in the import chain.
    const cardTitles = screen.getAllByTestId('card-title')
    expect(cardTitles.length).toBeGreaterThanOrEqual(5)
  })

  it('renders with a specific group route parameter', () => {
    renderApp('/standard-effects-framer')

    // Should show the group in the mobile header
    expect(screen.getByTestId('mobile-header')).toBeVisible()
  })

  it('renders GitHub link in the mobile header with security attributes', () => {
    renderApp()

    const githubLinks = screen.getAllByRole('link', { name: 'View source on GitHub' })
    expect(githubLinks.length).toBe(1)
    expect(githubLinks[0]).toHaveAttribute('target', '_blank')
    expect(githubLinks[0]).toHaveAttribute('rel', 'noopener noreferrer')
    expect(githubLinks[0]).toHaveAttribute('href', expect.stringContaining('github.com'))
  })

  it('opens drawer when hamburger is clicked and closes it', () => {
    renderApp()

    // Drawer should start hidden
    const drawer = screen.getByTestId('mobile-drawer')
    expect(drawer).toHaveAttribute('hidden')

    // Click hamburger to open — use testid to avoid O(n) role scan across 100+ cards
    fireEvent.click(screen.getByTestId('hamburger-button'))

    // Drawer should now be visible
    expect(drawer).not.toHaveAttribute('hidden')

    // Click close button
    fireEvent.click(screen.getByTestId('drawer-close'))

    // Drawer should be hidden again
    expect(drawer).toHaveAttribute('hidden')
  })

  it('closes drawer when Escape key is pressed', () => {
    renderApp()

    const drawer = screen.getByTestId('mobile-drawer')

    // Open drawer
    fireEvent.click(screen.getByTestId('hamburger-button'))
    expect(drawer).not.toHaveAttribute('hidden')

    // Press Escape
    fireEvent.keyDown(window, { key: 'Escape' })

    // Drawer should close
    expect(drawer).toHaveAttribute('hidden')
  })

  it('locks scroll when drawer is open and restores on close', () => {
    document.body.style.overflow = ''
    renderApp()

    // Open drawer
    fireEvent.click(screen.getByTestId('hamburger-button'))
    expect(document.body.style.overflow).toBe('hidden')

    // Close drawer
    fireEvent.click(screen.getByTestId('drawer-close'))
    expect(document.body.style.overflow).toBe('')
  })

  it('renders different animation titles for different route groups', () => {
    // Render at specific group route
    const { unmount } = renderApp('/standard-effects-framer')
    const firstGroupTitles = screen.getAllByTestId('card-title').map((el) => el.textContent)

    unmount()

    // Render at a different group
    renderApp('/modal-base-framer')
    const secondGroupTitles = screen.getAllByTestId('card-title').map((el) => el.textContent)

    // Both groups should have multiple cards with different content
    expect(firstGroupTitles.length).toBeGreaterThanOrEqual(2)
    expect(secondGroupTitles.length).toBeGreaterThanOrEqual(2)
    expect(firstGroupTitles).not.toEqual(secondGroupTitles)
  })

  it('framer and css variants of same group show same number of cards', () => {
    const { unmount: u1 } = renderApp('/standard-effects-framer')
    const framerCount = screen.getAllByTestId('card-title').length
    u1()

    renderApp('/standard-effects-css')
    const cssCount = screen.getAllByTestId('card-title').length

    // Both tech variants should render the same number of animations
    expect(framerCount).toBe(cssCount)
    expect(framerCount).toBeGreaterThanOrEqual(2)
  })

  it('renders group section with correct data-testid', () => {
    renderApp('/standard-effects-framer')

    // AnimatePresence may set opacity: 0 during initial animation, so check DOM presence
    const section = screen.getByTestId('group-section-group-standard-effects-framer')
    expect(section).toBeInTheDocument()
  })

  it('handles animation filter in URL', () => {
    renderApp('/standard-effects-framer?animation=standard-effects__bounce')

    // Filter banner is rendered (AnimatePresence may affect visibility)
    const filterBanner = screen.getByTestId('filter-banner')
    expect(filterBanner).toBeInTheDocument()
    expect(filterBanner).toHaveTextContent('standard-effects__bounce')
  })
})
