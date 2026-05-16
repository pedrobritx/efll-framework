import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const portEnv = process.env.PORT ? Number(process.env.PORT) : undefined;

export default defineConfig({
  plugins: [react()],
  base: '/efll-framework/',
  server: portEnv ? { port: portEnv, strictPort: true } : undefined,
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
  },
});
