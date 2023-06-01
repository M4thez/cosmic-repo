import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: '/cosmic-repo/menu',
    base: '/cosmic-repo/',
  }, 
  assetsInclude: ['**/*.glb'],
  base: '/cosmic-repo/',
})
