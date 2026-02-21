import { githubIcon } from '@/assets'
import { AppSidebar } from '@/components/ui/AppSidebar'
import { CodeModeSwitch } from '@/components/ui/CodeModeSwitch'
import { GroupSection } from '@/components/ui/catalog'
import { type CodeMode, useCodeMode } from '@/contexts/CodeModeContext'
import { useAnimations } from '@/hooks/useAnimations'
import { useGroupInitialization } from '@/hooks/useGroupInitialization'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import { useScrollLock } from '@/hooks/useScrollLock'
import { useScrollToGroup } from '@/hooks/useScrollToGroup'
import type { Group } from '@/types/animation'
import { AnimatePresence, LazyMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './App.css'

const direction = 0

const variants = {
  enter: (currentDirection: number) => ({
    x: currentDirection > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (currentDirection: number) => ({
    zIndex: 0,
    x: currentDirection < 0 ? 1000 : -1000,
    opacity: 0,
  }),
}

const loadFeatures = () => import('./features').then((res) => res.default)

const inferCodeModeFromGroupId = (value: string): CodeMode | null => {
  if (value.endsWith('-css')) return 'CSS'
  if (value.endsWith('-framer')) return 'Framer'
  return null
}

const suffixForMode = (mode: CodeMode) => (mode === 'CSS' ? '-css' : '-framer')

const pickGroupForMode = (groups: Group[], mode: CodeMode) =>
  groups.find((group) => group.id.endsWith(suffixForMode(mode))) ?? groups[0]

const resolveModeGroupId = (allGroups: Group[], currentGroupId: string, mode: CodeMode): string | undefined => {
  const baseGroupId = currentGroupId.replace(/-(?:framer|css)$/, '')
  const preferredGroupId = `${baseGroupId}${suffixForMode(mode)}`

  return allGroups.some((group) => group.id === preferredGroupId) ? preferredGroupId : undefined
}

const useCodeModeRouting = ({
  codeMode,
  currentGroupId,
  allGroups,
  onGroupSelect,
  setCodeMode,
}: {
  codeMode: CodeMode
  currentGroupId: string
  allGroups: Group[]
  onGroupSelect: (groupId: string) => void
  setCodeMode: (mode: CodeMode) => void
}) => {
  useEffect(() => {
    const inferredMode = inferCodeModeFromGroupId(currentGroupId)
    if (!inferredMode || inferredMode === codeMode) return
    setCodeMode(inferredMode)
  }, [codeMode, currentGroupId, setCodeMode])

  return useCallback(
    (mode: CodeMode) => {
      setCodeMode(mode)
      if (!currentGroupId) return

      const nextGroupId = resolveModeGroupId(allGroups, currentGroupId, mode)
      if (nextGroupId && nextGroupId !== currentGroupId) {
        onGroupSelect(nextGroupId)
      }
    },
    [allGroups, currentGroupId, onGroupSelect, setCodeMode]
  )
}

type MobileHeaderProps = {
  appBarRef: RefObject<HTMLDivElement | null>
  currentGroup: Group | undefined
  onOpenDrawer: () => void
}

const MobileHeader = ({ appBarRef, currentGroup, onOpenDrawer }: MobileHeaderProps) => (
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

type GroupContentProps = {
  currentGroupId: string
  currentGroup: Group | undefined
  isLoading: boolean
}

const GroupContent = ({ currentGroupId, currentGroup, isLoading }: GroupContentProps) => (
  <main className="pf-catalog">
    {isLoading ? (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-secondary">Loading animations...</div>
      </div>
    ) : (
      <AnimatePresence initial={false} custom={direction} mode="wait">
        {currentGroup && (
          <m.div
            key={currentGroupId}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring' as const, stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            style={{ width: '100%' }}
          >
            <GroupSection group={currentGroup} elementId={`group-${currentGroup.id}`} />
          </m.div>
        )}
      </AnimatePresence>
    )}
  </main>
)

type MobileDrawerProps = {
  categories: ReturnType<typeof useAnimations>['categories']
  codeMode: CodeMode
  currentGroupId: string
  isDrawerOpen: boolean
  onCloseDrawer: () => void
  onCodeModeSelect: (mode: CodeMode) => void
  onCategorySelect: (categoryId: string) => void
  onGroupSelect: (groupId: string) => void
}

const MobileDrawer = ({
  categories,
  codeMode,
  currentGroupId,
  isDrawerOpen,
  onCloseDrawer,
  onCodeModeSelect,
  onCategorySelect,
  onGroupSelect,
}: MobileDrawerProps) => (
  <div
    id="pf-sidebar-drawer"
    role="dialog"
    aria-modal="true"
    aria-hidden={!isDrawerOpen}
    hidden={!isDrawerOpen}
    className={`pf-drawer ${isDrawerOpen ? 'is-open' : ''}`}
  >
    <div className="pf-drawer__overlay" onClick={onCloseDrawer} />
    <div className="pf-drawer__panel">
      <div className="pf-drawer__panel-header">
        <button type="button" className="pf-hamburger" aria-label="Close menu" onClick={onCloseDrawer}>
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
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <AppSidebar
        categories={categories}
        codeMode={codeMode}
        currentGroupId={currentGroupId}
        onCategorySelect={onCategorySelect}
        onGroupSelect={onGroupSelect}
        topContent={<CodeModeSwitch onModeSelect={onCodeModeSelect} />}
        className="pf-sidebar"
      />
    </div>
  </div>
)

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void | Promise<void> }) => (
  <div className="flex min-h-screen items-center justify-center p-8">
    <div className="text-center">
      <h1 className="text-text-primary font-display text-2xl mb-4">Error Loading Animations</h1>
      <p className="text-text-secondary mb-4">{error}</p>
      <button
        type="button"
        onClick={() => {
          void onRetry()
        }}
        className="px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-primary/90"
      >
        Retry
      </button>
    </div>
  </div>
)

type AppLayoutProps = {
  categories: ReturnType<typeof useAnimations>['categories']
  codeMode: CodeMode
  currentGroup: Group | undefined
  currentGroupId: string
  isDrawerOpen: boolean
  isLoading: boolean
  appBarRef: RefObject<HTMLDivElement | null>
  onOpenDrawer: () => void
  onCloseDrawer: () => void
  onCodeModeSelect: (mode: CodeMode) => void
  onCategorySelect: (categoryId: string) => void
  onCategorySelectMobile: (categoryId: string) => void
  onGroupSelect: (groupId: string) => void
  onGroupSelectMobile: (groupId: string) => void
}

const AppLayout = ({
  categories,
  codeMode,
  currentGroup,
  currentGroupId,
  isDrawerOpen,
  isLoading,
  appBarRef,
  onOpenDrawer,
  onCloseDrawer,
  onCodeModeSelect,
  onCategorySelect,
  onCategorySelectMobile,
  onGroupSelect,
  onGroupSelectMobile,
}: AppLayoutProps) => (
  <LazyMotion features={loadFeatures} strict>
    <div className="min-h-screen">
      <MobileHeader appBarRef={appBarRef} currentGroup={currentGroup} onOpenDrawer={onOpenDrawer} />
      <div className="pf-main">
        <AppSidebar
          categories={categories}
          codeMode={codeMode}
          currentGroupId={currentGroupId}
          onCategorySelect={onCategorySelect}
          onGroupSelect={onGroupSelect}
          topContent={<CodeModeSwitch onModeSelect={onCodeModeSelect} />}
        />
        <GroupContent currentGroupId={currentGroupId} currentGroup={currentGroup} isLoading={isLoading} />
      </div>
      <MobileDrawer
        categories={categories}
        codeMode={codeMode}
        currentGroupId={currentGroupId}
        isDrawerOpen={isDrawerOpen}
        onCloseDrawer={onCloseDrawer}
        onCodeModeSelect={onCodeModeSelect}
        onCategorySelect={onCategorySelectMobile}
        onGroupSelect={onGroupSelectMobile}
      />
    </div>
  </LazyMotion>
)

const App = () => {
  const { categories, isLoading, error, refreshAnimations } = useAnimations()
  const { codeMode, setCodeMode } = useCodeMode()
  const { groupId } = useParams<{ groupId?: string }>()
  const navigate = useNavigate()
  const [currentGroupId, setCurrentGroupId] = useState<string>('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const appBarRef = useRef<HTMLDivElement | null>(null)

  const allGroups: Group[] = categories.flatMap((category) => category.groups)
  const currentGroup = allGroups.find((group) => group.id === currentGroupId)

  useGroupInitialization({
    allGroups,
    groupId,
    currentGroupId,
    setCurrentGroupId,
    navigateToGroup: (id, options) => navigate(`/${id}`, options),
  })

  const handleGroupSelect = useCallback(
    (selectedGroupId: string) => {
      if (selectedGroupId === currentGroupId) return
      navigate(`/${selectedGroupId}`)
    },
    [currentGroupId, navigate]
  )

  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      const category = categories.find((candidate) => candidate.id === categoryId)
      if (category && category.groups.length > 0) handleGroupSelect(pickGroupForMode(category.groups, codeMode).id)
    },
    [categories, codeMode, handleGroupSelect]
  )

  const handleCodeModeSelect = useCodeModeRouting({ codeMode, currentGroupId, allGroups, onGroupSelect: handleGroupSelect, setCodeMode })

  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])
  const openDrawer = useCallback(() => setIsDrawerOpen(true), [])
  const handleCategorySelectMobile = useCallback((categoryId: string) => { handleCategorySelect(categoryId); closeDrawer() }, [handleCategorySelect, closeDrawer])
  const handleGroupSelectMobile = useCallback((selectedGroupId: string) => { handleGroupSelect(selectedGroupId); closeDrawer() }, [handleGroupSelect, closeDrawer])

  useKeyboardShortcut({ isOpen: isDrawerOpen, onClose: closeDrawer })
  useScrollLock(isDrawerOpen)
  useScrollToGroup({ currentGroupId, appBarRef })

  if (error) return <ErrorState error={error} onRetry={refreshAnimations} />

  return (
    <AppLayout
      categories={categories}
      codeMode={codeMode}
      currentGroup={currentGroup}
      currentGroupId={currentGroupId}
      isDrawerOpen={isDrawerOpen}
      isLoading={isLoading}
      appBarRef={appBarRef}
      onOpenDrawer={openDrawer}
      onCloseDrawer={closeDrawer}
      onCodeModeSelect={handleCodeModeSelect}
      onCategorySelect={handleCategorySelect}
      onCategorySelectMobile={handleCategorySelectMobile}
      onGroupSelect={handleGroupSelect}
      onGroupSelectMobile={handleGroupSelectMobile}
    />
  )
}

export default App
