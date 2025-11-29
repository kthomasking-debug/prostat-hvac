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
    // Let Vite handle chunking automatically to avoid React dependency issues
    // Vite will automatically split chunks optimally and maintain correct load order
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
