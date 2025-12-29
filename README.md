# 2025年AI技能树评测系统

一个类似MBTI的AI技能评估问卷系统，帮助用户全方位复盘2025年的AI能力成长，生成专属技能树和人格类型报告。

## ✨ 功能特性

- 📋 **多步骤问卷系统**：包含身份定位、8个核心维度评估、校准与展望
- 🎯 **智能评分算法**：根据身份自动调整维度权重
- 🧩 **8种AI人格类型**：A-B-I、A-B-O、A-D-I、A-D-O、C-B-I、C-B-O、C-D-I、C-D-O
- 📊 **多维度可视化**：
  - 雷达图展示8个维度得分
  - 生态技能树（2D SVG）
  - 3D圣诞树（Three.js）
- 🏆 **成就徽章系统**：自动识别并展示特殊成就
- 💡 **个性化成长建议**：基于人格类型提供2026年发展方向
- 📥 **报告导出功能**：支持下载 Markdown 和 PDF 格式报告

## 🚀 快速开始

### 安装依赖

```bash
npm install
# 或
pnpm install
# 或
yarn install
```

### 启动开发服务器

```bash
npm run dev
# 或
pnpm dev
# 或
yarn dev
```

访问 http://localhost:3000 查看应用

### 构建生产版本

```bash
npm run build
# 或
pnpm build
```

## 🌐 部署到 Vercel

### 国内部署（无需VPN）

Vercel 在国内可以正常访问，推荐通过 GitHub 自动部署：

1. **将代码推送到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/你的用户名/ai-skill-tree-assessment.git
   git push -u origin main
   ```

2. **在 Vercel 部署**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录
   - 点击 "New Project"
   - 选择你的仓库
   - 点击 "Deploy" 即可

详细部署指南请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📁 项目结构

```
├── src/
│   ├── components/          # React组件
│   │   ├── Questionnaire.tsx      # 问卷主组件
│   │   ├── QuestionCard.tsx        # 问题卡片
│   │   ├── ResultView.tsx          # 结果展示
│   │   ├── RadarChart.tsx         # 雷达图
│   │   ├── PersonalityCard.tsx    # 人格卡片
│   │   ├── SkillTree.tsx          # 2D技能树
│   │   └── ChristmasTree3D.tsx    # 3D圣诞树
│   ├── data/
│   │   └── questions.ts            # 问题配置和评分规则
│   ├── store/
│   │   └── questionnaireStore.ts  # Zustand状态管理
│   ├── types/
│   │   └── questionnaire.ts       # TypeScript类型定义
│   ├── utils/
│   │   ├── scoring.ts              # 评分计算和人格判定
│   │   └── exportReport.ts        # 报告导出功能
│   ├── App.tsx                     # 主应用组件
│   └── main.tsx                    # 入口文件
├── package.json
├── vite.config.ts
├── vercel.json                    # Vercel部署配置
└── tsconfig.json
```

## 🎨 技术栈

- **React 18** - UI框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Framer Motion** - 动画效果
- **Zustand** - 状态管理
- **Three.js** - 3D可视化
- **@react-three/fiber** - React Three.js绑定
- **Recharts** - 图表库
- **jsPDF** - PDF生成
- **html2canvas** - 截图功能

## 📊 评估维度

1. **理论洞察力** - 对AI理论的理解深度
2. **工程实现力** - 实际项目交付能力
3. **学习敏捷度** - 快速学习和知识迁移
4. **AI协作力** - 人机协作效率
5. **信息雷达** - 前沿信息获取和预判
6. **创新突破力** - 原创探索和问题发现
7. **影响力声量** - 内容产出和观点传播
8. **表达审美力** - 产品美感和用户体验

## 🧩 人格类型

系统会根据8个维度的得分，计算三个核心维度：
- **抽象(A) vs 具体(C)**：理论洞察 vs 工程实现
- **广度(B) vs 深度(D)**：信息雷达+学习敏捷 vs 理论+工程
- **独立(I) vs 协作(O)**：创新突破 vs 协作+影响力

组合形成8种人格类型，每种类型都有独特的：
- 核心特质描述
- 超能力（优势）
- 成长建议

## 📥 报告导出

完成问卷后，可以下载两种格式的报告：

1. **Markdown 格式** (`.md`)
   - 纯文本格式
   - 适合在 GitHub、Notion 等平台查看
   - 包含完整的分析内容

2. **PDF 格式** (`.pdf`)
   - 包含图表和可视化
   - 适合打印和分享
   - 专业格式报告

## 🎯 使用流程

1. **身份定位**：选择AI主角色和产出形式
2. **填写问卷**：回答8个维度的评估问题
3. **查看结果**：
   - 详细报告：人格类型、维度得分、成就徽章
   - 生态技能树：可视化能力图谱
   - 年度圣诞树：3D交互式展示
4. **下载报告**：选择 MD 或 PDF 格式下载

## 📝 开发说明

### 添加新问题

在 `src/data/questions.ts` 中添加问题配置：

```typescript
{
  id: 'Q9.1',
  part: 'PART X',
  dimension: '维度名称',
  title: '问题标题',
  type: 'single' | 'multiple' | 'scale' | 'text',
  options: [...],
  scoring: (answer) => number,
  required: true,
}
```

### 自定义评分规则

修改 `src/utils/scoring.ts` 中的评分函数，或调整 `src/data/questions.ts` 中各问题的 `scoring` 函数。

### 添加新人格类型

在 `src/utils/scoring.ts` 的 `getPersonalityTypeDetails` 函数中添加新类型配置。

## 🤖 AI 增强（可选）

当前系统使用基于规则的算法，无需 AI API 即可运行。

如需更个性化的分析内容，可以接入 AI API。详细方案请查看 [AI_ENHANCEMENT.md](./AI_ENHANCEMENT.md)

## 📄 许可证

MIT License

## 👤 作者

Jianan