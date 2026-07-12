import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set USE_NODE_BACKEND=true in .env to proxy to Node.js backend (port 5000)
// Otherwise defaults to PHP backend via XAMPP
const useNodeBackend = process.env.USE_NODE_BACKEND === 'true';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': useNodeBackend
        ? { target: 'http://localhost:5000', changeOrigin: true }
        : { target: 'http://localhost', changeOrigin: true, rewrite: path => path.replace(/^\/api/, '/shreenovatech/backend/api') },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
