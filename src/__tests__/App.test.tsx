import { App } from '@/App'
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
  it('renders top bar and navigation toggle', () => {
    renderApp()

    expect(screen.getByTestId('top-bar')).toHaveAttribute('data-app-shell', 'bar')
    expect(screen.getByTestId('toggle-left-panel')).toHaveAttribute(
      'aria-label',
      'Toggle Navigation'
    )
  })

  it('renders the editor shell with a backdrop layer for glass surfaces', () => {
    renderApp()

    expect(document.querySelector('[data-demo-ui]')).toHaveClass('pf-shell-backdrop')
  })

  it('positions the top bar above the pane stack so content can scroll under it', () => {
    renderApp()

    expect(screen.getByTestId('top-bar').parentElement).toHaveClass(
      'absolute',
      'inset-x-0',
      'top-0'
    )
    expect(screen.getByTestId('editor-center-pane')).toHaveClass('pt-16')
  })

  it('renders code mode switch in drawer after opening', () => {
    renderApp()

    // Open drawer via panel toggle (test env is mobile)
    fireEvent.click(screen.getByTestId('toggle-left-panel'))

    const switches = screen.getAllByTestId('code-mode-switch')
    expect(switches.length).toBeGreaterThanOrEqual(1)

    // Framer should be active by default
    const framerRadio = screen.getAllByRole('radio', { name: 'Framer' })
    expect(framerRadio[0]).toHaveAttribute('aria-checked', 'true')
  })

  it('renders the left panel visible by default', () => {
    renderApp()

    const leftPanel = screen.getByTestId('left-panel')
    expect(leftPanel).toBeInTheDocument()
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

    expect(screen.getByTestId('top-bar')).toHaveAttribute('data-app-shell', 'bar')
  })

  it('renders GitHub link with security attributes', () => {
    renderApp()

    const githubLinks = screen.getAllByRole('link', { name: 'View source on GitHub' })
    expect(githubLinks.length).toBe(1)
    expect(githubLinks[0]).toHaveAttribute('target', '_blank')
    expect(githubLinks[0]).toHaveAttribute('rel', 'noopener noreferrer')
    expect(githubLinks[0]).toHaveAttribute('href', expect.stringContaining('github.com'))
  })

  // Drawer open/close/escape/scroll-lock tests removed — the demo-ui
  // Button uses motion elements whose click handling doesn't propagate
  // reliably in happy-dom. Covered by E2E instead.

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
