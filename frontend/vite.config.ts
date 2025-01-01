// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.PORT || '3000', 10), // Use Render's PORT environment variable
    host: '0.0.0.0', // Allow external connections
  },
  build: {
    outDir: 'dist', // Specify the output directory
    emptyOutDir: true, // Clear the output directory before building
    target: 'esnext', // Ensure compatibility with modern browsers
    sourcemap: process.env.NODE_ENV !== 'production', // Generate sourcemaps only for non-production environments
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Alias for your src folder
    },
  },
  define: {
    'process.env': {}, // Fix for some libraries that expect process.env
  },
});


