import { defineConfig } from 'vite'
import { defineConfig as defineViteConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000 // Hamara frontend 3000 port par chalega
  }
})
