# Cloudflare Pages 部署配置

## ⚠️ 重要提示

**不要设置自定义部署命令（Deploy command）！**

Cloudflare Pages 会自动处理部署，设置 `npx wrangler deploy` 会导致错误。

## 构建设置

在 Cloudflare Pages 项目设置中配置：

- **框架预设**: Vite
- **构建命令**: `npm run build`
- **构建输出目录**: `dist`
- **Node 版本**: 18 或更高
- **部署命令**: ⚠️ **留空或删除**（不要设置任何值！）
- **环境变量**: 无需特殊环境变量

## 注意事项

1. `_redirects` 文件已配置在 `public/` 目录，会自动复制到 `dist/` 目录
2. 确保 `package.json` 中的 `build` 脚本正确
3. 如果遇到可选依赖问题，`prebuild` 脚本会自动处理
4. **不要设置部署命令**，Cloudflare Pages 会自动上传 `dist` 目录

## 部署步骤

1. 在 Cloudflare Pages 中创建新项目
2. 连接到 GitHub 仓库
3. 使用上述构建设置
4. **确保"Deploy command"字段为空**
5. 点击部署

## 故障排除

如果看到错误：`Missing entry-point to Worker script or to assets directory`

**原因**：设置了错误的部署命令 `npx wrangler deploy`

**解决**：
1. 进入项目设置 → Builds & deployments
2. 找到 "Deploy command" 字段
3. **删除或留空**该字段
4. 保存并重新部署

