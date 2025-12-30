// 身份角色类型定义

export type QuestionTrack = 'technical' | 'application' | 'exploration';

export interface IdentityRole {
  id: string;
  name: string;
  icon: string;
  description: string;
  track: QuestionTrack;
  weights: {
    theory: number;
    engineering: number;
    learning: number;
    collaboration: number;
    radar: number;
    innovation: number;
    influence: number;
    aesthetics: number;
  };
}

// 10种身份角色定义（按用户要求重新排序）
export const identityRoles: IdentityRole[] = [
  // === 第一档：Builder类（工程师/架构师/创业者）===
  {
    id: 'architect',
    name: '工程架构师',
    icon: '🏗️',
    description: '构建可靠、可扩展的AI系统',
    track: 'technical',
    weights: {
      theory: 0.15,
      engineering: 0.25,
      learning: 0.15,
      collaboration: 0.15,
      radar: 0.10,
      innovation: 0.10,
      influence: 0.05,
      aesthetics: 0.05,
    },
  },
  {
    id: 'researcher',
    name: '算法研究员',
    icon: '🔬',
    description: '深入模型机理，追求性能突破',
    track: 'technical',
    weights: {
      theory: 0.25,
      engineering: 0.15,
      learning: 0.15,
      collaboration: 0.10,
      radar: 0.15,
      innovation: 0.15,
      influence: 0.05,
      aesthetics: 0.00,
    },
  },
  {
    id: 'startup-founder',
    name: 'AI创业者',
    icon: '🚀',
    description: '创立或领导AI驱动的产品/公司',
    track: 'technical',
    weights: {
      theory: 0.10,
      engineering: 0.20,
      learning: 0.15,
      collaboration: 0.15,
      radar: 0.15,
      innovation: 0.15,
      influence: 0.10,
      aesthetics: 0.00,
    },
  },

  // === 第二档：产品/应用类（产品经理/应用开发者）===
  {
    id: 'product-maker',
    name: '产品塑造者',
    icon: '🎨',
    description: '用AI创造卓越用户体验',
    track: 'application',
    weights: {
      theory: 0.10,
      engineering: 0.15,
      learning: 0.15,
      collaboration: 0.20,
      radar: 0.10,
      innovation: 0.15,
      influence: 0.10,
      aesthetics: 0.05,
    },
  },
  {
    id: 'app-developer',
    name: '应用层开发者',
    icon: '💻',
    description: '使用AI API/工具构建应用',
    track: 'application',
    weights: {
      theory: 0.05,
      engineering: 0.20,
      learning: 0.20,
      collaboration: 0.15,
      radar: 0.15,
      innovation: 0.10,
      influence: 0.10,
      aesthetics: 0.05,
    },
  },

  // === 第三档：入门/内容类（Self-starter/内容创作者）===
  {
    id: 'self-starter',
    name: 'AI Self-starter',
    icon: '🌱',
    description: '刚入门，探索AI与个人领域结合',
    track: 'exploration',
    weights: {
      theory: 0.05,
      engineering: 0.10,
      learning: 0.25,
      collaboration: 0.15,
      radar: 0.20,
      innovation: 0.10,
      influence: 0.10,
      aesthetics: 0.05,
    },
  },
  {
    id: 'content-creator',
    name: 'AI内容创作者',
    icon: '✍️',
    description: '通过AI辅助进行内容创作',
    track: 'application',
    weights: {
      theory: 0.05,
      engineering: 0.10,
      learning: 0.20,
      collaboration: 0.15,
      radar: 0.15,
      innovation: 0.15,
      influence: 0.15,
      aesthetics: 0.05,
    },
  },

  // === 第四档：组织/观察类（组织催化剂/跨界探索者/投资人）===
  {
    id: 'org-catalyst',
    name: '组织催化剂',
    icon: '🌐',
    description: '在组织内驱动AI转型与赋能',
    track: 'application',
    weights: {
      theory: 0.10,
      engineering: 0.15,
      learning: 0.15,
      collaboration: 0.20,
      radar: 0.15,
      innovation: 0.10,
      influence: 0.10,
      aesthetics: 0.05,
    },
  },
  {
    id: 'cross-explorer',
    name: '跨界探索者',
    icon: '🧭',
    description: '探索AI与特定领域的深度融合',
    track: 'exploration',
    weights: {
      theory: 0.15,
      engineering: 0.15,
      learning: 0.20,
      collaboration: 0.15,
      radar: 0.15,
      innovation: 0.10,
      influence: 0.05,
      aesthetics: 0.05,
    },
  },
  {
    id: 'investor-observer',
    name: 'AI投资人/观察者',
    icon: '👁️',
    description: '从投资/商业视角评估AI趋势',
    track: 'exploration',
    weights: {
      theory: 0.10,
      engineering: 0.05,
      learning: 0.15,
      collaboration: 0.15,
      radar: 0.25,
      innovation: 0.10,
      influence: 0.15,
      aesthetics: 0.05,
    },
  },
];

// 根据身份名称获取角色信息
export function getIdentityRole(name: string): IdentityRole | undefined {
  return identityRoles.find(role => role.name === name);
}

// 产出类型定义（扩展到9种）
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

// 产出类型对应的轨道
export const outputTypeTracks: Record<OutputType, QuestionTrack[]> = {
  '可运行的系统/产品': ['technical', 'application'],
  '被复用的代码/框架': ['technical', 'application'],
  '有洞见的论文/方法论': ['technical'],
  '被传播的内容/观点': ['exploration'],
  '可量化的业务结果': ['application'],
  '提效工具/工作流': ['application'],
  '社群运营/用户增长': ['application', 'exploration'],
  '投资决策/分析报告': ['exploration'],
  'AI辅助创作内容': ['application', 'exploration'],
};

