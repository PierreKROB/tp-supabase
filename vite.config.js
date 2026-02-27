import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Configuration pour GitHub Pages
  // IMPORTANT : Remplacez 'tp-posts-comments' par le nom exact de VOTRE repo GitHub
  base: process.env.NODE_ENV === 'production' ? '/tp-posts-comments/' : '/',
})