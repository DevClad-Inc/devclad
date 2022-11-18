// vite.config.ts
import { defineConfig } from "file:///Users/arthtyagi/projects/devclad/node_modules/vite/dist/node/index.js";
import { visualizer } from "file:///Users/arthtyagi/projects/devclad/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import svgr from "file:///Users/arthtyagi/projects/devclad/node_modules/vite-plugin-svgr/dist/index.mjs";
import { VitePWA } from "file:///Users/arthtyagi/projects/devclad/node_modules/vite-plugin-pwa/dist/index.mjs";
import react from "file:///Users/arthtyagi/projects/devclad/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "/Users/arthtyagi/projects/devclad/apps/web";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    svgr(),
    visualizer({
      gzipSize: true,
      brotliSize: true
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "DevClad",
        short_name: "DevClad",
        description: "Social Workspace Platform for Developers",
        theme_color: "#101218",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ],
  define: {
    "import.meta.env.VERCEL_ANALYTICS_ID": JSON.stringify(process.env.VERCEL_ANALYTICS_ID)
  },
  build: {
    outDir: "./dist",
    assetsDir: "."
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYXJ0aHR5YWdpL3Byb2plY3RzL2RldmNsYWQvYXBwcy93ZWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9hcnRodHlhZ2kvcHJvamVjdHMvZGV2Y2xhZC9hcHBzL3dlYi92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYXJ0aHR5YWdpL3Byb2plY3RzL2RldmNsYWQvYXBwcy93ZWIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInO1xuaW1wb3J0IHN2Z3IgZnJvbSAndml0ZS1wbHVnaW4tc3Zncic7XG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcblx0cGx1Z2luczogW1xuXHRcdHJlYWN0KCksXG5cdFx0c3ZncigpLFxuXHRcdHZpc3VhbGl6ZXIoe1xuXHRcdFx0Z3ppcFNpemU6IHRydWUsXG5cdFx0XHRicm90bGlTaXplOiB0cnVlLFxuXHRcdH0pIGFzIGFueSxcblx0XHRWaXRlUFdBKHtcblx0XHRcdHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxuXHRcdFx0aW5jbHVkZUFzc2V0czogWydmYXZpY29uLmljbycsICdhcHBsZS10b3VjaC1pY29uLnBuZycsICdtYXNrZWQtaWNvbi5zdmcnXSxcblx0XHRcdG1hbmlmZXN0OiB7XG5cdFx0XHRcdG5hbWU6ICdEZXZDbGFkJyxcblx0XHRcdFx0c2hvcnRfbmFtZTogJ0RldkNsYWQnLFxuXHRcdFx0XHRkZXNjcmlwdGlvbjogJ1NvY2lhbCBXb3Jrc3BhY2UgUGxhdGZvcm0gZm9yIERldmVsb3BlcnMnLFxuXHRcdFx0XHR0aGVtZV9jb2xvcjogJyMxMDEyMTgnLFxuXHRcdFx0XHRpY29uczogW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHNyYzogJy9wd2EtMTkyeDE5Mi5wbmcnLFxuXHRcdFx0XHRcdFx0c2l6ZXM6ICcxOTJ4MTkyJyxcblx0XHRcdFx0XHRcdHR5cGU6ICdpbWFnZS9wbmcnLFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0c3JjOiAnL3B3YS01MTJ4NTEyLnBuZycsXG5cdFx0XHRcdFx0XHRzaXplczogJzUxMng1MTInLFxuXHRcdFx0XHRcdFx0dHlwZTogJ2ltYWdlL3BuZycsXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XSxcblx0XHRcdH0sXG5cdFx0fSksXG5cdF0sXG5cdGRlZmluZToge1xuXHRcdCdpbXBvcnQubWV0YS5lbnYuVkVSQ0VMX0FOQUxZVElDU19JRCc6IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52LlZFUkNFTF9BTkFMWVRJQ1NfSUQpLFxuXHR9LFxuXHRidWlsZDoge1xuXHRcdG91dERpcjogJy4vZGlzdCcsXG5cdFx0YXNzZXRzRGlyOiAnLicsXG5cdH0sXG5cdHJlc29sdmU6IHtcblx0XHRhbGlhczoge1xuXHRcdFx0J0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXG5cdFx0fSxcblx0fSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnVCxTQUFTLG9CQUFvQjtBQUM3VSxTQUFTLGtCQUFrQjtBQUMzQixPQUFPLFVBQVU7QUFDakIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFMakIsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDM0IsU0FBUztBQUFBLElBQ1IsTUFBTTtBQUFBLElBQ04sS0FBSztBQUFBLElBQ0wsV0FBVztBQUFBLE1BQ1YsVUFBVTtBQUFBLE1BQ1YsWUFBWTtBQUFBLElBQ2IsQ0FBQztBQUFBLElBQ0QsUUFBUTtBQUFBLE1BQ1AsY0FBYztBQUFBLE1BQ2QsZUFBZSxDQUFDLGVBQWUsd0JBQXdCLGlCQUFpQjtBQUFBLE1BQ3hFLFVBQVU7QUFBQSxRQUNULE1BQU07QUFBQSxRQUNOLFlBQVk7QUFBQSxRQUNaLGFBQWE7QUFBQSxRQUNiLGFBQWE7QUFBQSxRQUNiLE9BQU87QUFBQSxVQUNOO0FBQUEsWUFDQyxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUDtBQUFBLFVBQ0E7QUFBQSxZQUNDLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNQO0FBQUEsUUFDRDtBQUFBLE1BQ0Q7QUFBQSxJQUNELENBQUM7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDUCx1Q0FBdUMsS0FBSyxVQUFVLFFBQVEsSUFBSSxtQkFBbUI7QUFBQSxFQUN0RjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ04sUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLEVBQ1o7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNSLE9BQU87QUFBQSxNQUNOLEtBQUssS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxJQUNuQztBQUFBLEVBQ0Q7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
