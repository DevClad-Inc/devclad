import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    visualizer({
      gzipSize: true,
      brotliSize: true,
    }) as any,
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'DevClad',
        short_name: 'DevClad',
        description: 'Social Workspace Platform for Developers',
        theme_color: '#101218',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  build: {
    outDir: './dist',
    assetsDir: '.',
  },
  // publicDir: '../../packages/ui/assets',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
