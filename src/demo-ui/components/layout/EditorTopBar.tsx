/**
 * EditorTopBar Component
 * Top bar with sidebar toggle, current group title, theme/accent menu, and GitHub link.
 */

import type React from 'react'
import { useShallow } from 'zustand/react/shallow'
import { githubIcon } from '@/assets'
import { useAppNavigation } from '@/contexts/AppNavigationContext'
import { useLayoutStore, type LayoutStore } from '@/demo-ui/stores/layoutStore'
import { useIsMobile } from '@/demo-ui/hooks/useMediaQuery'
import { Button } from '@/demo-ui/components/ui/Button'
import { DropdownMenu } from '@/demo-ui/components/ui/DropdownMenu'
import { useViewMenuItems } from '@/demo-ui/components/layout/useViewMenuItems'

/** SVG icon for the left sidebar panel toggle. */
function PanelLeftIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  )
}

/** SVG icon for the right inspector panel toggle. */
function PanelRightIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="15" y1="3" x2="15" y2="21" />
    </svg>
  )
}

/** Top bar with sidebar toggle, group title, view menu, and GitHub link. */
export const EditorTopBar: React.FC = () => {
  const {
    leftPanelVisible,
    toggleLeftPanel,
    rightPanelVisible,
    toggleRightPanel,
    theme,
    setTheme,
    accent,
    setAccent,
    reducedMotion,
    setReducedMotion,
  } = useLayoutStore(
    useShallow((state: LayoutStore) => ({
      leftPanelVisible: state.showLeftPanel,
      toggleLeftPanel: state.toggleLeftPanel,
      rightPanelVisible: state.showRightPanel,
      toggleRightPanel: state.toggleRightPanel,
      theme: state.theme,
      setTheme: state.setTheme,
      accent: state.accent,
      setAccent: state.setAccent,
      reducedMotion: state.reducedMotion,
      setReducedMotion: state.setReducedMotion,
    }))
  )

  const { currentGroup } = useAppNavigation()
  const viewItems = useViewMenuItems(theme, setTheme, accent, setAccent, reducedMotion, setReducedMotion)
  const isMobile = useIsMobile()

  const leftToggleClass = leftPanelVisible
    ? 'bg-accent/10 text-accent'
    : 'text-text-secondary hover:text-text-primary hover:bg-[var(--bg-hover)]'
  const rightToggleClass = rightPanelVisible
    ? 'bg-accent/10 text-accent'
    : 'text-text-secondary hover:text-text-primary hover:bg-[var(--bg-hover)]'

  return (
    <div
      className="glass-panel h-12 flex items-center px-4 z-40 shrink-0 select-none relative mb-2 rounded-xl mx-2 mt-2 pf-topbar"
      data-testid="top-bar"
      data-app-shell="bar"
    >
      {/* Left: panel toggle + view menu */}
      <div className="flex items-center gap-4 shrink-0">
        <Button
          variant={leftPanelVisible && !isMobile ? 'primary' : 'ghost'}
          size="icon"
          onClick={toggleLeftPanel}
          ariaLabel="Toggle Navigation"
          data-testid="toggle-left-panel"
          className={`p-1.5 ${!isMobile ? leftToggleClass : 'text-text-secondary hover:text-text-primary hover:bg-[var(--bg-hover)]'}`}
        >
          <PanelLeftIcon />
        </Button>
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <DropdownMenu
            trigger={
              <span className="flex items-center gap-1" data-testid="menu-view">
                VIEW
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            }
            className="btn btn-ghost btn-sm px-2 py-1 font-medium tracking-wide"
            items={viewItems}
          />
        </div>
      </div>

      {/* Center: current group title + count */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
        {currentGroup != null ? (
          <span
            className="text-sm font-semibold text-[var(--text-primary)] tracking-tight"
            data-testid="topbar-title"
          >
            {currentGroup.title}
            <span className="ml-1.5 text-xs font-normal text-text-tertiary">
              {currentGroup.animations.length}
            </span>
          </span>
        ) : (
          <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">
            Animation Catalog
          </span>
        )}
      </div>

      {/* Right: inspector toggle + GitHub link */}
      <div className="flex items-center gap-2 shrink-0 ml-auto">
        <Button
          variant={rightPanelVisible ? 'primary' : 'ghost'}
          size="icon"
          onClick={toggleRightPanel}
          ariaLabel="Toggle Inspector"
          data-testid="toggle-right-panel"
          className={`p-1.5 ${rightToggleClass}`}
        >
          <PanelRightIcon />
        </Button>
        <a
          href={
            import.meta.env.VITE_GITHUB_URL ??
            'https://github.com/michael-haufschild-gib/animations'
          }
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost btn-icon text-text-secondary hover:text-text-primary"
          aria-label="View source on GitHub"
          data-testid="github-link"
        >
          <img src={githubIcon} alt="GitHub" className="w-[22px] h-[22px] invert" />
        </a>
      </div>
    </div>
  )
}
