# Cloudflare Workers 静态资源部署指南

## 📋 项目类型确认

这是一个**纯前端 SPA**（Single Page Application），没有后端 API，所以使用 **Workers 静态资源部署**。

- ✅ 有 `dist/` 目录（构建产物）
- ✅ 有 `dist/index.html`（SPA 入口）
- ❌ 没有 `src/index.ts`（没有 Worker 脚本）
- ❌ 没有 API 路由

---

## 🚀 部署方式

### 方式 1: 通过 Cloudflare Dashboard（推荐）

1. **登录 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com
   - 进入 "Workers 和 Pages"

2. **创建 Workers 应用**
   - 点击 "创建应用程序" (Create Application)
   - **选择 "Workers"**（不是 Pages）
   - 选择 "Connect to Git"
   - 选择仓库：`Jianan-Huang0609/AISkill-8Personalities`

3. **配置构建设置**
   - **构建命令**: `npm run build`
   - **部署命令**: `npx wrangler deploy`
   - **根目录**: `/`

4. **保存并部署**
   - Cloudflare 会自动：
     - 运行 `npm run build` 构建项目
     - 运行 `npx wrangler deploy` 部署到 Workers
     - 根据 `wrangler.toml` 配置上传静态资源

### 方式 2: 本地 CLI 部署

```bash
# 1. 构建项目
npm run build

# 2. 部署到 Cloudflare
npx wrangler deploy
```

或者使用快捷命令：

```bash
npm run deploy:cloudflare
```

---

## ⚙️ 配置说明

### `wrangler.toml` 配置

```toml
name = "ai-skill-tree-assessment"
compatibility_date = "2025-12-30"

[assets]
directory = "./dist"
not_found_handling = "single-page-application"
```

### 配置项说明

- **`name`**: Workers 应用名称
- **`compatibility_date`**: 兼容性日期（>= 2025-04-01 启用导航请求优化）
- **`assets.directory`**: 静态资源目录（指向构建产物 `dist/`）
- **`assets.not_found_handling`**: SPA 路由回退
  - 当请求的路径在 `dist/` 中找不到时，返回 `index.html`（200）
  - 这样前端路由（React Router）就能正常工作

### 为什么不需要 `main` 字段？

因为这是**纯静态资源部署**，没有 Worker 脚本需要执行。所有请求都会：
1. 先尝试匹配 `dist/` 中的静态文件
2. 如果找不到，返回 `index.html`（SPA 回退）

---

## 🔍 工作原理

### 请求处理流程

1. **静态资源请求**（如 `/assets/index.js`）
   - ✅ 直接返回 `dist/assets/index.js`

2. **前端路由请求**（如 `/result`）
   - ❌ 在 `dist/` 中找不到 `/result` 文件
   - ✅ 返回 `dist/index.html`（200）
   - React Router 在客户端处理路由

3. **导航请求优化**（`compatibility_date >= 2025-04-01`）
   - 浏览器直接打开的导航请求（`Sec-Fetch-Mode: navigate`）
   - 会优先走静态资源/SPA 回退
   - **不会触发 Worker 脚本**（节省调用次数）

### 为什么不用 Pages？

虽然 Pages 也能部署静态网站，但使用 Workers 静态资源部署的优势：

- ✅ 更灵活的配置（可以后续添加 Worker 脚本做 API）
- ✅ 统一的部署流程（一个 `wrangler.toml` 搞定）
- ✅ 更好的性能（导航请求优化）

---

## 🆘 故障排除

### 问题 1: 部署失败 - Invalid _redirects configuration

**症状**: 部署时报错 `Invalid _redirects configuration: Line 1: Infinite loop detected`

**原因**: `dist/_redirects` 文件存在，触发了无限重定向环

**解决**:
1. 确保 `public/_redirects` 和根目录 `_redirects` 都已删除
2. 清理构建缓存：删除 `dist/` 目录
3. 重新构建：`npm run build`
4. 确认 `dist/_redirects` 不存在
5. 重新部署

**注意**: 使用 `wrangler.toml` 中的 `not_found_handling = "single-page-application"` 就足够了，不需要 `_redirects` 文件。

### 问题 2: 部署后路由不工作

**症状**: 直接访问 `/result` 等路由返回 404

**解决**: 检查 `wrangler.toml` 中是否有：
```toml
[assets]
not_found_handling = "single-page-application"
```

### 问题 2: 构建失败

**症状**: `npm run build` 失败

**解决**: 
1. 检查 `package.json` 中的 `prebuild` 脚本
2. 确保可选依赖已安装：`npm install --include=optional`

### 问题 3: 部署命令失败

**症状**: `npx wrangler deploy` 报错

**解决**:
1. 确保已登录：`npx wrangler login`
2. 检查 `wrangler.toml` 配置是否正确
3. 确保 `dist/` 目录存在且包含 `index.html`

---

## 📝 后续扩展

如果将来需要添加 API 路由（比如 `/api/date`），可以：

1. **创建 Worker 脚本** (`src/index.ts`):
```typescript
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    
    if (url.pathname.startsWith('/api/')) {
      // 处理 API 请求
      return new Response(JSON.stringify({ date: new Date() }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 其他请求由静态资源处理
    return fetch(request);
  }
};
```

2. **更新 `wrangler.toml`**:
```toml
main = "src/index.ts"
[assets]
directory = "./dist"
not_found_handling = "single-page-application"
```

3. **如果需要 Worker 先执行**（比如做鉴权）:
```toml
[assets]
directory = "./dist"
not_found_handling = "single-page-application"
run_worker_first = true
```

---

## ✅ 验证部署

部署成功后，访问你的 Workers URL：
- 格式：`https://ai-skill-tree-assessment.[你的子域].workers.dev`
- 测试路由：访问 `/result` 应该返回 `index.html`（不是 404）

---

## 📚 参考文档

- [Cloudflare Workers 静态资源](https://developers.cloudflare.com/workers/static-assets/)
- [SPA 路由回退](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

