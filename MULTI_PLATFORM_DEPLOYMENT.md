# 🌐 多平台部署指南

## ✅ 可以同时使用 Vercel 和 Cloudflare Pages！

**答案：完全可以！** 这是一个很好的实践，可以带来以下好处：

### 🎯 多平台部署的优势

1. **冗余备份** 🛡️
   - 一个平台出问题时，另一个可以继续服务
   - 提高服务可用性

2. **地区优化** 🌍
   - Vercel：适合海外用户
   - Cloudflare Pages：适合国内用户
   - 不同地区可以选择最快的平台

3. **A/B 测试** 🧪
   - 可以测试不同平台的性能
   - 比较访问速度和稳定性

4. **免费额度叠加** 💰
   - 两个平台的免费额度可以叠加使用
   - 适合高流量项目

---

## 🚀 部署策略

### 策略1：主备模式（推荐）

**主平台**：Cloudflare Pages（国内访问快）
**备用平台**：Vercel（海外访问快）

**配置**：
- 两个平台都连接同一个 GitHub 仓库
- 自动部署到两个平台
- 使用不同域名或子域名

### 策略2：地区分流

**国内用户**：访问 Cloudflare Pages
**海外用户**：访问 Vercel

**实现**：
- 使用 DNS 智能解析
- 或使用 CDN 的智能路由

### 策略3：功能分流

**主站**：Cloudflare Pages
**预览/测试**：Vercel

---

## 📋 配置步骤

### 第一步：确保配置兼容

项目已经配置好了，两个平台都可以使用：

✅ **Vercel 配置**：`vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [...]
}
```

✅ **Cloudflare Pages 配置**：`_redirects`
```
/*    /index.html   200
```

两个配置文件**互不冲突**，可以同时存在。

### 第二步：在 Vercel 部署

1. 访问 https://vercel.com
2. 连接 GitHub 仓库
3. 自动检测配置（已配置好）
4. 部署

**获得链接**：`https://your-project.vercel.app`

### 第三步：在 Cloudflare Pages 部署

1. 访问 https://pages.cloudflare.com
2. 连接同一个 GitHub 仓库
3. 配置：
   - Build command: `npm run build`
   - Output directory: `dist`
4. 部署

**获得链接**：`https://your-project.pages.dev`

### 第四步：配置自动部署

两个平台都支持自动部署：

- **Vercel**：推送到 `main` 分支自动部署
- **Cloudflare Pages**：推送到 `main` 分支自动部署

**结果**：每次 `git push` 后，两个平台都会自动部署！

---

## 🔧 配置兼容性检查

### ✅ 兼容的配置

以下配置两个平台都支持：

1. **构建命令**：`npm run build` ✅
2. **输出目录**：`dist` ✅
3. **Node.js 版本**：自动选择 ✅
4. **环境变量**：都支持 ✅
5. **路由重写**：
   - Vercel：使用 `vercel.json` 中的 `rewrites`
   - Cloudflare：使用 `_redirects` 文件
   - **两者可以共存** ✅

### ⚠️ 需要注意的差异

1. **路由配置**
   - Vercel：使用 `vercel.json` 的 `rewrites`
   - Cloudflare：使用 `_redirects` 文件
   - **解决方案**：两个文件都保留，互不影响

2. **环境变量**
   - 需要在两个平台分别配置
   - 变量名和值保持一致

3. **自定义域名**
   - 每个平台需要单独配置
   - 可以使用不同的子域名

---

## 🌐 域名配置方案

### 方案1：使用不同子域名

```
主站（Cloudflare）：https://ai-skill.yourdomain.com
备用（Vercel）：https://ai-skill-v.yourdomain.com
```

**DNS 配置**：
- `ai-skill` → Cloudflare Pages
- `ai-skill-v` → Vercel

### 方案2：使用不同域名

```
主站（Cloudflare）：https://ai-skill.com
备用（Vercel）：https://ai-skill.net
```

### 方案3：智能解析（高级）

使用 DNS 智能解析，根据用户地区自动选择：
- 国内用户 → Cloudflare Pages
- 海外用户 → Vercel

---

## 📊 监控和对比

### 访问统计

**Vercel Analytics**：
- 在 Vercel Dashboard 查看
- 访问量、性能指标、错误日志

**Cloudflare Analytics**：
- 在 Cloudflare Dashboard 查看
- 访问量、地理位置、性能数据

### 性能对比

可以对比两个平台的：
- 页面加载速度
- 首屏渲染时间
- 错误率
- 不同地区的访问速度

---

## 🎯 最佳实践

### 1. 保持配置同步

确保两个平台的配置一致：
- ✅ 构建命令相同
- ✅ 环境变量相同
- ✅ 部署分支相同

### 2. 定期检查部署状态

- 定期查看两个平台的部署日志
- 确保两个平台都部署成功
- 及时发现和解决问题

### 3. 使用 CI/CD

可以配置 GitHub Actions 来：
- 自动测试构建
- 同时部署到两个平台
- 验证部署成功

### 4. 文档化

记录：
- 两个平台的访问链接
- 配置差异
- 故障切换流程

---

## 🔄 故障切换

如果主平台出现问题：

1. **立即切换**
   - 更新 DNS 指向备用平台
   - 或通知用户使用备用链接

2. **监控恢复**
   - 监控主平台状态
   - 恢复后切换回来

3. **事后分析**
   - 分析故障原因
   - 优化配置避免再次发生

---

## 📝 环境变量管理

### 在两个平台配置相同的环境变量

**Vercel**：
1. 项目设置 → Environment Variables
2. 添加变量（如 `VITE_OPENAI_API_KEY`）

**Cloudflare Pages**：
1. 项目设置 → Environment variables
2. 添加相同的变量

**建议**：使用 `.env.example` 文件记录所有需要的环境变量。

---

## 🚨 常见问题

### Q1: 两个平台会冲突吗？

**A**: 不会。它们是完全独立的部署，互不影响。

### Q2: 需要维护两套配置吗？

**A**: 不需要。构建配置是共享的，只需要：
- `vercel.json`（Vercel 专用）
- `_redirects`（Cloudflare 专用）
- 其他配置都是共享的

### Q3: 会消耗更多资源吗？

**A**: 不会。两个平台都是免费的，只是部署到两个地方。

### Q4: 如何确保两个平台同步？

**A**: 都连接同一个 GitHub 仓库，每次 push 都会自动部署。

### Q5: 可以只部署到其中一个吗？

**A**: 可以。可以随时启用或禁用某个平台的自动部署。

---

## 🎉 总结

### ✅ 推荐配置

1. **主平台**：Cloudflare Pages（国内访问快）
2. **备用平台**：Vercel（海外访问快）
3. **自动部署**：两个平台都启用
4. **域名配置**：使用不同子域名或智能解析

### 📋 检查清单

- [ ] Vercel 部署成功
- [ ] Cloudflare Pages 部署成功
- [ ] 两个平台都能正常访问
- [ ] 自动部署已启用
- [ ] 环境变量已配置（如需要）
- [ ] 自定义域名已配置（如需要）
- [ ] 监控和分析已设置

---

## 🔗 相关文档

- [Vercel 部署指南](./DEPLOYMENT.md)
- [Cloudflare Pages 部署指南](./CLOUDFLARE_DEPLOYMENT.md)
- [手机访问问题排查](./MOBILE_ACCESS_TROUBLESHOOTING.md)

---

**现在你可以同时使用两个平台了！** 🎊

每次代码更新，两个平台都会自动部署，确保服务的高可用性。

