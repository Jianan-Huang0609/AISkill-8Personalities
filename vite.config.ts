import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages 需要设置 base 路径
  base: process.env.NODE_ENV === 'production' && process.env.GITHUB_PAGES === 'true'
    ? '/AISkill-8Personalities/'
    : '/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 确保构建产物兼容 Vercel 和 Cloudflare Pages
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  // 确保公共资源正确复制
  publicDir: 'public'
})

