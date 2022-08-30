/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '@heroicons/react/outline';
declare module '@heroicons/react/solid';
declare module '@heroicons/react/24/outline';
declare module '@heroicons/react/24/solid';
