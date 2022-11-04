/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_APP_TITLE: string;
	readonly VITE_STREAM_API_KEY: string;
	readonly VERCEL_ANALYTICS_ID: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare module '@heroicons/react/outline';
declare module '@heroicons/react/solid';
declare module '@heroicons/react/24/outline';
declare module '@heroicons/react/24/solid';

declare module '@devclad/config/eslint-react';
declare module 'rollup-plugin-visualizer';
declare module 'isomorphic-fetch';
