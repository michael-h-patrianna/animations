/**
 * Demo UI Module
 * Exports all Demo UI components for the animation catalog.
 */

// Layout components
export { EditorLayout } from './components/layout/EditorLayout'
export { EditorTopBar } from './components/layout/EditorTopBar'
export { EditorLeftPanel } from './components/layout/EditorLeftPanel'
export { EditorRightPanel } from './components/layout/EditorRightPanel'

// UI components
export { Button, type ButtonProps } from './components/ui/Button'
export { ControlGroup, type ControlGroupProps } from './components/ui/ControlGroup'
export { DropdownMenu, type DropdownMenuItem } from './components/ui/DropdownMenu'
export { Input, type InputProps } from './components/ui/Input'
export { LoadingSpinner } from './components/ui/LoadingSpinner'
export { Modal } from './components/ui/Modal'
export { Select, type SelectProps, type SelectOption } from './components/ui/Select'
export { Switch, type SwitchProps } from './components/ui/Switch'
export { Tabs, type Tab } from './components/ui/Tabs'
export { ToggleGroup, type ToggleGroupProps, type ToggleOption } from './components/ui/ToggleGroup'
export { Tooltip, type TooltipProps } from './components/ui/Tooltip'

// Stores
export { useLayoutStore } from './stores/layoutStore'
export { useDropdownStore } from './stores/dropdownStore'
export type { LayoutStore, ThemeMode, AccentColor, PreviewFont } from './stores/layoutStore'
