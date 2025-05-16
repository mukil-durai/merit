import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // Removing base path for now
  
  plugins: [react()],
  base:"/merit",
  
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
  
  // Ensure proper MIME types for media files
  assetsInclude: ['**/*.mp4', '**/*.mov', '**/*.webm', '**/*.ogg', '**/*.mp3'],
  
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})