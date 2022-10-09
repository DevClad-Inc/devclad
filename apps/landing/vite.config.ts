import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import ssr from 'vite-plugin-ssr/plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react(), ssr(), svgr()],
  build: {
    outDir: './dist',
    assetsDir: '.',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
