import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    outDir: './dist',
    assetsDir: '.',
  },
  publicDir: '../../packages/ui/assets',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
