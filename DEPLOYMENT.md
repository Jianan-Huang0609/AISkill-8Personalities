# 部署指南 - Vercel 和 Cloudflare Pages

本项目已配置为同时支持 Vercel 和 Cloudflare Pages 两个平台的部署。

## 📦 构建配置

### 通用构建设置
- **构建命令**: `npm run build`
- **输出目录**: `dist`
- **Node 版本**: 18 或更高

### package.json 脚本说明
- `prebuild`: 自动安装可选依赖（解决 Rollup 平台特定包问题）
- `build`: TypeScript 编译 + Vite 构建
- `build:ci`: CI/CD 环境专用构建（包含 `npm ci`）

## 🚀 Vercel 部署

### 自动配置
项目已包含 `vercel.json` 配置文件，Vercel 会自动识别：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [/* SPA 路由重写 */],
  "headers": [/* 安全头配置 */]
}
```

### 部署步骤
1. 登录 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 导入 GitHub 仓库
4. Vercel 会自动检测配置，直接点击 "Deploy"

### 注意事项
- Vercel 会自动运行 `prebuild` 脚本
- 安装命令已配置为 `npm install --include=optional`
- SPA 路由已通过 `rewrites` 配置

## ☁️ Cloudflare Workers 静态资源部署

### ⚠️ 重要：使用 Workers 静态资源部署（不是 Pages）

我们的项目是**纯前端 SPA**，使用 **Workers 静态资源部署**：

- **Workers 静态资源**: 部署 SPA，支持前端路由回退
- **Pages**: 也可以部署静态网站，但 Workers 更灵活

**关键配置**：`wrangler.toml` 中配置了 `assets.directory` 和 `not_found_handling`，这是 Workers 静态资源部署方式。

### 部署方式

#### 方式 1: 通过 Cloudflare Dashboard（推荐）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **"Workers 和 Pages"**
3. 点击 **"创建应用程序"** (Create Application)
4. **选择 "Workers"**（不是 Pages）
5. 选择 **"Connect to Git"**
6. 选择仓库：`Jianan-Huang0609/AISkill-8Personalities`
7. 配置构建设置：
   - **构建命令**: `npm run build`
   - **部署命令**: `npx wrangler deploy`
   - **根目录**: `/`
8. 点击 "Save and Deploy"

#### 方式 2: 本地 CLI 部署

```bash
# 构建并部署
npm run deploy:cloudflare

# 或分步执行
npm run build
npx wrangler deploy
```

### 配置说明

`wrangler.toml` 已配置：

```toml
[assets]
directory = "./dist"
not_found_handling = "single-page-application"
```

这会让：
- 静态资源（如 `/assets/index.js`）直接返回
- 前端路由（如 `/result`）回退到 `index.html`（200）
- 支持 React Router 等前端路由

### 详细文档

查看 `CLOUDFLARE_WORKERS_DEPLOY.md` 获取完整的部署指南。

### 路由配置
`public/_redirects` 文件已配置 SPA 路由：
```
/*    /index.html   200
```

此文件会在构建时自动复制到 `dist/` 目录。

### ❌ 常见错误

**错误配置**：
- 设置部署命令为 `npx wrangler deploy` ❌
- 这会尝试部署为 Workers，而不是 Pages

**正确配置**：
- 部署命令留空 ✅
- Cloudflare Pages 会自动上传 `dist` 目录到全球 CDN

## ✅ 验证部署

### 本地测试构建
```bash
npm run build
npm run preview
```

### 检查构建产物
```bash
ls -la dist/
# 应该包含：
# - index.html
# - assets/
# - _redirects (Cloudflare Pages 需要)
```

## 🔧 故障排除

### 问题：可选依赖安装失败
**解决方案**: `prebuild` 脚本已配置 `|| true`，构建会继续

### 问题：TypeScript 编译错误
**解决方案**: 确保所有类型错误已修复，运行 `npm run build` 本地验证

### 问题：Cloudflare Pages 路由不工作
**解决方案**: 确保 `public/_redirects` 文件存在且内容正确

### 问题：Vercel 构建失败
**解决方案**: 
1. 检查 `vercel.json` 配置
2. 查看构建日志中的具体错误
3. 确保 `package.json` 中的脚本正确

## 📝 配置文件清单

- ✅ `vercel.json` - Vercel 配置
- ✅ `wrangler.toml` - Cloudflare Workers/Pages 配置（参考）
- ✅ `public/_redirects` - Cloudflare Pages 路由配置
- ✅ `vite.config.ts` - Vite 构建配置
- ✅ `package.json` - 构建脚本配置

## 🌐 两个平台的区别

| 特性 | Vercel | Cloudflare Pages |
|------|--------|------------------|
| 路由配置 | `vercel.json` rewrites | `_redirects` 文件 |
| 构建检测 | 自动检测 Vite | 需手动选择框架 |
| 安装命令 | 自动使用 `--include=optional` | 使用 `prebuild` 脚本 |
| 国内访问 | 可能较慢 | 相对较快 |

两个平台都已配置完成，可以直接部署！

