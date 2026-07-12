import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/admin/',
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/shreenovatech/backend/api'),
      },
    },
  },
  build: {
    outDir: '../backend/admin-react',
    emptyOutDir: true,
  },
});
