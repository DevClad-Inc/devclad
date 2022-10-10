import { defineConfig } from 'vite';
import svg from 'vite-plugin-svgr';
import ssr from 'vite-plugin-ssr/plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    ssr({
      prerender: true,
    }),
    svg(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@heroicons/react/24/solid': '@heroicons/react/24/solid/index.js',
      '@heroicons/react/24/outline': '@heroicons/react/24/outline/index.js',
    },
  },
});
