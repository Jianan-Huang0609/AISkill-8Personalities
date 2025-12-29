# 🚀 部署指南

## Vercel 部署（国内可用）

Vercel 在国内可以正常访问，无需VPN。以下是详细部署步骤：

### 方法一：通过 GitHub 自动部署（推荐）

1. **将代码推送到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AI技能树评测系统"
   git branch -M main
   git remote add origin https://github.com/你的用户名/ai-skill-tree-assessment.git
   git push -u origin main
   ```

2. **在 Vercel 部署**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录
   - 点击 "New Project"
   - 选择你的仓库
   - Vercel 会自动检测到 Vite 项目
   - 点击 "Deploy" 即可

3. **配置说明**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 方法二：通过 Vercel CLI 部署

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署项目**
   ```bash
   vercel
   ```
   
   首次部署会询问：
   - Set up and deploy? Yes
   - Which scope? 选择你的账号
   - Link to existing project? No
   - Project name? ai-skill-tree-assessment
   - Directory? ./
   - Override settings? No

4. **生产环境部署**
   ```bash
   vercel --prod
   ```

### 国内访问优化

Vercel 在国内访问速度可能较慢，可以：

1. **使用自定义域名**
   - 在 Vercel 项目设置中添加自定义域名
   - 使用国内域名服务商（如阿里云、腾讯云）的 DNS

2. **使用 CDN 加速**
   - 配置 Cloudflare（免费）
   - 或使用国内 CDN 服务

3. **替代方案：国内部署平台**
   - **Netlify** - 类似 Vercel，国内访问较慢
   - **Cloudflare Pages** - 免费，需要配置
   - **腾讯云静态网站托管** - 国内访问快
   - **阿里云 OSS + CDN** - 国内访问快
   - **Vercel 中国版**（如果有）

---

## 其他部署选项

### 1. Netlify 部署

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 部署
netlify deploy --prod
```

### 2. Cloudflare Pages

1. 连接 GitHub 仓库
2. 构建命令: `npm run build`
3. 输出目录: `dist`
4. 自动部署

### 3. 腾讯云静态网站托管

1. 登录腾讯云控制台
2. 开通静态网站托管服务
3. 上传 `dist` 目录内容
4. 配置 CDN 加速

### 4. 阿里云 OSS + CDN

1. 创建 OSS 存储桶
2. 上传 `dist` 目录内容
3. 开启静态网站托管
4. 配置 CDN 加速

---

## 环境变量配置

如果后续需要接入 AI API，可以在 Vercel 项目设置中添加环境变量：

1. 进入 Vercel 项目设置
2. 选择 "Environment Variables"
3. 添加变量：
   - `VITE_OPENAI_API_KEY` (如果使用 OpenAI)
   - `VITE_API_ENABLED` = `true` (启用 AI 功能)

---

## 构建优化

### 1. 减小打包体积

在 `vite.config.ts` 中添加：

```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'chart-vendor': ['recharts', 'd3'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

### 2. 启用压缩

Vercel 会自动启用 gzip 压缩，无需额外配置。

---

## 域名配置

### 使用 Vercel 免费域名

部署后会自动获得：`your-project.vercel.app`

### 使用自定义域名

1. 在 Vercel 项目设置中添加域名
2. 按照提示配置 DNS 记录
3. 等待 DNS 生效（通常几分钟）

---

## 常见问题

### Q: 国内访问 Vercel 慢怎么办？

A: 
1. 使用自定义域名 + 国内 DNS
2. 考虑使用国内部署平台（腾讯云、阿里云）
3. 配置 CDN 加速

### Q: 部署失败怎么办？

A:
1. 检查 `package.json` 中的依赖是否正确
2. 查看 Vercel 构建日志
3. 确保 `vercel.json` 配置正确
4. 检查 Node.js 版本（Vercel 默认使用 Node 18）

### Q: 如何更新部署？

A:
- 如果使用 GitHub 集成，推送代码会自动触发部署
- 如果使用 CLI，运行 `vercel --prod` 即可

---

## 部署检查清单

- [ ] 代码已推送到 GitHub
- [ ] `vercel.json` 配置正确
- [ ] `package.json` 包含所有依赖
- [ ] 构建命令测试通过 (`npm run build`)
- [ ] 环境变量已配置（如需要）
- [ ] 自定义域名已配置（如需要）
- [ ] 测试下载功能（MD/PDF）

---

## 分享链接

部署完成后，你可以：

1. **直接分享 Vercel 链接**
   - `https://your-project.vercel.app`

2. **分享到社交媒体**
   - 添加分享按钮（可选）
   - 生成分享卡片（可选）

3. **嵌入到其他网站**
   - 使用 iframe（不推荐，可能有限制）
   - 或直接链接

