import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  // Treat audio and video files as static assets (served by URL, not inlined)
  assetsInclude: ['**/*.mov', '**/*.MOV', '**/*.mp4', '**/*.MP4', '**/*.aac', '**/*.AAC', '**/*.mp3', '**/*.MP3', '**/*.m4a'],
  build: {
    // Never inline assets as base64 (important for large video files)
    assetsInlineLimit: 0,
  },
})
