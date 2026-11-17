import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages supplies /telangana-atlas/; local development uses /.
  base: process.env.VITE_BASE_PATH || '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.endsWith('/src/data.json')) return 'directory';
          if (id.includes('node_modules/react')) return 'react-vendor';
        },
      },
    },
  },
});
