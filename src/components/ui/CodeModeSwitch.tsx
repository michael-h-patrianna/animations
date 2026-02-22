import { type CodeMode, useCodeMode } from '@/contexts/CodeModeContext'
import type { FC } from 'react'
import './CodeModeSwitch.css'

interface CodeModeSwitchProps {
  onModeSelect?: (mode: CodeMode) => void
}

export const CodeModeSwitch: FC<CodeModeSwitchProps> = ({ onModeSelect }) => {
  const { codeMode, setCodeMode } = useCodeMode()

  const handleSelect = (mode: CodeMode) => {
    setCodeMode(mode)
    onModeSelect?.(mode)
  }

  return (
    <div className="pf-code-mode-switch">
      <button
        type="button"
        className={`pf-code-mode-switch__option ${codeMode === 'Framer' ? 'is-active' : ''}`}
        onClick={() => handleSelect('Framer')}
        aria-pressed={codeMode === 'Framer'}
      >
        Framer
      </button>
      <button
        type="button"
        className={`pf-code-mode-switch__option ${codeMode === 'CSS' ? 'is-active' : ''}`}
        onClick={() => handleSelect('CSS')}
        aria-pressed={codeMode === 'CSS'}
      >
        CSS
      </button>
    </div>
  )
}
