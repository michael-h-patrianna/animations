import { createContext, useContext, useState, type ReactNode } from 'react'

export type CodeMode = 'Framer' | 'CSS'

interface CodeModeContextType {
  codeMode: CodeMode
  setCodeMode: (mode: CodeMode) => void
}

const CodeModeContext = createContext<CodeModeContextType | undefined>(undefined)

export const CodeModeProvider = ({ children }: { children: ReactNode }) => {
  const [codeMode, setCodeMode] = useState<CodeMode>('Framer')

  return (
    <CodeModeContext.Provider value={{ codeMode, setCodeMode }}>
      {children}
    </CodeModeContext.Provider>
  )
}

export const useCodeMode = () => {
  const context = useContext(CodeModeContext)
  if (context === undefined) {
    throw new Error('useCodeMode must be used within a CodeModeProvider')
  }
  return context
}
