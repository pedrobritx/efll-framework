import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const portEnv = process.env.PORT ? Number(process.env.PORT) : undefined;

// The site deploys to the root of its own GitHub Pages subdomain
// (https://lessonframework.britx.me/), so the default base is '/'. Set
// VITE_BASE_PATH (e.g. '/efl-lesson-framework/') to build for a path-based
// deployment instead, such as a project page under a different GitHub Pages site.
const basePath = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  plugins: [react()],
  base: basePath,
  server: portEnv ? { port: portEnv, strictPort: true } : undefined,
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
  },
});
