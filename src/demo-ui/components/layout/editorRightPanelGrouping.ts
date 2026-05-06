import type { PropConfig } from '@/types/animation'

/** Groups adjacent props sharing the same `group` key into runs. Ungrouped props become solo runs. */
export function groupAdjacentProps(props: PropConfig[]): PropConfig[][] {
  const runs: PropConfig[][] = []
  for (const prop of props) {
    const prev = runs[runs.length - 1]
    const prevFirst = prev?.[0]
    if (prev != null && prevFirst != null && prop.group != null && prevFirst.group === prop.group) {
      prev.push(prop)
    } else {
      runs.push([prop])
    }
  }
  return runs
}
