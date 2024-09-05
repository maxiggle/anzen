import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import inject from '@rollup/plugin-inject';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), inject({
    // Polyfills Buffer with the 'buffer' package in browser environments
    Buffer: ['buffer', 'Buffer'],
  }),],
})
