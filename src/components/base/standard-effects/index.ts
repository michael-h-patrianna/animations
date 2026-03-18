import './shared.css'
import type { AnimationMetadata, GroupMetadata } from '@/types/animation'
import { buildGroupExport } from '@/lib/groupBuilder'

// Side-effect: load framer-variant CSS (layout only — animation CSS banned by lint)
import.meta.glob('./framer/*.css', { eager: true })

const metadata: GroupMetadata = {
  id: 'standard-effects',
  title: 'Standard effects',
  demo: 'standardEffects',
}

export const groupExport = buildGroupExport(
  metadata,
  import.meta.glob<Record<string, unknown>>('./framer/*.tsx'),
  import.meta.glob<{ metadata: AnimationMetadata }>('./framer/*.meta.ts', { eager: true }),
  import.meta.glob<Record<string, unknown>>('./css/*.tsx'),
  import.meta.glob<{ metadata: AnimationMetadata }>('./css/*.meta.ts', { eager: true })
)
