# 🎯 AI技能树评测系统 - 实施 TODO 清单

> 基于完整产品优化方案，按优先级和依赖关系组织的实施计划

---

## 📋 实施概览

| 阶段 | 模块 | 预估工作量 | 优先级 |
|------|------|------------|--------|
| Phase 1 | 基础架构改造 | 2-3天 | 🔴 最高 |
| Phase 2 | 首页预告页 | 1-2天 | 🔴 高 |
| Phase 3 | 职业定位分流 | 3-4天 | 🔴 高 |
| Phase 4 | 中英文切换 | 2-3天 | 🟡 中 |
| Phase 5 | 下载选项优化 | 1-2天 | 🟡 中 |
| Phase 6 | 评分机制完善 | 2-3天 | 🟡 中 |
| Phase 7 | 三层用户差异化 | 3-4天 | 🟢 低 |
| Phase 8 | 测试与优化 | 2-3天 | 🟢 低 |

---

## 🔴 Phase 1: 基础架构改造

### 1.1 数据结构定义
- [ ] **创建身份角色类型定义** `src/types/identity.ts`
  ```typescript
  // 10种身份角色定义
  // 3种问卷轨道: technical, application, exploration
  // 权重矩阵定义
  ```

- [ ] **创建问题分流数据结构** `src/types/questions.ts`
  ```typescript
  // 动态问题库结构
  // 按轨道分类的问题定义
  // 评分规则类型
  ```

- [ ] **创建语言国际化类型** `src/types/i18n.ts`
  ```typescript
  // Language type: 'zh' | 'en'
  // 翻译键值对类型
  ```

### 1.2 Context 创建
- [ ] **创建身份上下文** `src/contexts/IdentityContext.tsx`
  - 存储用户选择的身份
  - 计算当前轨道 (track)
  - 提供权重矩阵

- [ ] **创建语言上下文** `src/contexts/LanguageContext.tsx`
  - 当前语言状态
  - 切换语言函数
  - t() 翻译函数

- [ ] **更新 Questionnaire 组件结构**
  - 引入新的 step 逻辑: -1(预告页) → 0(身份定位) → 1+(问题)
  - 支持动态问题加载

### 1.3 翻译文件创建
- [ ] **创建中文翻译文件** `src/locales/zh.json`
- [ ] **创建英文翻译文件** `src/locales/en.json`
- [ ] **创建翻译加载工具** `src/utils/i18n.ts`

---

## 🔴 Phase 2: 首页预告页设计

### 2.1 预告页组件创建
- [ ] **创建 PreviewPage 组件** `src/components/PreviewPage.tsx`
  - 顶部钩子区域 (HeroSection)
  - 动态标题动画
  - 副标题说明

- [ ] **创建预览轮播组件** `src/components/PreviewCarousel.tsx`
  - 4张预览卡片自动轮播
  - 支持手动切换
  - 卡片内容:
    1. 人格类型预览
    2. 3D圣诞树预览
    3. 生态技能树预览
    4. 年度报告预览

- [ ] **创建信任信号组件** `src/components/TrustSignals.tsx`
  - ⏱️ 预计时间 (10-40分钟，根据身份自适应)
  - 🔒 数据安全说明
  - 🎁 完全免费说明

- [ ] **创建 CTA 按钮组件** `src/components/CTAButton.tsx`
  - 渐变背景
  - 脉冲动画
  - 子文案: "↓ 只需先回答3个基础问题"

- [ ] **创建示例展示组件** `src/components/SampleSection.tsx`
  - 展示3个示例人格卡片
  - 不同类型 + 分数

### 2.2 预览资源准备
- [ ] **创建人格名片示例图** `public/previews/personality-sample.png`
- [ ] **创建圣诞树示例图** `public/previews/christmas-tree-sample.png`
- [ ] **创建技能树示例图** `public/previews/skill-tree-sample.png`
- [ ] **创建报告示例图** `public/previews/report-sample.png`

### 2.3 集成到主流程
- [ ] **修改 Questionnaire.tsx**
  - currentStep = -1 时显示 PreviewPage
  - 点击开始后进入 step 0
  - 更新进度条逻辑

---

## 🔴 Phase 3: 职业定位分流

### 3.1 身份角色扩展
- [ ] **更新身份角色数据** `src/data/identities.ts`
  ```
  技术深度型 (technical):
  - 工程架构师 🏗️
  - 算法研究员 🔬
  - AI创业者 🚀
  
  应用构建型 (application):
  - 产品塑造者 🎨
  - 应用层开发者 💻
  - AI内容创作者 ✍️
  - 组织催化剂 🌐
  
  探索洞察型 (exploration):
  - 跨界探索者 🧭
  - AI Self-starter 🌱
  - AI投资人/观察者 👁️
  ```

- [ ] **更新权重矩阵** 
  - 10种身份 × 8个维度的权重配置
  - 归一化处理

### 3.2 产出形式扩展
- [ ] **更新产出选项** `src/data/questions.ts` Q0.2
  - 扩展到9种产出类型
  - 支持最多选3项
  - 根据产出微调权重

### 3.3 问题分流系统
- [ ] **创建问题分流逻辑** `src/utils/questionRouter.ts`
  - 根据身份轨道返回对应问题集
  - 动态问题生成函数

- [ ] **创建技术轨问题集** `src/data/questions/technical.ts`
  - 保持原有深度问题
  - Q1.1-Q1.4 技术版

- [ ] **创建应用轨问题集** `src/data/questions/application.ts`
  - Q1.1-app: 工具选择因素 (多选)
  - Q1.2-app: 输出不理想时的处理 (单选)
  - Q1.3-app: 主流工具理解程度 (评分矩阵)
  - Q1.4-app: 深度学习内容 (多选)

- [ ] **创建探索轨问题集** `src/data/questions/exploration.ts`
  - Q1.1-explore: 能解释给朋友的AI趋势 (多选)
  - Q1.2-explore: AI安全与伦理关注度 (量表)

- [ ] **更新 Questionnaire 组件**
  - 根据用户身份动态加载问题
  - 支持追问逻辑

### 3.4 PART 0 完成后反馈
- [ ] **创建 Part0Feedback 组件** `src/components/Part0Feedback.tsx`
  - 显示定制后的预计时长
  - 模糊技能树预览
  - 继续填写按钮

---

## 🟡 Phase 4: 中英文切换

### 4.1 核心翻译内容 (Phase 1)
- [ ] **翻译核心 UI 元素**
  - 预告页标题、副标题
  - 按钮文字 (开始、继续、提交、下载、分享)
  - 导航元素
  - 基础提示语

- [ ] **创建语言切换组件** `src/components/LanguageSwitch.tsx`
  - 中文/English 切换按钮
  - 集成到顶部导航

### 4.2 问卷内容翻译 (Phase 2)
- [ ] **翻译身份选项** (10种角色)
- [ ] **翻译问题标题** (按轨道分类)
- [ ] **翻译选项文本**
- [ ] **翻译追问内容**

### 4.3 结果报告翻译 (Phase 3)
- [ ] **翻译8种人格描述**
- [ ] **翻译维度说明**
- [ ] **翻译成长建议**
- [ ] **翻译徽章名称**

### 4.4 未翻译内容处理
- [ ] **创建占位符组件** `src/components/TranslationPending.tsx`
  - "English version coming soon"
  - 引导用户使用中文

---

## 🟡 Phase 5: 下载选项优化

### 5.1 下载区域重设计
- [ ] **更新 ResultPage 下载区域** `src/components/ResultPage.tsx`
  - 主下载: 人格名片 (PNG) - 保持不变
  - 次下载: 结论报告 (PDF) - 不含题目答案
  - 次下载: 完整测试 (PDF) - 含所有题目答案
  - 高级选项: Markdown (折叠隐藏)

### 5.2 PDF 生成逻辑更新
- [ ] **创建结论报告 PDF 生成函数** `src/utils/exportConclusion.ts`
  - 第1页: 人格名片
  - 第2页: 8维度雷达图
  - 第3页: 2026成长建议

- [ ] **创建完整测试 PDF 生成函数** `src/utils/exportFullTest.ts`
  - 包含结论报告所有内容
  - 附加: 所有问题 + 用户答案 + 得分明细

- [ ] **更新导出工具主文件** `src/utils/exportReport.ts`
  - 整合两种 PDF 导出
  - 保留 Markdown 导出 (作为高级选项)

### 5.3 下载 UI 优化
- [ ] **创建 DownloadCard 组件** `src/components/DownloadCard.tsx`
  - 图标 + 标题 + 描述
  - 下载按钮

- [ ] **创建 AdvancedOptions 折叠组件** `src/components/AdvancedOptions.tsx`
  - 默认折叠
  - 包含 Markdown 下载

---

## 🟡 Phase 6: 评分机制完善

### 6.1 三层评分系统
- [ ] **创建评分类型定义** `src/types/scoring.ts`
  - RawScore: 原始得分
  - AdjustedScore: 身份调整得分
  - DisplayScore: 最终展示得分

- [ ] **更新评分计算逻辑** `src/utils/scoring/`
  - `rawScoring.ts`: 原始得分计算
  - `adjustedScoring.ts`: 权重调整
  - `displayScoring.ts`: 展示分数转换

### 6.2 分轨道评分规则
- [ ] **技术轨评分规则** `src/utils/scoring/technicalScoring.ts`
- [ ] **应用轨评分规则** `src/utils/scoring/applicationScoring.ts`
- [ ] **探索轨评分规则** `src/utils/scoring/explorationScoring.ts`

### 6.3 即时反馈机制
- [ ] **创建 PartCompletionFeedback 组件** `src/components/PartCompletionFeedback.tsx`
  - 每个 PART 完成后显示该维度得分
  - 进度条动画
  - 文字反馈
  - 详细评分展开

### 6.4 相对评分系统 (可选)
- [ ] **创建百分位计算函数** `src/utils/percentile.ts`
  - 存储匿名评分数据
  - 计算用户在同角色中的百分位

---

## 🟢 Phase 7: 三层用户差异化

### 7.1 工程师用户 (深度认同)
- [ ] **创建 TechnicalProfile 组件** `src/components/profiles/TechnicalProfile.tsx`
  - 技术栈画像
  - 技术决策模式
  - 同行评价
  - 争议观点分析

### 7.2 营销/大佬用户 (破圈背书)
- [ ] **创建 ExecutiveSummary 组件** `src/components/profiles/ExecutiveSummary.tsx`
  - 非技术语言的能力描述
  - 适合的AI角色推荐
  - 社交身份名片
  - 年度总结可分享文案

### 7.3 小红书泛用户 (病毒传播)
- [ ] **创建人格标签系统** `src/utils/personalityTags.ts`
  - 主人格 + 次级标签
  - 成就徽章
  - 气质形容词
  - 拟人化动物
  - 专属配色

- [ ] **创建 XHSStyleCard 组件** `src/components/XHSStyleCard.tsx`
  - 小红书风格结果卡片
  - 标签云
  - 稀有徽章展示
  - 隐喻式描述

- [ ] **创建对比玩法** `src/components/CompareMode.tsx`
  - 输入朋友结果代码
  - 双雷达图对比
  - 互补/共鸣/差异分析
  - 生成对比海报

- [ ] **创建挑战任务系统** `src/components/Challenge2026.tsx`
  - 基于弱项生成挑战
  - 基于强项生成进阶挑战
  - 挑战进度追踪
  - 分享清单

---

## 🟢 Phase 8: 测试与优化

### 8.1 功能测试
- [ ] **测试预告页流程**
- [ ] **测试不同身份的问题分流**
- [ ] **测试中英文切换**
- [ ] **测试三种下载功能**
- [ ] **测试评分计算准确性**

### 8.2 性能优化
- [ ] **问题动态加载优化**
- [ ] **翻译懒加载**
- [ ] **PDF 生成性能优化**

### 8.3 移动端适配
- [ ] **预告页移动端布局**
- [ ] **问卷页面响应式**
- [ ] **结果页面移动端优化**

### 8.4 文档更新
- [ ] **更新 README.md**
- [ ] **更新 Plan.md**
- [ ] **创建用户指南**

---

## 🚀 快速开始

### 建议执行顺序
1. ✅ Phase 1.1-1.2: 数据结构 + Context (先搭好骨架)
2. ✅ Phase 3.1-3.2: 身份角色 + 产出扩展 (核心数据)
3. ✅ Phase 2: 预告页 (用户第一印象)
4. ✅ Phase 3.3-3.4: 问题分流 (核心逻辑)
5. ✅ Phase 5: 下载优化 (快速见效)
6. ✅ Phase 4: 中英文 (逐步完成)
7. ✅ Phase 6: 评分完善
8. ✅ Phase 7: 差异化设计
9. ✅ Phase 8: 测试优化

### 每日目标建议
- **Day 1**: Phase 1 基础架构
- **Day 2**: Phase 3.1-3.2 身份数据
- **Day 3**: Phase 2 预告页
- **Day 4-5**: Phase 3.3-3.4 问题分流
- **Day 6**: Phase 5 下载优化
- **Day 7-8**: Phase 4 中英文
- **Day 9-10**: Phase 6 评分机制
- **Day 11-13**: Phase 7 用户差异化
- **Day 14-15**: Phase 8 测试优化

---

## 📝 进度追踪

| 日期 | 完成模块 | 备注 |
|------|----------|------|
| | | |

---

*最后更新: 2025-12-30*

