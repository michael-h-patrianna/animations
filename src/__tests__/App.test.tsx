import App from '@/App'
import { CodeModeProvider } from '@/contexts/CodeModeContext'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

const renderApp = (initialRoute = '/') =>
  render(
    <CodeModeProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <App />
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
})
