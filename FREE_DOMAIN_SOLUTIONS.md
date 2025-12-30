# 免费/低成本域名解决方案

## 🎯 你的需求

1. ✅ 国内可以访问
2. ✅ 便宜或免费
3. ✅ 不想公开所有代码到 GitHub

---

## 💡 方案对比

| 方案 | 成本 | 国内访问 | 代码隐私 | 推荐度 |
|------|------|----------|----------|--------|
| **方案1: Cloudflare Pages + 免费域名** | 免费 | ⭐⭐⭐⭐ | ✅ 私有仓库 | ⭐⭐⭐⭐⭐ |
| **方案2: Cloudflare Pages + 便宜域名** | $1-2/年 | ⭐⭐⭐⭐⭐ | ✅ 私有仓库 | ⭐⭐⭐⭐⭐ |
| **方案3: GitHub Pages 私有仓库** | $4/月 | ⭐⭐⭐ | ✅ 完全私有 | ⭐⭐⭐ |
| **方案4: Vercel + 免费域名** | 免费 | ⭐⭐⭐ | ✅ 私有仓库 | ⭐⭐⭐⭐ |

---

## 🏆 方案1: Cloudflare Pages + Freenom 免费域名（推荐）

### 优点
- ✅ **完全免费**
- ✅ 国内访问稳定（通过 Cloudflare CDN）
- ✅ 代码可以放在私有 GitHub 仓库
- ✅ Cloudflare Pages 免费额度充足

### 缺点
- ⚠️ 免费域名（.tk/.ml/.ga/.cf）可能不够专业
- ⚠️ 某些免费域名服务商可能不稳定

### 步骤

#### 1. 获取免费域名

**Freenom**（提供 .tk, .ml, .ga, .cf 等免费域名）：
1. 访问 https://www.freenom.com
2. 注册账号
3. 搜索想要的域名（如 `ai-skill-2025.tk`）
4. 选择免费期限（通常 12 个月）
5. 完成注册

**注意**：
- 免费域名每年需要续期
- 某些域名可能被滥用，建议选择不太常见的

#### 2. 将域名添加到 Cloudflare

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 点击 "Add a site"
3. 输入你的免费域名
4. 选择免费计划
5. 按照提示更新域名的 DNS 服务器到 Cloudflare

#### 3. 在 Cloudflare Pages 绑定域名

1. 进入你的 Pages 项目
2. 点击 "Custom domains"
3. 添加你的免费域名
4. 等待 DNS 和 SSL 生效（通常几分钟）

---

## 💰 方案2: Cloudflare Pages + 超便宜域名（最推荐）

### 优点
- ✅ **非常便宜**（$1-2/年，约 ¥7-14/年）
- ✅ 国内访问稳定
- ✅ 代码可以放在私有 GitHub 仓库
- ✅ 域名更专业、更稳定

### 推荐域名后缀

**超便宜域名**（通常 $1-2/年）：
- `.xyz` - 通用，$1-2/年
- `.pw` - 专业网站，$1-2/年
- `.top` - 通用，$1-2/年
- `.site` - 通用，$2-3/年
- `.online` - 通用，$2-3/年

### 推荐注册商

1. **Namecheap**（推荐）
   - 价格：$1-2/年
   - 支持支付宝/微信支付
   - 网址：https://www.namecheap.com

2. **Cloudflare Registrar**（最推荐）
   - 价格：成本价（通常 $8-10/年，但.com/.net等）
   - 无隐藏费用
   - 自动配置 DNS
   - 网址：在 Cloudflare Dashboard 中直接购买

3. **NameSilo**
   - 价格：$1-2/年
   - 支持支付宝
   - 网址：https://www.namesilo.com

### 步骤

1. **购买域名**（以 Namecheap 为例）：
   - 访问 https://www.namecheap.com
   - 搜索想要的域名（如 `ai-skill-2025.xyz`）
   - 加入购物车并结账（支持支付宝）

2. **将域名添加到 Cloudflare**：
   - 登录 Cloudflare Dashboard
   - 添加站点
   - 更新 DNS 服务器

3. **绑定到 Cloudflare Pages**：
   - 在 Pages 项目中添加自定义域名
   - 等待生效

---

## 🔒 方案3: GitHub Pages 私有仓库（需要付费）

### 优点
- ✅ 代码完全私有
- ✅ GitHub 集成好
- ✅ 免费域名：`username.github.io`

### 缺点
- ❌ GitHub Pages 免费版只支持公开仓库
- ❌ 私有仓库需要 GitHub Pro（$4/月）
- ⚠️ 国内访问可能不稳定

### 如果选择这个方案

1. 升级到 GitHub Pro（$4/月）
2. 创建私有仓库
3. 启用 GitHub Pages
4. 绑定自定义域名（可选）

---

## 🚀 方案4: Vercel + 免费域名

### 优点
- ✅ 完全免费
- ✅ 支持私有 GitHub 仓库
- ✅ 自动部署

### 缺点
- ⚠️ 国内访问可能不如 Cloudflare 稳定

### 步骤

1. 使用 Freenom 获取免费域名
2. 在 Vercel 中部署项目
3. 在 Vercel 中添加自定义域名
4. 配置 DNS

---

## 📋 我的推荐

### 🥇 最佳方案：Cloudflare Pages + 便宜域名（.xyz/.pw）

**理由**：
- 成本极低（¥7-14/年，一杯奶茶钱）
- 国内访问稳定
- 代码可以私有
- 域名专业、稳定

**具体操作**：
1. 在 Namecheap 购买 `.xyz` 域名（约 $1-2/年）
2. 将域名添加到 Cloudflare
3. 在 Cloudflare Pages 绑定域名
4. 完成！

### 🥈 备选方案：Cloudflare Pages + Freenom 免费域名

**理由**：
- 完全免费
- 国内访问稳定
- 代码可以私有

**注意**：
- 免费域名可能不够专业
- 需要每年续期

---

## 🔐 关于代码隐私

### Cloudflare Pages 支持私有仓库

✅ **可以**：
- 使用 GitHub 私有仓库
- 只部署构建后的 `dist/` 目录
- 源代码不公开

### 如何设置

1. **创建私有 GitHub 仓库**
   ```bash
   # 在 GitHub 创建私有仓库
   # 然后推送代码
   git remote add origin https://github.com/username/private-repo.git
   git push -u origin main
   ```

2. **在 Cloudflare Pages 连接私有仓库**
   - Cloudflare 会请求 GitHub 授权
   - 授权后可以选择私有仓库
   - 只有构建产物会被部署，源代码不公开

3. **选择性部署**
   - 可以配置只部署 `dist/` 目录
   - 源代码始终在私有仓库中

---

## 💡 额外建议

### 如果预算允许（推荐）

**购买一个便宜的 `.xyz` 或 `.pw` 域名**：
- 成本：¥7-14/年
- 优点：专业、稳定、好记
- 推荐注册商：Namecheap 或 Cloudflare Registrar

### 如果完全不想花钱

**使用 Freenom 免费域名**：
- 成本：免费
- 优点：完全免费
- 注意：需要每年续期，某些域名可能不稳定

---

## 🎯 快速开始（推荐方案）

### 步骤1: 购买便宜域名（5分钟）

1. 访问 https://www.namecheap.com
2. 搜索 `ai-skill-2025.xyz`（或你喜欢的名字）
3. 加入购物车，使用支付宝支付（约 ¥10）
4. 完成购买

### 步骤2: 配置 Cloudflare（5分钟）

1. 登录 Cloudflare Dashboard
2. 添加站点（你的新域名）
3. 更新 DNS 服务器（按照提示）

### 步骤3: 绑定到 Pages（2分钟）

1. 进入 Cloudflare Pages 项目
2. 添加自定义域名
3. 等待生效（通常几分钟）

### 步骤4: 完成！

现在你的网站可以通过自定义域名访问了，国内用户也可以正常访问！

---

## 📚 参考链接

- **Namecheap**: https://www.namecheap.com
- **Freenom**: https://www.freenom.com
- **Cloudflare Registrar**: 在 Cloudflare Dashboard 中
- **Cloudflare Pages**: https://pages.cloudflare.com

---

## ❓ 常见问题

### Q: 免费域名可靠吗？

A: Freenom 的免费域名基本可靠，但建议：
- 选择不太常见的域名
- 每年及时续期
- 如果预算允许，建议购买便宜域名（¥10/年）

### Q: 私有仓库部署会暴露代码吗？

A: **不会**。Cloudflare Pages 只部署构建后的 `dist/` 目录，源代码不会公开。

### Q: 国内访问速度如何？

A: Cloudflare 有全球 CDN，包括中国节点，访问速度通常不错。

### Q: 可以同时使用多个域名吗？

A: 可以！Cloudflare Pages 支持绑定多个自定义域名。

