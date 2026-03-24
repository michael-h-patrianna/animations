/**
 * EditorRightPanel Component - Animation Catalog Inspector
 * Right panel placeholder for future inspector/settings content.
 */

import type React from 'react'

export const EditorRightPanel: React.FC = () => {
  return (
    <div className="h-full flex flex-col w-full shrink-0 overflow-hidden">
      <div className="p-4 border-b border-panel-border bg-panel-header/50 z-10 shrink-0 flex items-center gap-2">
        <h2 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
          Inspector
        </h2>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-xs text-text-tertiary text-center">Select an animation to inspect</p>
      </div>
    </div>
  )
}
