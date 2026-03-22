/** A single entry in a ranked list (leaderboard, score display). */
export interface RankedEntry {
  /** Unique identifier — used as React key */
  id: string
  /** Display name (player, team, etc.) */
  label: string
  /** Numeric score or value */
  score: number
}

/** A single key-value stat row for stacked displays. */
export interface StatEntry {
  /** Row label (e.g., "Active Players") */
  label: string
  /** Display value (pre-formatted string, e.g., "1,247") */
  value: string
  /** Whether this row should be highlighted */
  active?: boolean
}
