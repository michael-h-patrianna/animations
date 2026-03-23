import { type CodeMode, useCodeMode } from '@/contexts/CodeModeContext'
import { ToggleGroup, type ToggleOption } from '@/demo-ui/components/ui/ToggleGroup'
import type { FC } from 'react'

/** Props for the CodeModeSwitch component. */
interface CodeModeSwitchProps {
  onModeSelect?: (mode: CodeMode) => void
}

const CODE_MODE_OPTIONS: ToggleOption<CodeMode>[] = [
  { value: 'Framer', label: 'Framer' },
  { value: 'CSS', label: 'CSS' },
]

/** Toggle switch between Framer and CSS code modes. */
export const CodeModeSwitch: FC<CodeModeSwitchProps> = ({ onModeSelect }) => {
  const { codeMode, setCodeMode } = useCodeMode()

  const handleChange = (mode: CodeMode) => {
    setCodeMode(mode)
    onModeSelect?.(mode)
  }

  return (
    <ToggleGroup
      options={CODE_MODE_OPTIONS}
      value={codeMode}
      onChange={handleChange}
      ariaLabel="Code mode"
      data-testid="code-mode-switch"
    />
  )
}
