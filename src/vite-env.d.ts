/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_WAITLIST_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
