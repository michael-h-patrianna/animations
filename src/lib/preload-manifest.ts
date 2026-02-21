// Import assets so Vite resolves and fingerprints them in production

// Extendable: add more assets here as needed
import { homeIcon1, homeIcon2 } from '@/assets'
export const CRITICAL_ICON_IMAGES: string[] = [
  // Keep startup preload list small; heavyweight demo assets are lazy-loaded on demand.
  homeIcon1,
  homeIcon2,
]
