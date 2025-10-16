/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react'

/**
 * Available code mode options for viewing animations
 */
export type CodeMode = 'Framer' | 'CSS'

/**
 * Context value shape for code mode state
 */
interface CodeModeContextType {
  /** Current active code mode */
  codeMode: CodeMode
  /** Function to update the code mode */
  setCodeMode: (mode: CodeMode) => void
}

const CodeModeContext = createContext<CodeModeContextType | undefined>(undefined)

/**
 * Provider component for code mode context.
 *
 * Manages global state for switching between Framer Motion and CSS animation implementations.
 * Wraps the app to provide code mode state to all child components.
 *
 * @param props - Provider props
 * @param props.children - Child components to receive context
 *
 * @example
 * ```tsx
 * <CodeModeProvider>
 *   <App />
 * </CodeModeProvider>
 * ```
 */
export const CodeModeProvider = ({ children }: { children: ReactNode }) => {
  const [codeMode, setCodeMode] = useState<CodeMode>('Framer')

  return (
    <CodeModeContext.Provider value={{ codeMode, setCodeMode }}>
      {children}
    </CodeModeContext.Provider>
  )
}

/**
 * Hook to access code mode context.
 *
 * Provides access to the current code mode and function to update it.
 * Must be used within a CodeModeProvider.
 *
 * @returns Current code mode and setter function
 * @throws Error if used outside of CodeModeProvider
 *
 * @example
 * ```tsx
 * function AnimationSelector() {
 *   const { codeMode, setCodeMode } = useCodeMode()
 *
 *   return (
 *     <select value={codeMode} onChange={e => setCodeMode(e.target.value as CodeMode)}>
 *       <option value="Framer">Framer Motion</option>
 *       <option value="CSS">CSS</option>
 *     </select>
 *   )
 * }
 * ```
 */
export const useCodeMode = () => {
  const context = useContext(CodeModeContext)
  if (context === undefined) {
    throw new Error('useCodeMode must be used within a CodeModeProvider')
  }
  return context
}
