import { Question } from '../questions';
import { questions } from '../questions';

// 探索轨问题集（最简化版，适合投资人/观察者）
export const questionsExploration: Question[] = [
  // PART 1: 维度1 - 理论洞察力（探索版）
  {
    id: 'Q1.1-explore',
    part: 'PART 1',
    dimension: '理论洞察力',
    title: '以下AI趋势中，你能清楚解释给非技术朋友的有：（可多选）',
    type: 'multiple',
    options: [
      { value: 'llm', label: '大语言模型为什么突然爆发' },
      { value: 'prompt', label: '为什么Prompt工程很重要' },
      { value: 'agent', label: 'AI智能体与普通AI的区别' },
      { value: 'multimodal', label: '多模态AI的应用场景' },
      { value: 'agi', label: 'AGI（通用人工智能）的进展' },
    ],
    scoring: (answer: string[]) => {
      const count = answer.length;
      return Math.min((count / 5) * 10, 10);
    },
    required: true,
  },
  {
    id: 'Q1.2-explore',
    part: 'PART 1',
    dimension: '理论洞察力',
    title: '你对AI安全与伦理的关注程度：',
    type: 'scale',
    options: [
      { value: 'ethics', label: 'AI安全与伦理关注度（1-5分）' },
    ],
    scoring: (answers: Record<string, number>) => {
      const score = answers['ethics'] || 0;
      return (score / 5) * 10;
    },
    required: true,
    followUp: {
      condition: (value: any) => {
        // 处理scale类型的问题，value是Record<string, number>
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          return (value['ethics'] || 0) >= 4;
        }
        return false;
      },
      question: '你最担心的AI风险是什么？',
      type: 'text',
    },
  },
  {
    id: 'Q1.3-explore',
    part: 'PART 1',
    dimension: '理论洞察力',
    title: '你主要通过什么方式了解AI最新动态？（可多选）',
    type: 'multiple',
    options: [
      { value: 'x', label: 'X (Twitter) - 关注AI领域KOL和公司官方账号' },
      { value: 'geek', label: '极客时间/技术社区 - 深度技术内容' },
      { value: 'reddit', label: 'Reddit - r/MachineLearning等专业社区' },
      { value: 'youtube', label: 'YouTube - 技术频道和AI实验室内容' },
      { value: 'lab', label: '核心公司Lab Paper - OpenAI、Google DeepMind、Anthropic等官方论文' },
      { value: 'arxiv', label: 'arXiv - 最新学术论文预印本' },
      { value: 'expert', label: '关注AI领域专家/投资人观点' },
      { value: 'community', label: '参与AI相关社群讨论（如Discord、Slack）' },
    ],
    scoring: (answer: string[]) => {
      const count = answer.length;
      // 高质量来源加分
      const hasHighQuality = answer.includes('lab') || answer.includes('arxiv') || answer.includes('x');
      let score = (count / 8) * 10;
      if (hasHighQuality && count >= 3) {
        score = Math.min(score + 1, 10); // 有高质量来源且选择较多时加分
      }
      return Math.min(score, 10);
    },
    required: true,
  },
  {
    id: 'Q1.4-explore',
    part: 'PART 1',
    dimension: '理论洞察力',
    title: '你如何验证自己对AI趋势的判断是否正确？',
    type: 'single',
    options: [
      { value: 'A', label: 'A. 通过实际投资/决策验证' },
      { value: 'B', label: 'B. 观察市场反应和行业变化' },
      { value: 'C', label: 'C. 与专业人士交流讨论' },
      { value: 'D', label: 'D. 主要依赖直觉和经验' },
    ],
    scoring: (answer: string, text?: string) => {
      if (answer === 'A' && text && text.length > 20) return 9;
      if (answer === 'A') return 8.5;
      if (answer === 'B') return 7.5;
      if (answer === 'C') return 6.5;
      return 5;
    },
    required: true,
    followUp: {
      condition: (answer: string) => ['A', 'B'].includes(answer),
      question: '请举例一次你成功预判AI趋势的经历：',
      type: 'text',
    },
  },
  
  // 其他维度使用原有问题（只有理论洞察力维度有差异）
  ...questions.filter(q => 
    q.part !== 'PART 0' && 
    q.dimension !== '理论洞察力'
  ),
];

