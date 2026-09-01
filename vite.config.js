import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    open: false,
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-framework': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion', 'lenis'],
          'vendor-gsap': ['gsap'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
});
