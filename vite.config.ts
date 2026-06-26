import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/sample-webapp/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        details: 'details.html',
      },
    },
  },
  server: {
    port: 5173,
  },
});
