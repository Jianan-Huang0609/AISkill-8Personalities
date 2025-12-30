# Cloudflare Pages 部署配置

## 部署步骤

1. **连接 GitHub 仓库**
   - 在 Cloudflare Pages Dashboard 中点击 "Create a project"
   - 选择 "Connect to Git"
   - 选择你的 GitHub 仓库

2. **构建设置**
   - **Framework preset**: Vite
   - **Build command**: `npm run build` (会自动运行 prebuild)
   - **Build output directory**: `dist`
   - **Root directory**: `/` (项目根目录)

3. **环境变量**（如果需要）
   - 在项目设置中添加环境变量

4. **部署**
   - 提交代码后自动触发部署
   - 或手动触发部署

## 注意事项

- `prebuild` 脚本会自动安装可选依赖（包括 Linux 版本的 Rollup）
- 如果构建失败，检查构建日志
- 确保 `package.json` 中的 `prebuild` 脚本存在

