# AnimationCard State Machine Design

**Status:** Design Complete - Ready for Implementation
**Date:** October 13, 2025
**Related:** Style Guide Audit M1 Violation
**Priority:** HIGH

---

## Problem Statement

AnimationCard currently uses **7 separate useState calls** to manage its state:

```tsx
const [isVisible, setIsVisible] = useState(false)
const [replayKey, setReplayKey] = useState(0)
const [isExpanded, setIsExpanded] = useState(false)
const [bulbCount, setBulbCount] = useState(DEFAULT_BULB_COUNT)
const [onColor, setOnColor] = useState(DEFAULT_ON_COLOR)
```

**Issues:**
- Scattered state makes it hard to understand component behavior
- No guarantees about state consistency
- Difficult to test state transitions
- No clear state machine representation

---

## Proposed Solution

Replace multiple useState calls with a single **useReducer** implementing a type-safe state machine.

### State Structure

```typescript
/**
 * AnimationCard state machine states
 */
type AnimationCardState =
  | { status: 'idle' }
  | { status: 'visible'; replayKey: number }
  | { status: 'playing'; replayKey: number }

/**
 * Full state including UI and configuration
 */
interface AnimationCardMachineState {
  // Core state machine
  playback: AnimationCardState

  // UI state
  ui: {
    isExpanded: boolean
  }

  // Configuration state (for lights animations)
  config: {
    bulbCount: number
    onColor: string
  }
}
```

### Actions

```typescript
/**
 * All possible actions on AnimationCard state
 */
type AnimationCardAction =
  | { type: 'BECOME_VISIBLE' }
  | { type: 'REPLAY' }
  | { type: 'FINISH_PLAYING' }
  | { type: 'TOGGLE_EXPANSION' }
  | { type: 'SET_BULB_COUNT'; count: number }
  | { type: 'SET_ON_COLOR'; color: string }
  | { type: 'RESET' }
```

### State Transitions

```
┌─────────┐
│  idle   │
└────┬────┘
     │ BECOME_VISIBLE
     ▼
┌─────────┐
│ visible │◄────┐
└────┬────┘     │
     │ REPLAY   │ FINISH_PLAYING
     ▼          │
┌─────────┐    │
│ playing ├────┘
└─────────┘
```

### Reducer Implementation

```typescript
function animationCardReducer(
  state: AnimationCardMachineState,
  action: AnimationCardAction
): AnimationCardMachineState {
  switch (action.type) {
    case 'BECOME_VISIBLE':
      if (state.playback.status === 'idle') {
        return {
          ...state,
          playback: { status: 'visible', replayKey: 0 }
        }
      }
      return state

    case 'REPLAY':
      if (state.playback.status === 'visible' || state.playback.status === 'playing') {
        const currentKey = state.playback.replayKey
        return {
          ...state,
          playback: { status: 'playing', replayKey: currentKey + 1 }
        }
      }
      return state

    case 'FINISH_PLAYING':
      if (state.playback.status === 'playing') {
        return {
          ...state,
          playback: { status: 'visible', replayKey: state.playback.replayKey }
        }
      }
      return state

    case 'TOGGLE_EXPANSION':
      return {
        ...state,
        ui: { isExpanded: !state.ui.isExpanded }
      }

    case 'SET_BULB_COUNT':
      return {
        ...state,
        config: { ...state.config, bulbCount: action.count }
      }

    case 'SET_ON_COLOR':
      return {
        ...state,
        config: { ...state.config, onColor: action.color }
      }

    case 'RESET':
      return initialState

    default:
      return state
  }
}
```

---

## Implementation Guide

### Step 1: Create Hook File

**File:** `src/hooks/useAnimationCardState.ts`

```typescript
import { useReducer } from 'react'

const DEFAULT_BULB_COUNT = 5
const DEFAULT_ON_COLOR = '#fbbf24'

const initialState: AnimationCardMachineState = {
  playback: { status: 'idle' },
  ui: { isExpanded: false },
  config: {
    bulbCount: DEFAULT_BULB_COUNT,
    onColor: DEFAULT_ON_COLOR,
  },
}

export function useAnimationCardState() {
  const [state, dispatch] = useReducer(animationCardReducer, initialState)

  return {
    // State
    isVisible: state.playback.status !== 'idle',
    replayKey: state.playback.status !== 'idle' ? state.playback.replayKey : 0,
    isExpanded: state.ui.isExpanded,
    bulbCount: state.config.bulbCount,
    onColor: state.config.onColor,

    // Actions
    becomeVisible: () => dispatch({ type: 'BECOME_VISIBLE' }),
    replay: () => dispatch({ type: 'REPLAY' }),
    finishPlaying: () => dispatch({ type: 'FINISH_PLAYING' }),
    toggleExpansion: () => dispatch({ type: 'TOGGLE_EXPANSION' }),
    setBulbCount: (count: number) => dispatch({ type: 'SET_BULB_COUNT', count }),
    setOnColor: (color: string) => dispatch({ type: 'SET_ON_COLOR', color }),
    reset: () => dispatch({ type: 'RESET' }),
  }
}
```

### Step 2: Update AnimationCard Component

**Before:**
```tsx
const [isVisible, setIsVisible] = useState(false)
const [replayKey, setReplayKey] = useState(0)
const [isExpanded, setIsExpanded] = useState(false)
const [bulbCount, setBulbCount] = useState(DEFAULT_BULB_COUNT)
const [onColor, setOnColor] = useState(DEFAULT_ON_COLOR)
```

**After:**
```tsx
const {
  isVisible,
  replayKey,
  isExpanded,
  bulbCount,
  onColor,
  becomeVisible,
  replay,
  toggleExpansion,
  setBulbCount,
  setOnColor,
} = useAnimationCardState()
```

Replace all `setIsVisible(true)` with `becomeVisible()`, etc.

### Step 3: Add Tests

**File:** `src/hooks/useAnimationCardState.test.ts`

```typescript
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useAnimationCardState } from './useAnimationCardState'

describe('useAnimationCardState', () => {
  it('starts in idle state', () => {
    const { result } = renderHook(() => useAnimationCardState())

    expect(result.current.isVisible).toBe(false)
    expect(result.current.replayKey).toBe(0)
  })

  it('transitions to visible on BECOME_VISIBLE', () => {
    const { result } = renderHook(() => useAnimationCardState())

    act(() => {
      result.current.becomeVisible()
    })

    expect(result.current.isVisible).toBe(true)
  })

  it('increments replayKey on REPLAY', () => {
    const { result } = renderHook(() => useAnimationCardState())

    act(() => {
      result.current.becomeVisible()
    })

    const initialKey = result.current.replayKey

    act(() => {
      result.current.replay()
    })

    expect(result.current.replayKey).toBe(initialKey + 1)
  })

  it('updates bulbCount', () => {
    const { result } = renderHook(() => useAnimationCardState())

    act(() => {
      result.current.setBulbCount(10)
    })

    expect(result.current.bulbCount).toBe(10)
  })

  it('toggles expansion state', () => {
    const { result } = renderHook(() => useAnimationCardState())

    expect(result.current.isExpanded).toBe(false)

    act(() => {
      result.current.toggleExpansion()
    })

    expect(result.current.isExpanded).toBe(true)
  })

  it('resets to initial state', () => {
    const { result } = renderHook(() => useAnimationCardState())

    act(() => {
      result.current.becomeVisible()
      result.current.replay()
      result.current.toggleExpansion()
      result.current.setBulbCount(15)
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.isVisible).toBe(false)
    expect(result.current.replayKey).toBe(0)
    expect(result.current.isExpanded).toBe(false)
    expect(result.current.bulbCount).toBe(5)
  })
})
```

---

## Benefits

### Before (7 useState calls)
❌ State scattered across component
❌ No state transition guarantees
❌ Difficult to test individual state changes
❌ No clear state machine representation
❌ setState calls can happen in wrong order

### After (1 useReducer)
✅ Centralized state management
✅ Type-safe state transitions
✅ Easy to test with renderHook
✅ Clear state machine diagram
✅ Reducer enforces valid transitions

---

## Migration Checklist

- [ ] Create `src/hooks/useAnimationCardState.ts` with types and reducer
- [ ] Add comprehensive tests in `src/hooks/useAnimationCardState.test.ts`
- [ ] Update AnimationCard.tsx to use new hook
- [ ] Replace all setState calls with dispatch actions
- [ ] Run full test suite to verify no regressions
- [ ] Update AnimationCard JSDoc with state machine reference
- [ ] Create ADR documenting the state machine approach

---

## Risks & Mitigation

### Risk: Breaking Existing Behavior
**Mitigation:** Comprehensive test coverage before and after migration

### Risk: Performance Impact
**Mitigation:** useReducer is as performant as useState, no concerns

### Risk: Increased Complexity for Simple State
**Mitigation:** Hook provides simple API, complexity hidden in reducer

---

## Future Enhancements

1. **Add State History:** Track previous states for debugging
2. **Add DevTools Integration:** XState visualizer support
3. **Add State Persistence:** Save/restore state from localStorage
4. **Add Analytics:** Track state transition events

---

## References

- [React useReducer Hook](https://react.dev/reference/react/useReducer)
- [State Machines in React](https://kentcdodds.com/blog/implementing-a-simple-state-machine-library-in-javascript)
- [XState Documentation](https://xstate.js.org/docs/)

---

*This design is ready for implementation. Follow the migration checklist to safely refactor AnimationCard.*
