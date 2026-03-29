import './shared.css'
import type { AnimationMetadata, GroupMetadata } from '@/types/animation'
import { buildGroupExport } from '@/lib/groupBuilder'

// Side-effect: load framer-variant CSS (layout only — animation CSS banned by lint)
import.meta.glob(['./framer/*.css', '!./framer/*.module.css'], { eager: true })

const metadata: GroupMetadata = {
  id: 'progress-bars',
  title: 'Progress bars',
  demo: 'progressBars',
}

export const groupExport = buildGroupExport(
  metadata,
  import.meta.glob<Record<string, unknown>>('./framer/*.tsx'),
  import.meta.glob<{ metadata: AnimationMetadata }>('./framer/*.meta.ts', { eager: true }),
  import.meta.glob<Record<string, unknown>>('./css/*.tsx'),
  import.meta.glob<{ metadata: AnimationMetadata }>('./css/*.meta.ts', { eager: true }),
  {
    framerTsx: import.meta.glob<string>('./framer/*.tsx', { query: '?raw', import: 'default' }),
    framerCss: import.meta.glob<string>('./framer/*.css', { query: '?raw', import: 'default' }),
    cssTsx: import.meta.glob<string>('./css/*.tsx', { query: '?raw', import: 'default' }),
    cssCss: import.meta.glob<string>('./css/*.css', { query: '?raw', import: 'default' }),
    shared: import.meta.glob<string>('./*.{ts,tsx}', { query: '?raw', import: 'default' }),
  }
)
