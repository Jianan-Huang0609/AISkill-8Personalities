// 问卷数据类型定义

export type Identity = 
  | '工程架构师'
  | '算法研究员'
  | 'AI创业者'
  | '产品塑造者'
  | '应用层开发者'
  | 'AI内容创作者'
  | '组织催化剂'
  | '跨界探索者'
  | 'AI Self-starter'
  | 'AI投资人/观察者';

export type OutputType = 
  | '可运行的系统/产品'
  | '被复用的代码/框架'
  | '有洞见的论文/方法论'
  | '被传播的内容/观点'
  | '可量化的业务结果'
  | '提效工具/工作流'
  | '社群运营/用户增长'
  | '投资决策/分析报告'
  | 'AI辅助创作内容';

export interface Answer {
  questionId: string;
  value: string | string[] | number | number[];
  text?: string; // 开放性问题文本
}

export interface QuestionnaireState {
  identity: Identity | null;
  outputs: OutputType[];
  answers: Answer[];
  currentStep: number;
}

export interface DimensionScores {
  theory: number;           // 理论洞察力
  engineering: number;      // 工程实现力
  learning: number;         // 学习敏捷度
  collaboration: number;   // AI协作力
  radar: number;            // 信息雷达
  innovation: number;       // 创新突破力
  influence: number;        // 影响力声量
  aesthetics: number;       // 表达审美力
}

export interface PersonalityType {
  code: string;            // 如 "A-D-O"
  name: string;            // 如 "系统架构师"
  description: string;
  strengths: string[];
  weaknesses: string[];
  growthAdvice: string[];
  // 扩展字段
  metaphor?: string;      // 形象比喻
  coreTraits?: string[];   // 核心特质描述
  decisionStyle?: string;  // 决策风格
  workStyle?: string[];    // 工作风格
  learningStyle?: string;  // 学习模式
  successFormula?: string; // 成功方程式
  careerPath?: string[];   // 职业生涯路径
  blindSpots?: string[];   // 常见盲点
  detailedAdvice?: {       // 详细发展建议
    title: string;
    items: string[];
  }[];
  partners?: {             // 互补伙伴
    type: string;
    how: string;
    note: string;
  }[];
  pressureResponse?: string[]; // 压力状态
  recoveryStrategies?: string[]; // 恢复策略
  yearlyFocus?: string[];  // 年度发展重点
  evolutionPath?: string;  // 人格进化路径
}

export interface ScoreBreakdown {
  dimension: string;
  questionScores: {
    questionId: string;
    questionTitle: string;
    score: number;
    maxScore: number;
  }[];
  averageScore: number;
  isDefault?: boolean; // 是否为默认分（如AI Self-starter的工程实现力）
}

export interface AssessmentResult {
  identity: Identity;
  actualType: PersonalityType;
  scores: DimensionScores;
  badges: string[];
  highlights: string[];
  bias: '高度匹配' | '基本一致' | '部分偏差' | '差异很大';
  answers?: Answer[]; // 添加答案信息用于导出
  outputs?: OutputType[]; // 添加产出形式用于导出
  scoreBreakdown?: ScoreBreakdown[]; // 评分明细
}

