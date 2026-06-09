import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Builds the SPA into ./build, which the Flask app (app.py) serves as its
// static folder. Served at the domain root, so base stays '/'.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    emptyOutDir: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
