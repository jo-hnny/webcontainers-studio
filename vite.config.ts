import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  base: '/webcontainers-studio',

  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          return id.includes('src') ? 'index' : undefined;
        },
      },
    },
  },
});
