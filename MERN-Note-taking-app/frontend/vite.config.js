import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: { // ◄◄ Allows Vite to accept external connections from the Dev Container
    host: true, 
    port: 5173,
  },
})
