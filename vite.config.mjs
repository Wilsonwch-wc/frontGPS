import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Configuración mínima para resolver problemas de build
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    open: true,
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    open: true,
    port: 3000
  },
  define: {
    global: 'globalThis'
  },
  resolve: {
    alias: {
      'assets': path.resolve(__dirname, 'src/assets'),
      'routes': path.resolve(__dirname, 'src/routes'),
      'themes': path.resolve(__dirname, 'src/themes'),
      'contexts': path.resolve(__dirname, 'src/contexts'),
      'components': path.resolve(__dirname, 'src/components'),
      'utils': path.resolve(__dirname, 'src/utils'),
      'hooks': path.resolve(__dirname, 'src/hooks'),
      'api': path.resolve(__dirname, 'src/api'),
      'store': path.resolve(__dirname, 'src/store'),
      'layout': path.resolve(__dirname, 'src/layout'),
      'pages': path.resolve(__dirname, 'src/pages'),
      'sections': path.resolve(__dirname, 'src/sections'),
      'menu-items': path.resolve(__dirname, 'src/menu-items'),
      'config': path.resolve(__dirname, 'src/config')
    }
  },
  build: {
    target: 'esnext',
    minify: 'esbuild'
  }
});
