import './demo-blocks.css'

interface DemoFormFieldProps {
  label?: string
  className?: string
}

/** Read-only label + input pair for demo form layouts. */
export function DemoFormField({ label = 'Field', className = '' }: DemoFormFieldProps) {
  return (
    <div className={`pf-demo-form-field ${className}`}>
      <label className="pf-demo-form-field__label">{label}</label>
      <input className="pf-demo-form-field__input" type="text" readOnly />
    </div>
  )
}
