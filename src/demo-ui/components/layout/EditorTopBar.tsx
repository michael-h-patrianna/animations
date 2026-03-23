/**
 * EditorTopBar Component
 * Top bar with sidebar toggle, current group title, theme/accent menu, and GitHub link.
 */

import type React from 'react'
import { useShallow } from 'zustand/react/shallow'
import { githubIcon } from '@/assets'
import { useAnimations } from '@/hooks/useAnimations'
import { useAppNavigation } from '@/hooks/useAppNavigation'
import { useLayoutStore, type LayoutStore } from '../../stores/layoutStore'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { Button } from '../ui/Button'
import { DropdownMenu } from '../ui/DropdownMenu'
import { useViewMenuItems } from './useViewMenuItems'

/** Props for the EditorTopBar component. */
interface EditorTopBarProps {
  /** Called when the panel toggle is clicked on mobile (opens the drawer). */
  onOpenDrawer?: () => void
}

/** SVG icon for the sidebar panel toggle. */
function PanelIcon() {
  return (
    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
      <line x1='9' y1='3' x2='9' y2='21' />
    </svg>
  )
}

/** Top bar with sidebar toggle, group title, view menu, and GitHub link. */
export const EditorTopBar: React.FC<EditorTopBarProps> = ({ onOpenDrawer }) => {
  const { leftPanelVisible, toggleLeftPanel, theme, setTheme, accent, setAccent } = useLayoutStore(
    useShallow((state: LayoutStore) => ({
      leftPanelVisible: state.showLeftPanel, toggleLeftPanel: state.toggleLeftPanel,
      theme: state.theme, setTheme: state.setTheme,
      accent: state.accent, setAccent: state.setAccent,
    })),
  )

  const { categories } = useAnimations()
  const { currentGroup } = useAppNavigation(categories)
  const viewItems = useViewMenuItems(theme, setTheme, accent, setAccent)
  const isMobile = useIsMobile()
  const toggleClass = leftPanelVisible ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:text-text-primary hover:bg-[var(--bg-hover)]'

  const handlePanelToggle = () => {
    if (isMobile && onOpenDrawer != null) {
      onOpenDrawer()
    } else {
      toggleLeftPanel()
    }
  }

  return (
    <div className='glass-panel h-12 flex items-center px-4 z-40 shrink-0 select-none relative mb-2 rounded-xl mx-2 mt-2' data-testid='top-bar' data-app-shell='bar'>
      {/* Left: panel toggle + view menu */}
      <div className='flex items-center gap-4 shrink-0'>
        <Button variant={leftPanelVisible && !isMobile ? 'primary' : 'ghost'} size='icon' onClick={handlePanelToggle} ariaLabel='Toggle Navigation' data-testid='toggle-left-panel' className={`p-1.5 ${!isMobile ? toggleClass : 'text-text-secondary hover:text-text-primary hover:bg-[var(--bg-hover)]'}`}>
          <PanelIcon />
        </Button>
        <div className='flex items-center gap-2 text-xs text-text-secondary'>
          <DropdownMenu trigger={<Button variant='ghost' size='sm' data-testid='menu-view' className='px-2 py-1 font-medium tracking-wide'>VIEW</Button>} items={viewItems} />
        </div>
      </div>

      {/* Center: current group title + count */}
      <div className='absolute left-1/2 transform -translate-x-1/2 flex items-center'>
        {currentGroup != null ? (
          <span className='text-sm font-semibold text-[var(--text-primary)]' data-testid='topbar-title'>
            {currentGroup.title} ({currentGroup.animations.length})
          </span>
        ) : (
          <span className='text-xs font-bold text-text-secondary uppercase tracking-widest'>Animation Catalog</span>
        )}
      </div>

      {/* Right: GitHub link */}
      <div className='flex items-center shrink-0 ml-auto'>
        <a
          href='https://github.com/michael-haufschild-gib/animations'
          target='_blank'
          rel='noopener noreferrer'
          className='pf-github-link'
          aria-label='View source on GitHub'
          data-testid='github-link'
        >
          <img src={githubIcon} alt='GitHub' className='pf-github-icon' />
        </a>
      </div>
    </div>
  )
}
