import { EditorLayout } from '@/demo-ui/components/layout/EditorLayout'
import { LoadingSpinner } from '@/demo-ui/components/ui/LoadingSpinner'
import { GroupSection } from '@/components/ui/GroupSection'
import { AnimationInspectorProvider } from '@/contexts/AnimationInspectorContext'
import { AppNavigationProvider, useAppNavigation } from '@/contexts/AppNavigationContext'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { Suspense } from 'react'
import './App.css'

const fadeVariants = {
  enter: { opacity: 0 },
  center: { zIndex: 1, opacity: 1 },
  exit: { zIndex: 0, opacity: 0 },
}

/** Fallback UI while a group chunk is loading */
function GroupLoadingFallback() {
  return (
    <div className="flex min-h-[240px] items-center justify-center px-2 pb-2">
      <div className="glass-panel flex w-full max-w-md items-center justify-center gap-3 rounded-2xl border border-border-subtle bg-(--bg-surface)/35 px-5 py-6 text-text-secondary">
        <LoadingSpinner size={18} />
        <span className="text-sm font-medium">Loading animations...</span>
      </div>
    </div>
  )
}

/** App content that consumes navigation state from context. */
function AppContent() {
  const { currentGroupId, currentGroup, animationFilter, isLoading, error } = useAppNavigation()
  return (
    <AnimationInspectorProvider currentGroup={currentGroup}>
      <EditorLayout>
        <AnimatePresence initial={false} mode="wait">
          {currentGroup && (
            <m.div
              key={currentGroupId}
              variants={fadeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ opacity: { duration: 0.2 } }}
              style={{ width: '100%' }}
            >
              <Suspense fallback={<GroupLoadingFallback />}>
                <GroupSection
                  group={currentGroup}
                  elementId={`group-${currentGroup.id}`}
                  animationFilter={animationFilter}
                  isLoading={isLoading}
                  error={error}
                />
              </Suspense>
            </m.div>
          )}
        </AnimatePresence>

        {/* Show loading state when no group loaded yet */}
        {!currentGroup && isLoading && <GroupLoadingFallback />}

        {/* Show error state */}
        {error && !currentGroup && (
          <div className="flex min-h-[240px] items-center justify-center px-2 pb-2">
            <div className="w-full max-w-xl rounded-2xl border border-danger-border bg-(--bg-danger)/40 px-5 py-4 text-center">
              <h2 className="text-sm font-semibold text-text-danger">Failed to load animations</h2>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{error.message}</p>
            </div>
          </div>
        )}
      </EditorLayout>
    </AnimationInspectorProvider>
  )
}

/** Root application component with lazy-loaded groups. */
function App() {
  return (
    <AppNavigationProvider>
      <AppContent />
    </AppNavigationProvider>
  )
}

export { App }
