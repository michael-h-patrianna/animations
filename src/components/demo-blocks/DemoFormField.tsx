import { useId } from 'react'
import './demo-blocks.css'

interface DemoFormFieldProps {
  label?: string
  className?: string
}

/** Read-only label + input pair for demo form layouts. */
export function DemoFormField({ label = 'Field', className = '' }: DemoFormFieldProps) {
  const inputId = useId()
  return (
    <div className={`pf-demo-form-field ${className}`}>
      <label className="pf-demo-form-field__label" htmlFor={inputId}>
        {label}
      </label>
      <input id={inputId} className="pf-demo-form-field__input" type="text" readOnly />
    </div>
  )
}
