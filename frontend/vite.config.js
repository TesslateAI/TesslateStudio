/**
 * Vite build configuration file.
 * Sets up React and Tailwind plugins for the build process.
 * Configures the development and production build settings.
 */

// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwind(),
  ],
});
