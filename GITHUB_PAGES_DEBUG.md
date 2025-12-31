# GitHub Pages 调试指南

## 🔍 问题诊断步骤

如果 GitHub Pages 显示空白页，按以下步骤检查：

### 1. 检查浏览器控制台

打开网站后，按 F12 打开开发者工具，查看：

**Console 标签**：
- 是否有 JavaScript 错误？
- 是否有 404 错误（找不到 JS/CSS 文件）？

**Network 标签**：
- `index.html` 是否成功加载（状态码 200）？
- JS/CSS 文件是否成功加载？
- 如果文件路径是 `/assets/xxx.js` 而不是 `/AISkill-8Personalities/assets/xxx.js`，说明 base 路径未生效

### 2. 检查 GitHub Actions 构建日志

1. 进入仓库的 **Actions** 标签
2. 查看最新的 "Deploy to GitHub Pages" 工作流
3. 检查构建步骤是否成功
4. 查看是否有错误信息

### 3. 检查实际部署的文件

访问以下 URL 检查文件是否存在：

- `https://jianan-huang0609.github.io/AISkill-8Personalities/index.html`
- `https://jianan-huang0609.github.io/AISkill-8Personalities/assets/index-xxx.js`（替换为实际文件名）
- `https://jianan-huang0609.github.io/AISkill-8Personalities/404.html`

### 4. 检查资源路径

在浏览器中查看 `index.html` 的源代码（右键 → 查看页面源代码），检查：

- JS 文件路径应该是：`/AISkill-8Personalities/assets/xxx.js`
- CSS 文件路径应该是：`/AISkill-8Personalities/assets/xxx.css`

如果路径是 `/assets/xxx.js`（没有前缀），说明 base 路径配置未生效。

---

## 🛠️ 常见问题及解决方案

### 问题 1: 资源文件 404

**症状**: 控制台显示 JS/CSS 文件 404 错误

**原因**: base 路径未正确配置

**解决**:
1. 确认 `vite.config.ts` 中 base 路径配置正确
2. 确认 GitHub Actions 构建时设置了 `GITHUB_PAGES=true`
3. 重新触发部署

### 问题 2: 页面完全空白

**症状**: 页面加载但没有任何内容

**可能原因**:
1. JavaScript 执行错误
2. React 应用未正确初始化
3. 路由配置问题

**解决**:
1. 检查浏览器控制台的错误信息
2. 确认 React 应用正确挂载到 `#root` 元素
3. 检查是否有路由相关的错误

### 问题 3: 路由不工作

**症状**: 直接访问 `/result` 等路由显示 404

**解决**:
1. 确认 `404.html` 文件已部署
2. 检查 `404.html` 中的路径是否正确

---

## ✅ 验证清单

部署后验证：

- [ ] 访问 `https://jianan-huang0609.github.io/AISkill-8Personalities/` 可以看到页面
- [ ] 浏览器控制台没有错误
- [ ] 所有资源文件（JS/CSS）都成功加载（Network 标签中显示 200）
- [ ] 资源文件路径包含 `/AISkill-8Personalities/` 前缀
- [ ] 路由正常工作（如访问 `/result`）

---

## 📝 手动测试步骤

如果自动部署有问题，可以手动测试：

1. **本地构建（模拟 GitHub Pages）**：
   ```bash
   GITHUB_PAGES=true npm run build
   ```

2. **检查构建产物**：
   ```bash
   cat dist/index.html | grep -E "(src=|href=)"
   ```
   应该看到路径包含 `/AISkill-8Personalities/`

3. **本地预览**：
   ```bash
   cd dist
   python3 -m http.server 8000
   ```
   然后访问 `http://localhost:8000/AISkill-8Personalities/`

---

## 🆘 如果还是不行

如果按照上述步骤检查后仍然无法解决：

1. **提供以下信息**：
   - 浏览器控制台的完整错误信息
   - GitHub Actions 构建日志
   - 实际访问的 URL

2. **临时解决方案**：
   - 可以暂时使用 Cloudflare Workers 部署（已经配置好了）
   - 或者使用 Vercel 部署

