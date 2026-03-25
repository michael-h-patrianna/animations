import { App } from '@/App'
import { CodeModeProvider } from '@/contexts/CodeModeContext'
import { DEFAULT_ACCENT, DEFAULT_THEME, useLayoutStore } from '@/demo-ui/stores/layoutStore'
import demoUiStyles from '@/demo-ui/styles/index.css?raw'
import { _resetScrollLockState } from '@/hooks/useScrollLock'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

beforeEach(() => {
  useLayoutStore.setState({
    showLeftPanel: true,
    showRightPanel: false,
    theme: DEFAULT_THEME,
    accent: DEFAULT_ACCENT,
  })
})

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

    // eslint-disable-next-line testing-library/no-node-access -- checking demo-ui root element
    expect(document.querySelector('[data-demo-ui]')).toHaveClass('pf-shell-backdrop')
  })

  it('uses dark-blue theme with blue accent by default', () => {
    renderApp()

    // eslint-disable-next-line testing-library/no-node-access -- verifying app shell theme attributes
    const demoUiRoot = document.querySelector('[data-demo-ui]')
    expect(demoUiRoot).toHaveAttribute('data-mode', 'dark-blue')
    expect(demoUiRoot).toHaveAttribute('data-accent', 'blue')
  })

  it('defines a solid Tailwind border style in the shared demo-ui stylesheet', () => {
    expect(demoUiStyles).toContain('--tw-border-style: solid;')
  })

  it('positions the top bar above the pane stack so content can scroll under it', () => {
    renderApp()

    // eslint-disable-next-line testing-library/no-node-access -- verifying DOM structure
    expect(screen.getByTestId('top-bar').parentElement).toHaveClass(
      'absolute',
      'inset-x-0',
      'top-0'
    )
    expect(screen.getByTestId('editor-center-pane')).toHaveClass('pt-16')
  })

  it('renders code mode switch in the left panel', () => {
    renderApp()

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

  it('renders clickable left-panel group entries with pointer cursor affordance', async () => {
    renderApp()

    const firstGroupEntry = await screen.findByTestId('sidebar-group-standard-effects')
    expect(firstGroupEntry).toHaveClass('cursor-pointer')
  })

  it('renders animation cards from the real catalog', async () => {
    renderApp()

    const cardTitles = await screen.findAllByTestId('card-title')
    expect(cardTitles.length).toBeGreaterThanOrEqual(5)
  })

  it('shows the empty inspector message when the right panel is opened without a selection', async () => {
    renderApp('/collection-effects-framer')

    fireEvent.click(screen.getByTestId('toggle-right-panel'))

    expect(await screen.findByText('Select an animation')).toBeInTheDocument()
  })

  it('opens and populates the inspector when an animation card is selected', async () => {
    renderApp('/collection-effects-framer')

    const cardTitle = await screen.findByText('Coin Trail')
    fireEvent.click(cardTitle)

    expect(await screen.findByTestId('right-panel')).toBeInTheDocument()
    expect(await screen.findByText('Selected Animation')).toBeInTheDocument()
    expect(screen.getByTestId('prop-field-count')).toBeInTheDocument()
  })

  it('renders with a specific group route parameter', () => {
    renderApp('/standard-effects-framer')

    expect(screen.getByTestId('top-bar')).toHaveAttribute('data-app-shell', 'bar')
  })

  it('uses the topbar base group title in the sidebar', async () => {
    renderApp('/modal-orchestration-framer')

    const topbarTitle = await screen.findByTestId('topbar-title')
    const sidebarGroup = await screen.findByTestId('sidebar-group-modal-orchestration')
    const currentGroupTitle = topbarTitle.textContent
      ?.replace(/\s+\(\d+\)$/, '')
      .replace(/\s+\((?:Framer|CSS)\)$/, '')

    expect(currentGroupTitle).toBeTruthy()
    expect(sidebarGroup).toHaveTextContent(currentGroupTitle!)
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

  it('renders different animation titles for different route groups', async () => {
    // Render at specific group route
    const { unmount } = renderApp('/standard-effects-framer')
    const firstGroupTitles = (await screen.findAllByTestId('card-title')).map((el) => el.textContent)

    unmount()

    // Render at a different group
    renderApp('/modal-base-framer')
    const secondGroupTitles = (await screen.findAllByTestId('card-title')).map((el) => el.textContent)

    // Both groups should have multiple cards with different content
    expect(firstGroupTitles.length).toBeGreaterThanOrEqual(2)
    expect(secondGroupTitles.length).toBeGreaterThanOrEqual(2)
    expect(firstGroupTitles).not.toEqual(secondGroupTitles)
  })

  it('framer and css variants of same group show same number of cards', async () => {
    const { unmount: u1 } = renderApp('/standard-effects-framer')
    const framerCount = (await screen.findAllByTestId('card-title')).length
    u1()

    renderApp('/standard-effects-css')
    const cssCount = (await screen.findAllByTestId('card-title')).length

    // Both tech variants should render the same number of animations
    expect(framerCount).toBe(cssCount)
    expect(framerCount).toBeGreaterThanOrEqual(2)
  })

  it('renders group section with correct data-testid', async () => {
    renderApp('/standard-effects-framer')

    const section = await screen.findByTestId('group-section-group-standard-effects-framer')
    expect(section).toBeInTheDocument()
  })

  it('handles animation filter in URL', async () => {
    renderApp('/standard-effects-framer?animation=standard-effects__bounce')

    const filterBanner = await screen.findByTestId('filter-banner')
    expect(filterBanner).toBeInTheDocument()
    expect(filterBanner).toHaveTextContent('standard-effects__bounce')
  })
})
