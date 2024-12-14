import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
    host: '0.0.0.0',
    // Enable polling for file changes (useful in certain environments)
    watch: {
      usePolling: true,
    },
    port: 5173, // Specify the development server port
  },
});