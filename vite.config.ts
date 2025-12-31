import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages 需要设置 base 路径
  base: process.env.NODE_ENV === 'production' && process.env.GITHUB_PAGES === 'true'
    ? '/AISkill-8Personalities/'
    : '/',
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
})
