'use strict';
exports.__esModule = true;
var vite_1 = require('vite');
var rollup_plugin_visualizer_1 = require('rollup-plugin-visualizer');
var vite_plugin_svgr_1 = require('vite-plugin-svgr');
var vite_plugin_pwa_1 = require('vite-plugin-pwa');
var plugin_react_1 = require('@vitejs/plugin-react');
var path_1 = require('path');
exports['default'] = vite_1.defineConfig({
	plugins: [
		plugin_react_1['default'](),
		vite_plugin_svgr_1['default'](),
		rollup_plugin_visualizer_1.visualizer({
			gzipSize: true,
			brotliSize: true,
		}),
		vite_plugin_pwa_1.VitePWA({
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
	resolve: {
		alias: {
			'@': path_1['default'].resolve(__dirname, 'src'),
		},
	},
});
