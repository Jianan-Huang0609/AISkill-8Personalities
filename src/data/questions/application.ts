import { Question } from '../questions';
import { questions } from '../questions';

// 应用轨问题集（简化版，适合应用层开发者）
export const questionsApplication: Question[] = [
  // PART 1: 维度1 - 理论洞察力（应用版）
  {
    id: 'Q1.1-app',
    part: 'PART 1',
    dimension: '理论洞察力',
    title: '在选择AI工具时，以下哪些因素你会重点考虑？（可多选）',
    type: 'multiple',
    options: [
      { value: 'ease', label: '易用性：上手快，无需复杂配置' },
      { value: 'cost', label: '成本：价格合理，性价比高' },
      { value: 'quality', label: '输出质量：结果准确、符合甚至超过预期' },
      { value: 'integration', label: '集成能力：能与现有工作流结合' },
      { value: 'privacy', label: '数据安全：对敏感信息有保障' },
      { value: 'support', label: '社区/客服：遇到问题有帮助' },
      { value: 'customization', label: '可定制性：能根据需求调整' },
    ],
    scoring: (answer: string[]) => {
      const hasQuality = answer.includes('quality');
      const hasIntegration = answer.includes('integration');
      const hasCustomization = answer.includes('customization');
      const count = answer.length;
      
      let score = (count / 7) * 10; // 基础分
      if (hasQuality && hasIntegration && hasCustomization) {
        score = Math.min(score + 1, 10); // 加分
      }
      return Math.min(score, 10);
    },
    required: true,
  },
  {
    id: 'Q1.2-app',
    part: 'PART 1',
    dimension: '理论洞察力',
    title: '当AI工具输出不理想时，你通常会：',
    type: 'single',
    options: [
      { value: 'A', label: 'A. 调整提示词/输入，反复尝试' },
      { value: 'B', label: 'B. 换一个类似工具试试' },
      { value: 'C', label: 'C. 人工修正AI输出' },
      { value: 'D', label: 'D. 放弃使用，回归传统方式' },
    ],
    scoring: (answer: string, text?: string) => {
      if (answer === 'A' && text && text.length > 20) return 9;
      if (answer === 'A') return 8;
      if (answer === 'B') return 7;
      if (answer === 'C') return 6;
      return 4;
    },
    required: true,
    followUp: {
      condition: (answer: string) => ['A', 'B'].includes(answer),
      question: '请简述一次调整后效果显著提升的经历：',
      type: 'text',
    },
  },
  {
    id: 'Q1.3-app',
    part: 'PART 1',
    dimension: '理论洞察力',
    title: '你对当前主流AI工具的理解程度：',
    type: 'scale',
    options: [
      { value: 'chatgpt', label: 'ChatGPT/Claude（对话AI）' },
      { value: 'image', label: 'Midjourney/DALL-E（图像生成）' },
      { value: 'code', label: 'Cursor/Copilot（代码辅助）' },
      { value: 'doc', label: 'Notion AI/Gamma（文档工具）' },
    ],
    scoring: (answers: Record<string, number>) => {
      const scores = Object.values(answers);
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      let score = (avg / 5) * 10;
      const highCount = scores.filter(s => s >= 4).length;
      if (highCount >= 2) score = Math.min(score + 1, 10);
      return Math.min(score, 10);
    },
    required: true,
  },
  {
    id: 'Q1.4-app',
    part: 'PART 1',
    dimension: '理论洞察力',
    title: '你在2025年深度学习过的AI相关内容：',
    type: 'multiple',
    options: [
      { value: 'course', label: '完整的在线课程（如吴恩达课程、OpenAI课程）' },
      { value: 'tutorial', label: '系列教程/实战项目' },
      { value: 'blog', label: '深度技术博客/文章' },
      { value: 'video', label: 'YouTube技术讲解视频' },
      { value: 'book', label: 'AI相关书籍' },
      { value: 'lab_paper', label: '核心公司Lab Paper与洞察类报告（OpenAI、Anthropic、Google DeepMind等官方论文资讯）' },
      { value: 'arxiv', label: 'arXiv - 最新学术论文预印本' },
    ],
    scoring: (answer: string[]) => {
      const count = answer.length;
      const hasCourse = answer.includes('course');
      const hasBook = answer.includes('book');
      // 高质量来源加分
      const hasHighQuality = answer.includes('lab_paper') || answer.includes('arxiv') || answer.includes('x_kol');
      let score = (count / 9) * 10; // 调整为9个选项
      if (hasCourse || hasBook) score = Math.min(score + 0.5, 10);
      if (hasHighQuality && count >= 3) {
        score = Math.min(score + 1, 10); // 有高质量来源且选择较多时加分
      }
      return Math.min(score, 10);
    },
    required: true,
    followUp: {
      condition: () => true,
      question: '举例一个对你帮助最大的学习资源：',
      type: 'text',
    },
  },
  
  // PART 1: 维度2 - 工程实现力（应用版，简化）
  {
    id: 'Q2.1-app',
    part: 'PART 1',
    dimension: '工程实现力',
    title: '2025年，你使用AI工具完成的项目类型：（可多选）',
    type: 'multiple',
    options: [
      { value: 'automation', label: '工作流程自动化：用AI工具提升效率' },
      { value: 'content', label: '内容生成项目：文案、图像、视频等' },
      { value: 'analysis', label: '数据分析项目：用AI处理和分析数据' },
      { value: 'integration', label: '工具集成：将AI工具集成到现有系统' },
      { value: 'prototype', label: '快速原型：用AI快速验证想法' },
      { value: 'product', label: '产品功能：在产品中集成AI能力' },
    ],
    scoring: (answer: string[]) => {
      const count = answer.length;
      if (count >= 5) return 9;
      if (count >= 3) return 7;
      if (count >= 2) return 5;
      return 3;
    },
    required: true,
  },
  {
    id: 'Q2.2-app',
    part: 'PART 1',
    dimension: '工程实现力',
    title: '你在使用AI工具时解决过的实际问题：（可多选）',
    type: 'multiple',
    options: [
      { value: 'prompt', label: 'Prompt优化：从模糊到精准输出' },
      { value: 'quality', label: '输出质量控制：确保结果符合要求' },
      { value: 'consistency', label: '结果一致性：保证多次输出的稳定性' },
      { value: 'workflow', label: '工作流设计：设计高效的AI协作流程' },
      { value: 'cost', label: '成本控制：优化AI工具的使用成本' },
    ],
    scoring: (answer: string[]) => {
      const count = answer.length;
      if (count >= 4) return 8.5;
      if (count >= 3) return 7;
      if (count >= 2) return 5.5;
      return 3.5;
    },
    required: true,
  },
  {
    id: 'Q2.3-app',
    part: 'PART 1',
    dimension: '工程实现力',
    title: '当AI工具的输出不符合预期时，你的处理方式是：',
    type: 'single',
    options: [
      { value: 'A', label: 'A. 系统化调试：分析问题、调整参数、反复优化' },
      { value: 'B', label: 'B. 快速试错：尝试不同工具或方法，找到可行的方案' },
      { value: 'C', label: 'C. 人工修正：用AI生成初稿，人工完善最终结果' },
      { value: 'D', label: 'D. 寻求帮助：咨询专业人士或查阅资料' },
      { value: 'E', label: 'E. 暂时放弃：等工具更新或技术成熟后再试' },
    ],
    scoring: (answer: string) => {
      if (answer === 'A') return 9;
      if (answer === 'B') return 8;
      if (answer === 'C') return 6.5;
      if (answer === 'D') return 5.5;
      return 4;
    },
    required: true,
  },
  
  // 其他维度使用原有问题（只有理论洞察力和工程实现力维度有差异）
  ...questions.filter(q => 
    q.part !== 'PART 0' && 
    q.dimension !== '理论洞察力' &&
    q.dimension !== '工程实现力'
  ),
];

