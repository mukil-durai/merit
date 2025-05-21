import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // Adding base path back
  base: "/merit/",
  
  plugins: [react()],
  
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'public/assets')
    }
  },
  
  // Add explicit configuration for serving media files
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..', 'public', 'assets']
    }
  },
  
  // Define public directory for static assets
  publicDir: 'public',
  
  build: {
    chunkSizeWarningLimit: 1000, // Optional: Increase limit to suppress warning
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('framer-motion')) return 'vendor-framer-motion';
            if (id.includes('axios')) return 'vendor-axios';
            // Add more libraries as needed
            return 'vendor';
          }
        }
      }
    }
  }
})