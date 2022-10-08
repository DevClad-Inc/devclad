import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import svgr from 'vite-plugin-svgr';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    visualizer({
      gzipSize: true,
      brotliSize: true,
    }) as any,
  ],
  build: {
    rollupOptions: {
      external: [/^@devclad\/ui/, /^@devclad\/config/],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
