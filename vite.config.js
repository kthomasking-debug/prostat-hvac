import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";

// https://vite.dev/config/
export default defineConfig({
  // Environment-dependent base path:
  // - GitHub Pages: set VITE_BASE_PATH=/engineering-tools/ (or your repo name)
  // - Netlify/Vercel: set VITE_BASE_PATH=/ or leave unset (defaults to /)
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [
    react(),
    legacy({
      // Target Android 4.4 KitKat / 5.0 Lollipop (Chrome 30-40)
      targets: ["android >= 4.4", "chrome >= 30"],
      // Include runtime polyfills where needed
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
      // Render legacy chunks alongside modern chunks to improve loading on older platforms
      renderLegacyChunks: true,
      // Modern polyfills for fetch, Promise, etc.
      modernPolyfills: false,
    }),
  ],
  // No proxy needed - agent runs client-side now!
  // Temperature endpoints can be accessed directly or via external thermometer API
  build: {
    // Target ES5 for maximum compatibility with Android 4.4 KitKat
    target: "es5",
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching and parallel loading
        manualChunks: (id) => {
          // Split large vendor libraries into separate chunks
          if (id.includes('node_modules')) {
            // React and React DOM together (frequently used together)
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            // Router
            if (id.includes('react-router')) {
              return 'router';
            }
            // Large charting library
            if (id.includes('recharts')) {
              return 'charts';
            }
            // 3D library (only used in specific pages)
            if (id.includes('three')) {
              return 'three';
            }
            // Animation library (only used in specific components)
            if (id.includes('framer-motion')) {
              return 'animations';
            }
            // AI/LLM libraries
            if (id.includes('@ai-sdk') || id.includes('ai/')) {
              return 'ai';
            }
            // Markdown rendering
            if (id.includes('react-markdown') || id.includes('remark') || id.includes('rehype')) {
              return 'markdown';
            }
            // Syntax highlighting (only used in docs)
            if (id.includes('react-syntax-highlighter')) {
              return 'syntax';
            }
            // PDF generation (only used in specific features)
            if (id.includes('jspdf') || id.includes('html2canvas')) {
              return 'pdf';
            }
            // Other node_modules
            return 'vendor';
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    include: [
      "./src/**/*.test.{js,jsx}",
      "./src/pages/__tests__/**/*.test.{js,jsx}",
    ],
    threads: false,
  },
});
