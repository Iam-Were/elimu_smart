import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Use minified Parse build for better Vite compatibility
      'parse': path.resolve(__dirname, './node_modules/parse/dist/parse.min.js'),
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {}
  },
  optimizeDeps: {
    include: ['parse'],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'parse-sdk': ['parse'],
          'ui-vendor': ['lucide-react', 'recharts']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: true
  }
});
