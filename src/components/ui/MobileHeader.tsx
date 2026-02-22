import { githubIcon } from '@/assets'
import type { Group } from '@/types/animation'
import { type RefObject } from 'react'

/**
 *
 */
export function MobileHeader({
  currentGroup,
  appBarRef,
  onOpenDrawer,
}: {
  currentGroup: Group | undefined
  appBarRef: RefObject<HTMLDivElement | null>
  onOpenDrawer: () => void
}) {
  return (
    <div className="pf-mobile-header" data-app-shell="bar" ref={appBarRef}>
      <button
        type="button"
        className="pf-hamburger"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-controls="pf-sidebar-drawer"
        onClick={onOpenDrawer}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      {currentGroup && (
        <span className="pf-mobile-header__title">
          {currentGroup.title} ({currentGroup.animations.length})
        </span>
      )}
      <a
        href="https://github.com/michael-haufschild-gib/animations"
        target="_blank"
        rel="noopener noreferrer"
        className="pf-github-link"
        aria-label="View source on GitHub"
      >
        <img src={githubIcon} alt="GitHub" className="pf-github-icon" />
      </a>
    </div>
  )
}
