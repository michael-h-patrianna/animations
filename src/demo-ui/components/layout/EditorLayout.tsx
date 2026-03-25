/**
 * EditorLayout Component
 * Three-panel layout: left explorer, center content, right inspector.
 * Glassmorphic UI with theme scoping via data attributes.
 */

import React, { Suspense } from 'react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { useShallow } from 'zustand/react/shallow'
import { useLayoutStore, type LayoutStore } from '@/demo-ui/stores/layoutStore'
import { EditorTopBar } from '@/demo-ui/components/layout/EditorTopBar'
import { EditorLeftPanel } from '@/demo-ui/components/layout/EditorLeftPanel'

const EditorRightPanel = React.lazy(() =>
  import('./EditorRightPanel').then((mod) => ({ default: mod.EditorRightPanel }))
)

interface EditorLayoutProps {
  children?: React.ReactNode
}

const TOP_BAR_OFFSET_PX = 64

const SPRING_CONFIG = {
  type: 'spring' as const,
  damping: 25,
  stiffness: 300,
  mass: 0.8,
}

const panelVariants = {
  hiddenLeft: { x: -340, opacity: 0, scale: 0.95 },
  visible: { x: 0, opacity: 1, scale: 1, transition: SPRING_CONFIG },
  hiddenRight: { x: 340, opacity: 0, scale: 0.95 },
}

const sidePanelOffsetStyle: React.CSSProperties = {
  marginTop: `${TOP_BAR_OFFSET_PX}px`,
  height: `calc(100% - ${TOP_BAR_OFFSET_PX}px)`,
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({ children }) => {
  const { leftPanelVisible, rightPanelVisible, theme, accent } = useLayoutStore(
    useShallow((state: LayoutStore) => ({
      leftPanelVisible: state.showLeftPanel,
      rightPanelVisible: state.showRightPanel,
      theme: state.theme,
      accent: state.accent,
    }))
  )

  return (
    <div
      data-demo-ui
      data-mode={theme}
      data-accent={accent}
      className="pf-shell-backdrop relative h-screen supports-[height:100dvh]:h-dvh w-screen overflow-hidden"
    >
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex flex-col h-full w-full pointer-events-none"
        style={{ color: 'var(--text-primary)' }}
      >
        <div className="pointer-events-auto absolute inset-x-0 top-0 z-50">
          <EditorTopBar />
        </div>

        <div className="flex flex-1 min-h-0 overflow-hidden relative p-2 gap-2">
          {/* Left Panel */}
          <AnimatePresence mode="popLayout">
            {leftPanelVisible && (
              <m.div
                initial="hiddenLeft"
                animate="visible"
                exit="hiddenLeft"
                variants={panelVariants}
                data-testid="left-panel"
                className="glass-panel rounded-xl h-full overflow-hidden w-80 pointer-events-auto flex flex-col relative z-20"
                style={sidePanelOffsetStyle}
              >
                <div className="w-full h-full overflow-hidden">
                  <EditorLeftPanel />
                </div>
              </m.div>
            )}
          </AnimatePresence>

          {/* Center Content */}
          <div
            className="flex-1 flex flex-col min-w-0 relative z-0 pointer-events-auto overflow-auto pt-16"
            data-testid="editor-center-pane"
            tabIndex={0}
          >
            {children}
          </div>

          {/* Right Panel */}
          <AnimatePresence mode="popLayout">
            {rightPanelVisible && (
              <m.div
                initial="hiddenRight"
                animate="visible"
                exit="hiddenRight"
                variants={panelVariants}
                data-testid="right-panel"
                className="glass-panel rounded-xl h-full overflow-hidden w-80 pointer-events-auto flex flex-col relative z-20"
                style={sidePanelOffsetStyle}
              >
                <div id="inspector-panel" className="w-full h-full overflow-hidden">
                  <Suspense fallback={null}>
                    <EditorRightPanel />
                  </Suspense>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </m.div>
    </div>
  )
}
