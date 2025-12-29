# 🔧 修复 Rollup 构建错误

## 问题描述

Vercel 部署时出现错误：
```
Error: Cannot find module '@rollup/rollup-linux-x64-gnu'
```

**原因**：
- `package-lock.json` 在 Windows 上生成，只安装了 Windows 平台的 Rollup 可选依赖
- Vercel 构建环境是 Linux，需要 Linux 版本的 Rollup
- `npm ci` 可能没有正确安装可选依赖

---

## ✅ 解决方案

### 方案1：修改安装命令（已应用）

已更新 `vercel.json`，使用 `npm install --include=optional` 确保安装所有可选依赖：

```json
{
  "installCommand": "npm install --include=optional"
}
```

### 方案2：删除 package-lock.json 让 Vercel 重新生成

如果方案1不行，可以：

1. **删除 package-lock.json**（不推荐，但可以尝试）
   ```bash
   git rm package-lock.json
   git commit -m "fix: 删除 package-lock.json，让 Vercel 重新生成"
   git push
   ```

2. **Vercel 会自动重新生成**，包含所有平台的可选依赖

### 方案3：在本地重新生成 package-lock.json

```bash
# 删除旧的 lock 文件
rm package-lock.json

# 重新安装（确保安装所有可选依赖）
npm install --include=optional

# 提交更新后的 lock 文件
git add package-lock.json
git commit -m "fix: 更新 package-lock.json，包含所有平台的可选依赖"
git push
```

---

## 🔍 验证修复

部署后检查构建日志，应该看到：
- ✅ 成功安装所有依赖
- ✅ 没有 Rollup 模块找不到的错误
- ✅ 构建成功完成

---

## 📝 技术说明

### 为什么会出现这个问题？

1. **可选依赖**：Rollup 使用可选依赖来支持不同平台
   - Windows: `@rollup/rollup-win32-x64-gnu`
   - Linux: `@rollup/rollup-linux-x64-gnu`
   - macOS: `@rollup/rollup-darwin-x64`

2. **npm ci vs npm install**：
   - `npm ci`：严格按照 lock 文件安装，可能跳过可选依赖
   - `npm install`：会安装所有可选依赖

3. **跨平台问题**：
   - Windows 生成的 lock 文件可能只包含 Windows 依赖
   - Linux 构建环境需要 Linux 依赖

### 最佳实践

1. **使用 `npm install --include=optional`**：
   - 确保安装所有可选依赖
   - 跨平台兼容性更好

2. **在 CI/CD 中测试**：
   - 确保构建在不同平台都能成功
   - 及早发现问题

3. **定期更新依赖**：
   - 保持依赖最新
   - 修复已知问题

---

## 🎯 如果问题仍然存在

1. **检查 Vercel 构建日志**：
   - 查看具体的错误信息
   - 确认是否还有其他问题

2. **尝试清除缓存**：
   - 在 Vercel 项目设置中清除构建缓存
   - 重新部署

3. **联系支持**：
   - 如果问题持续，可以联系 Vercel 支持
   - 提供详细的错误日志

---

## ✅ 当前状态

已更新 `vercel.json`，使用 `npm install --include=optional`。

**下一步**：
1. 提交更改到 GitHub
2. Vercel 会自动重新部署
3. 检查构建日志确认成功

