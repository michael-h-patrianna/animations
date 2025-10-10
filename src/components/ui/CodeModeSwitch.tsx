import { useCodeMode, type CodeMode } from '@/contexts/CodeModeContext'
import type { FC } from 'react'
import './CodeModeSwitch.css'

export const CodeModeSwitch: FC = () => {
  const { codeMode, setCodeMode } = useCodeMode()

  const handleToggle = () => {
    setCodeMode(codeMode === 'Framer' ? 'CSS' : 'Framer')
  }

  return (
    <div className="pf-code-mode-switch">
      <button
        className={`pf-code-mode-switch__option ${codeMode === 'Framer' ? 'is-active' : ''}`}
        onClick={() => setCodeMode('Framer')}
        aria-pressed={codeMode === 'Framer'}
      >
        Framer
      </button>
      <button
        className={`pf-code-mode-switch__option ${codeMode === 'CSS' ? 'is-active' : ''}`}
        onClick={() => setCodeMode('CSS')}
        aria-pressed={codeMode === 'CSS'}
      >
        CSS
      </button>
    </div>
  )
}
