# 🔧 Cloudflare Pages 构建修复指南

## 问题描述

Cloudflare Pages 构建时出现错误：
```
Error: Cannot find module '@rollup/rollup-linux-x64-gnu'
```

**原因**：
- Cloudflare Pages 使用 `npm clean-install`（即 `npm ci`）
- `npm ci` 不会安装可选依赖
- Rollup 的平台特定依赖是可选依赖，需要手动安装

---

## ✅ 解决方案

### 方案1：使用自定义构建命令（推荐）

在 Cloudflare Pages 项目设置中，修改构建命令：

**原构建命令**：
```
npm run build
```

**新构建命令**：
```
npm run build:ci
```

这个命令会：
1. 先安装所有可选依赖（包括 Linux 版本的 Rollup）
2. 然后执行构建

### 方案2：直接在构建命令中安装（备选）

如果方案1不行，可以直接在 Cloudflare Pages 设置中使用：

**构建命令**：
```
npm ci && npm install --include=optional --no-save && npm run build
```

---

## 📋 配置步骤

### 在 Cloudflare Pages Dashboard 中配置

1. **登录 Cloudflare Pages**
   - 访问 https://dash.cloudflare.com
   - 进入你的项目

2. **进入构建设置**
   - 点击项目 → Settings → Builds & deployments

3. **修改构建命令**
   - 找到 "Build command" 字段
   - 将 `npm run build` 改为 `npm run build:ci`
   - 或使用：`npm ci && npm install --include=optional --no-save && npm run build`

4. **保存并重新部署**
   - 点击 "Save"
   - 触发新的部署

---

## 🔍 验证修复

部署后检查构建日志，应该看到：

1. ✅ `npm ci` 成功安装依赖
2. ✅ `npm install --include=optional` 安装可选依赖
3. ✅ 构建成功完成
4. ✅ 没有 Rollup 模块找不到的错误

---

## 📝 技术说明

### 为什么需要这个修复？

1. **npm ci 的限制**：
   - `npm ci` 严格按照 `package-lock.json` 安装
   - 不会安装可选依赖（optional dependencies）
   - 这是为了确保构建的可重复性

2. **Rollup 的可选依赖**：
   - Rollup 使用可选依赖来支持不同平台
   - Windows: `@rollup/rollup-win32-x64-gnu`
   - Linux: `@rollup/rollup-linux-x64-gnu`
   - macOS: `@rollup/rollup-darwin-x64`

3. **跨平台问题**：
   - 本地开发（Windows）生成的 `package-lock.json`
   - Cloudflare Pages 在 Linux 环境构建
   - 需要 Linux 版本的 Rollup

### package.json 中的脚本

已添加两个脚本：

1. **`build:ci`**：
   ```json
   "build:ci": "npm install --include=optional --no-save && npm run build"
   ```
   - 先安装可选依赖
   - 然后执行构建

2. **`postinstall`**：
   ```json
   "postinstall": "npm install --include=optional --no-save || true"
   ```
   - 在 `npm install` 后自动运行
   - 确保可选依赖被安装
   - `|| true` 确保即使失败也不影响构建

---

## 🎯 最佳实践

### 1. 使用 build:ci 脚本

**优点**：
- ✅ 清晰明确
- ✅ 易于维护
- ✅ 可以在本地测试

**使用**：
- Cloudflare Pages：使用 `npm run build:ci`
- 本地开发：使用 `npm run build`

### 2. 定期更新依赖

```bash
# 更新所有依赖
npm update

# 更新特定依赖
npm update rollup vite

# 重新生成 lock 文件
rm package-lock.json
npm install
```

### 3. 在 CI/CD 中测试

确保构建在不同平台都能成功：
- Windows（本地开发）
- Linux（Cloudflare Pages）
- macOS（可选）

---

## 🚨 如果问题仍然存在

### 检查清单

- [ ] Cloudflare Pages 构建命令已更新为 `npm run build:ci`
- [ ] `package.json` 中包含 `build:ci` 脚本
- [ ] 构建日志显示可选依赖被安装
- [ ] 没有其他构建错误

### 其他解决方案

1. **清除构建缓存**：
   - 在 Cloudflare Pages 设置中清除缓存
   - 重新部署

2. **删除 package-lock.json**：
   - 让 Cloudflare Pages 在 Linux 环境下重新生成
   - 会包含所有平台的可选依赖

3. **联系支持**：
   - 如果问题持续，联系 Cloudflare 支持
   - 提供详细的构建日志

---

## ✅ 当前状态

已更新 `package.json`，添加了：
- ✅ `build:ci` 脚本：安装可选依赖后构建
- ✅ `postinstall` 脚本：自动安装可选依赖

**下一步**：
1. 在 Cloudflare Pages 设置中将构建命令改为 `npm run build:ci`
2. 保存并重新部署
3. 检查构建日志确认成功

---

## 📚 相关文档

- [Vercel 构建修复](./FIX_ROLLUP_ERROR.md)
- [多平台部署指南](./MULTI_PLATFORM_DEPLOYMENT.md)
- [Cloudflare Pages 官方文档](https://developers.cloudflare.com/pages/)

---

**修复后，Cloudflare Pages 应该能成功构建了！** 🎉

