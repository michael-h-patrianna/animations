/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE?: string
  // Add more environment variables as needed for animation showcase
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
