# Cloudflare Pages 部署配置

## 构建设置

在 Cloudflare Pages 项目设置中配置：

- **框架预设**: Vite
- **构建命令**: `npm run build`
- **构建输出目录**: `dist`
- **Node 版本**: 18 或更高
- **环境变量**: 无需特殊环境变量

## 注意事项

1. `_redirects` 文件已配置在 `public/` 目录，会自动复制到 `dist/` 目录
2. 确保 `package.json` 中的 `build` 脚本正确
3. 如果遇到可选依赖问题，`prebuild` 脚本会自动处理

## 部署步骤

1. 在 Cloudflare Pages 中创建新项目
2. 连接到 GitHub 仓库
3. 使用上述构建设置
4. 点击部署

