# 🌐 国内部署完整指南

## Vercel 国内访问说明

**好消息**：Vercel 在国内可以正常访问，**无需VPN**！

- ✅ Vercel 的 CDN 节点覆盖全球，包括亚洲
- ✅ 国内用户可以直接访问 `*.vercel.app` 域名
- ✅ 访问速度取决于你的网络环境，通常可以接受

### 如果访问较慢，可以：

1. **使用自定义域名** + 国内 DNS 服务商
2. **使用国内部署平台**（见下方替代方案）

---

## 🚀 快速部署步骤

### 第一步：准备代码

确保你的代码已经准备好：
```bash
# 测试构建
npm run build

# 如果构建成功，dist 目录会生成
```

### 第二步：推送到 GitHub

```bash
# 1. 初始化 Git（如果还没有）
git init

# 2. 添加所有文件
git add .

# 3. 提交
git commit -m "准备部署：AI技能树评测系统"

# 4. 在 GitHub 创建新仓库（网页操作）
# 5. 添加远程仓库
git remote add origin https://github.com/你的用户名/仓库名.git

# 6. 推送
git branch -M main
git push -u origin main
```

### 第三步：在 Vercel 部署

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 点击 "Sign Up" 或 "Log In"
   - 选择 "Continue with GitHub"

2. **导入项目**
   - 登录后，点击 "Add New..." → "Project"
   - 在 "Import Git Repository" 中找到你的仓库
   - 点击 "Import"

3. **配置项目**（通常自动检测，无需修改）
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **部署**
   - 点击 "Deploy"
   - 等待 1-3 分钟
   - 看到 "Congratulations!" 表示成功

5. **获取链接**
   - 部署完成后会显示：`https://your-project.vercel.app`
   - 这个链接可以立即访问和分享

---

## 📱 国内访问优化方案

### 方案A：自定义域名（推荐）

**优点**：访问速度快，专业

**步骤**：
1. 在 Vercel 项目设置 → Domains
2. 添加你的域名（如：`ai-skill.yourdomain.com`）
3. 按照提示配置 DNS：
   - 类型：CNAME
   - 名称：`ai-skill`（或你想要的子域名）
   - 值：`cname.vercel-dns.com`
4. 使用国内 DNS 服务商（阿里云、腾讯云）解析
5. 等待 DNS 生效（通常几分钟）

### 方案B：使用国内部署平台

如果 Vercel 访问确实很慢，可以使用：

#### 1. 腾讯云静态网站托管

**步骤**：
```bash
# 1. 构建项目
npm run build

# 2. 登录腾讯云控制台
# 3. 开通"静态网站托管"服务
# 4. 上传 dist 目录中的所有文件
# 5. 配置 CDN 加速（可选）
```

**优点**：国内访问快，有 CDN 加速

#### 2. 阿里云 OSS + CDN

**步骤**：
```bash
# 1. 构建项目
npm run build

# 2. 登录阿里云控制台
# 3. 创建 OSS 存储桶
# 4. 上传 dist 目录内容
# 5. 开启"静态网站托管"
# 6. 配置 CDN 加速
```

**优点**：国内访问快，成本低

#### 3. Cloudflare Pages（免费，全球 CDN）

**步骤**：
1. 访问 https://pages.cloudflare.com
2. 连接 GitHub 仓库
3. 配置构建命令：`npm run build`
4. 输出目录：`dist`
5. 部署

**优点**：免费，全球 CDN，国内访问也较快

---

## 🔧 部署配置说明

### vercel.json 配置

项目已包含 `vercel.json`，配置如下：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

这个配置确保：
- ✅ 单页应用路由正常工作
- ✅ 所有路径都指向 `index.html`
- ✅ Vite 项目正确构建

### 环境变量（如需要）

如果后续接入 AI API，可以在 Vercel 项目设置中添加：

1. 进入项目 → Settings → Environment Variables
2. 添加变量：
   - `VITE_OPENAI_API_KEY` = `你的API密钥`
   - `VITE_API_ENABLED` = `true`

---

## 📥 报告下载功能说明

### Markdown 下载
- ✅ 纯文本格式
- ✅ 包含完整分析内容
- ✅ 适合在 GitHub、Notion 等平台查看
- ✅ 文件大小小，下载快

### PDF 下载
- ✅ 包含图表和可视化
- ✅ 专业格式，适合打印
- ✅ 使用 html2canvas 截图生成
- ⚠️ 首次生成可能需要几秒钟

### 使用提示
1. 确保在"详细报告"视图下下载 PDF
2. 如果 PDF 生成失败，会自动降级到纯文本 PDF
3. 某些浏览器可能需要允许下载弹窗

---

## 🎯 部署后测试

部署完成后，请测试：

1. **基本功能**
   - [ ] 网站可以正常打开
   - [ ] 问卷可以正常填写
   - [ ] 结果可以正常显示

2. **下载功能**
   - [ ] Markdown 可以正常下载
   - [ ] PDF 可以正常下载
   - [ ] 下载的文件内容正确

3. **移动端**
   - [ ] 手机浏览器可以正常访问
   - [ ] 问卷填写体验良好
   - [ ] 结果展示正常

4. **性能**
   - [ ] 页面加载速度可接受
   - [ ] 3D 圣诞树可以正常显示（如果设备支持）

---

## 🔄 更新部署

### 自动更新（推荐）

如果使用 GitHub 集成：
- 推送代码到 `main` 分支
- Vercel 会自动检测并重新部署
- 通常 1-3 分钟完成

### 手动更新

如果使用 Vercel CLI：
```bash
vercel --prod
```

---

## 📊 监控和分析

### Vercel 分析

Vercel 提供免费的分析功能：
- 访问量统计
- 性能监控
- 错误日志

在项目 Dashboard 中可以查看。

### 自定义分析（可选）

如果需要更详细的分析，可以：
- 集成 Google Analytics
- 使用 Vercel Analytics
- 自定义埋点

---

## 🆘 故障排除

### 问题1：构建失败

**检查**：
- `package.json` 依赖是否正确
- Node.js 版本是否兼容（Vercel 默认 Node 18）
- 构建日志中的具体错误

**解决**：
- 查看 Vercel 构建日志
- 本地运行 `npm run build` 测试
- 检查 `vercel.json` 配置

### 问题2：页面空白

**检查**：
- 路由配置是否正确
- `vercel.json` 中的 rewrites 规则
- 浏览器控制台错误

**解决**：
- 确保 `vercel.json` 包含 SPA 路由重写规则
- 检查 `index.html` 是否正确

### 问题3：资源加载失败

**检查**：
- 静态资源路径是否正确
- Vite 构建配置

**解决**：
- 检查 `vite.config.ts` 中的 `base` 配置
- 确保资源使用相对路径

---

## 📝 总结

### 推荐部署流程

1. ✅ **本地测试** → 确保功能正常
2. ✅ **推送到 GitHub** → 代码管理
3. ✅ **Vercel 部署** → 快速上线
4. ✅ **测试功能** → 确保一切正常
5. ✅ **分享链接** → 让其他人使用

### 国内访问建议

- **首选**：Vercel + 自定义域名 + 国内 DNS
- **备选**：腾讯云/阿里云静态网站托管
- **免费方案**：Cloudflare Pages

---

## 🎉 完成！

现在你的网站已经可以分享给其他人使用了！

**分享链接格式**：
```
https://your-project.vercel.app
```

**二维码生成**：
- 使用在线工具（如 qrcode.tec-it.com）
- 生成二维码方便手机用户扫描

如有问题，请查看项目文档或 Vercel 官方文档。

