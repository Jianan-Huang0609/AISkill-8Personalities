import { Identity } from '../types/questionnaire';
import { identityRoles } from '../types/identity';

// 身份权重矩阵（从 identityRoles 自动生成）
export const identityWeights: Record<Identity, Record<string, number>> = 
  identityRoles.reduce((acc, role) => {
    acc[role.name as Identity] = role.weights;
    return acc;
  }, {} as Record<Identity, Record<string, number>>);

// 问题配置
export interface Question {
  id: string;
  part: string;
  dimension: string;
  title: string;
  type: 'single' | 'multiple' | 'scale' | 'text' | 'gradient';
  options?: Array<{ value: string; label: string; score?: number }>;
  scoring: (answer: any) => number;
  required?: boolean;
  followUp?: {
    condition: (answer: any) => boolean;
    question: string;
    type: 'text' | 'number';
  };
}

export const questions: Question[] = [
  // PART 0: 身份定位
  {
    id: 'Q0.1',
    part: 'PART 0',
    dimension: '身份定位',
    title: '你的2025年AI主角色是？',
    type: 'single',
    options: [
      { value: '工程架构师', label: '工程架构师 - 构建可靠、可扩展的AI系统' },
      { value: '算法研究员', label: '算法研究员 - 深入模型机理，追求性能突破' },
      { value: '产品塑造者', label: '产品塑造者 - 用AI创造卓越用户体验' },
      { value: '组织催化剂', label: '组织催化剂 - 在组织内驱动AI转型与赋能' },
      { value: '跨界探索者', label: '跨界探索者 - 探索AI与特定领域的深度融合' },
    ],
    scoring: () => 0, // 身份选择不计分
    required: true,
  },
  {
    id: 'Q0.2',
    part: 'PART 0',
    dimension: '身份定位',
    title: '你的主要产出形式是？（最多选2项）',
    type: 'multiple',
    options: [
      { value: '可运行的系统/产品', label: '可运行的系统/产品' },
      { value: '被复用的代码/框架', label: '被复用的代码/框架' },
      { value: '有洞见的论文/方法论', label: '有洞见的论文/方法论' },
      { value: '被传播的内容/观点', label: '被传播的内容/观点' },
      { value: '可量化的业务结果', label: '可量化的业务结果' },
    ],
    scoring: () => 0,
    required: true,
  },
  
  // PART 1: 维度1 - 理论洞察力
  {
    id: 'Q1.1',
    part: 'PART 1',
    dimension: '理论洞察力',
    title: '在构建AI系统时，你遇到过以下哪些设计决策场景，并能做出明确判断？（可多选）',
    type: 'multiple',
    options: [
      // 一类：架构与系统设计（2个）
      { value: 'agent_architecture', label: '智能体架构：任务变复杂时，用单个智能体（简单但容易卡住）还是多个智能体协作（高效但协调复杂）？' },
      { value: 'async_workflow', label: '流程设计：用同步调用（好理解但慢）还是异步事件（快但难调试）？' },
      // 二类：技术选型与数据（2个）
      { value: 'memory_system', label: '记忆系统：用向量检索存知识（灵活但可能不准）还是图数据库（精确但设计复杂）？' },
      { value: 'context_management', label: '上下文管理：用超长上下文窗口（方便但效率低）还是RAG检索（精准但复杂）？' },
      // 三类：性能与优化（2个）
      { value: 'inference_optimization', label: '推理优化：优先优化单次请求速度，还是整体吞吐量和成本？' },
      { value: 'fine_tuning_strategy', label: '模型定制：持续优化提示词（快速试错），还是做模型微调（效果好但周期长）？' },
      // 四类：工程实践与保障（2个）
      { value: 'evaluation_standard', label: '评估标准：用标准测试集（好比较但可能不贴近实际）还是真实业务指标（真实但难量化）？' },
      { value: 'output_guarantee', label: '输出保障：直接使用模型输出（快但可能不稳定），还是加校验层（可靠但会变慢）？' },
    ],
    scoring: (answer: string[]) => {
      const count = answer.length;
      
      // 定义四个类别
      const category1 = ['agent_architecture', 'async_workflow']; // 架构与系统设计
      const category2 = ['memory_system', 'context_management']; // 技术选型与数据
      const category3 = ['inference_optimization', 'fine_tuning_strategy']; // 性能与优化
      const category4 = ['evaluation_standard', 'output_guarantee']; // 工程实践与保障
      
      // 计算覆盖的类别数
      const coveredCategories = new Set<number>();
      answer.forEach(a => {
        if (category1.includes(a)) coveredCategories.add(1);
        if (category2.includes(a)) coveredCategories.add(2);
        if (category3.includes(a)) coveredCategories.add(3);
        if (category4.includes(a)) coveredCategories.add(4);
      });
      const categoryCount = coveredCategories.size;
      
      // 评分标准：同时考虑选择数量和类别覆盖度
      if (count >= 7 && categoryCount >= 3) return 9.5; // 7-8项且覆盖3+类别：9-10分
      if (count >= 7) return 9;
      if (count >= 5 && categoryCount >= 2) return 7.5; // 5-6项且覆盖2+类别：7-8分
      if (count >= 5) return 7;
      if (count >= 3) return 5.5; // 3-4项：5-6分
      if (count >= 2) return 3.5; // 2项：3-4分
      return 1.5; // 0-1项：1-2分
    },
    required: true,
  },
  {
    id: 'Q1.2',
    part: 'PART 1',
    dimension: '理论洞察力',
    title: '当一个模型在内部评测表现优异，但用户反馈糟糕，你的第一反应是：',
    type: 'single',
    options: [
      { value: 'A', label: 'A. 数据分布错位：立即分析评测集与真实用户场景的分布差异' },
      { value: 'B', label: 'B. 评测集污染：检查训练数据是否泄漏到评测集' },
      { value: 'C', label: 'C. 使用方式差异：用户Prompt与评测时的标准流程不一致' },
      { value: 'D', label: 'D. 泛化能力不足：模型在训练分布外快速失效' },
      { value: 'E', label: 'E. 收集更多反馈：将用户反馈作为新的训练信号' },
    ],
    scoring: (answer: string) => {
      if (answer === 'A') return 9.5;
      if (answer === 'B' || answer === 'D') return 7.5;
      return 5.5;
    },
    required: true,
    followUp: {
      condition: (answer: string) => ['A', 'B', 'D'].includes(answer),
      question: '请简述你最近一次处理此类问题的关键发现：',
      type: 'text',
    },
  },
  {
    id: 'Q1.3',
    part: 'PART 1',
    dimension: '理论洞察力',
    title: '你的AI知识管理方式最接近：',
    type: 'single',
    options: [
      { value: 'A', label: 'A. 互联花园：有双向链接、定期维护的结构化知识库' },
      { value: 'B', label: 'B. 项目驱动：知识按项目组织，与产出强绑定' },
      { value: 'C', label: 'C. 碎片收藏：有大量收藏但未深度整合' },
      { value: 'D', label: 'D. 记忆搜索：主要靠记忆和即时搜索' },
    ],
    scoring: (answer: string, text?: string) => {
      if (answer === 'A' && text && text.length > 20) return 9.5;
      if (answer === 'A') return 8;
      if (answer === 'B') return 7.5;
      if (answer === 'C') return 5.5;
      return 4;
    },
    required: true,
    followUp: {
      condition: (answer: string) => ['A', 'B'].includes(answer),
      question: '分享一个你知识体系中最有价值的"知识连接"：',
      type: 'text',
    },
  },
  {
    id: 'Q1.4',
    part: 'PART 1',
    dimension: '理论洞察力',
    title: '2025年，你精读（理解方法、实验、分析）的AI论文约：',
    type: 'single',
    options: [
      { value: 'A', label: 'A. 30+篇（深度跟进一个领域）' },
      { value: 'B', label: 'B. 10-30篇（围绕项目有选择地精读）' },
      { value: 'C', label: 'C. 1-10篇（只读关键论文）' },
      { value: 'D', label: 'D. 0篇（主要依赖综述、博客）' },
    ],
    scoring: (answer: string, text?: string) => {
      if (answer === 'A' && text && text.length > 10) return 9.5;
      if (answer === 'A') return 9;
      if (answer === 'B') return 7.5;
      if (answer === 'C') return 5.5;
      return 3.5;
    },
    required: true,
    followUp: {
      condition: () => true,
      question: '列举一篇2025年对你实践产生直接影响的论文：',
      type: 'text',
    },
  },
  
  // PART 1: 维度2 - 工程实现力
  {
    id: 'Q2.1',
    part: 'PART 1',
    dimension: '工程实现力',
    title: '2025年，你亲手交付（或主导）的包含以下要素的项目：',
    type: 'multiple',
    options: [
      { value: 'api', label: '生产级API服务：含监控、告警、自动化扩缩容' },
      { value: 'pipeline', label: '端到端训练流水线：从数据清洗到模型部署的全流程' },
      { value: 'agent', label: '复杂智能体工作流：多步骤、有状态、可观测' },
      { value: 'eval', label: '自动化评测平台：模型性能的持续监测与回归测试' },
      { value: 'multimodal', label: '多模态数据流水线：图像、文本、音频的统一处理' },
      { value: 'optimize', label: '模型优化部署：量化、蒸馏、特定硬件推理优化' },
      { value: 'edge', label: '边缘/端侧部署：在资源受限环境中的AI部署经验' },
      { value: 'gpu', label: 'GPU资源管理：虚拟化、调度、精细化成本分账' },
      { value: 'platform', label: '内部AI平台：提升团队效率的工具链或平台' },
    ],
    scoring: (answer: string[]) => {
      const count = answer.length;
      if (count >= 6) return 9.5;
      if (count >= 4) return 7.5;
      if (count >= 2) return 5.5;
      return 3.5;
    },
    required: true,
  },
  {
    id: 'Q2.2',
    part: 'PART 1',
    dimension: '工程实现力',
    title: '你今年独立或主导解决的复杂工程问题类型：',
    type: 'multiple',
    options: [
      { value: 'training', label: '训练稳定性：模型不收敛、性能波动的根因分析' },
      { value: 'resource', label: '资源瓶颈：高并发下的显存泄漏、推理吞吐瓶颈' },
      { value: 'rag', label: 'RAG质量：检索相关但生成质量低的调试' },
      { value: 'multiagent', label: '多智能体协同：死锁、循环或冲突解决' },
      { value: 'online', label: '线上故障：延迟尖刺、错误率飙升的排查' },
      { value: 'data', label: '数据问题：版本混乱导致的性能回退' },
      { value: 'edge', label: '边缘优化：精度与速度的极致权衡' },
      { value: 'ethics', label: '安全伦理：涉及偏见、可解释性的工程调整' },
    ],
    scoring: (answer: string[]) => {
      const count = answer.length;
      if (count >= 6) return 9.5;
      if (count >= 4) return 7.5;
      if (count >= 2) return 5.5;
      return 3.5;
    },
    required: true,
  },
  {
    id: 'Q2.3',
    part: 'PART 1',
    dimension: '工程实现力',
    title: '面对"演示完美、压力测试崩溃"的AI功能，你力主：',
    type: 'single',
    options: [
      { value: 'A', label: 'A. 加固底线：增加压力测试、混沌工程、完备回滚预案' },
      { value: 'B', label: 'B. 受控发布：用特性开关、渐进式发布在真实流量中验证' },
      { value: 'C', label: 'C. 重构核心：认为架构有根本缺陷，主张重设计' },
      { value: 'D', label: 'D. 人工护航：先上线，依靠on-call和快速响应弥补' },
      { value: 'E', label: 'E. 暂缓上线：认为风险超过价值，建议继续研发' },
    ],
    scoring: (answer: string) => {
      if (answer === 'A') return 9.5;
      if (answer === 'B') return 8.5;
      if (answer === 'C') return 7.5;
      if (answer === 'D') return 5.5;
      return 4.5;
    },
    required: true,
  },
  
  // PART 2: 维度3 - 学习敏捷度
  {
    id: 'Q3.1',
    part: 'PART 2',
    dimension: '学习敏捷度',
    title: '你常用的"学会"验证方式是（多选）：',
    type: 'multiple',
    options: [
      { value: 'practice', label: '实践闭环：用于真实项目并产生可衡量价值' },
      { value: 'teach', label: '创造教学：能写出让新手理解的教程或文章' },
      { value: 'code', label: '代码复现：能从零/最小依赖实现核心算法' },
      { value: 'pattern', label: '模式识别：能识别新问题与已知模式的关联' },
      { value: 'discuss', label: '讨论深化：能在深度讨论中提出新颖见解' },
      { value: 'feel', label: '感觉理解：内心觉得懂了，但缺乏外部验证' },
    ],
    scoring: (answer: string[]) => {
      const hasPractice = answer.includes('practice');
      const hasTeach = answer.includes('teach');
      const hasCode = answer.includes('code');
      if (hasPractice && hasTeach && hasCode) return 9.5;
      if ((hasPractice && hasTeach) || (hasPractice && hasCode) || (hasTeach && hasCode)) return 7.5;
      if (hasPractice || hasTeach || hasCode) return 5.5;
      if (answer.includes('feel') && answer.length === 1) return 4;
      return 5;
    },
    required: true,
  },
  {
    id: 'Q3.2',
    part: 'PART 2',
    dimension: '学习敏捷度',
    title: '你的学习节奏更接近：',
    type: 'single',
    options: [
      { value: 'A', label: 'A. 系统循环：固定时间投入 + 定期输出沉淀（如周报、博客）' },
      { value: 'B', label: 'B. 项目驱动：为解决问题而高强度学习，项目结束则放缓' },
      { value: 'C', label: 'C. 兴趣探索：持续但随兴趣流动，输出不定时' },
      { value: 'D', label: 'D. 被动接收：依赖工作需求和信息流推送' },
    ],
    scoring: (answer: string) => {
      if (answer === 'A') return 9.5;
      if (answer === 'B') return 8.5;
      if (answer === 'C') return 6.5;
      return 4.5;
    },
    required: true,
  },
  {
    id: 'Q3.3',
    part: 'PART 2',
    dimension: '学习敏捷度',
    title: '描述一次成功的跨领域知识迁移：',
    type: 'text',
    scoring: (text: string) => {
      if (!text || text.length < 50) return 4;
      if (text.length >= 200 && text.includes('验证') || text.includes('成功')) return 9.5;
      if (text.length >= 100) return 7.5;
      return 5.5;
    },
    required: true,
  },
  
  // PART 2: 维度4 - AI协作力
  {
    id: 'Q4.1',
    part: 'PART 2',
    dimension: 'AI协作力',
    title: '你积累的可复用人机协作资产包括：',
    type: 'multiple',
    options: [
      { value: 'prompt', label: 'Prompt模式库：按任务分类、有版本和效果的Prompt集合' },
      { value: 'eval', label: '评估体系：针对不同任务（创意、推理、代码）的AI输出评估标准' },
      { value: 'workflow', label: '工作流蓝图：人机分工明确、有检查点的SOP' },
      { value: 'failure', label: '失败案例库：记录AI的典型失效场景与补救措施' },
      { value: 'tool', label: '效率工具：自动化重复交互的脚本、浏览器插件等' },
    ],
    scoring: (answer: string[]) => {
      const count = answer.length;
      if (count >= 4) return 9.5;
      if (count >= 2) return 7.5;
      if (count >= 1) return 5.5;
      return 4;
    },
    required: true,
  },
  {
    id: 'Q4.2',
    part: 'PART 2',
    dimension: 'AI协作力',
    title: '请评估以下方面（1-5分）：',
    type: 'scale',
    options: [
      { value: 'boundary', label: '我能清晰描述当前主流模型的能力边界' },
      { value: 'cost', label: '我会评估"调教AI"与"自己完成"的性价比' },
      { value: 'ethics', label: '在设计AI功能时，我会考虑公平性、可解释性' },
      { value: 'negative', label: '当AI在边缘case表现优异却无法解释时，我感到兴奋多于焦虑' },
    ],
    scoring: (answers: Record<string, number>) => {
      const scores = Object.values(answers);
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avg >= 4.5) return 9.5;
      if (avg >= 4.0) return 8.5;
      if (avg >= 3.0) return 6.5;
      return 4.5;
    },
    required: true,
  },
  {
    id: 'Q4.3',
    part: 'PART 2',
    dimension: 'AI协作力',
    title: '使用AI工具后，你在特定任务上的效率提升倍数：',
    type: 'single',
    options: [
      { value: 'A', label: 'A. 10倍+（某些任务从小时级降到分钟级）' },
      { value: 'B', label: 'B. 3-10倍（显著提升）' },
      { value: 'C', label: 'C. 1.5-3倍（有提升）' },
      { value: 'D', label: 'D. 基本没变' },
      { value: 'E', label: 'E. 反而降低（调教成本过高）' },
    ],
    scoring: (answer: string, text?: string) => {
      if (answer === 'A' && text && text.length > 20) return 9.5;
      if (answer === 'A') return 9;
      if (answer === 'B') return 7.5;
      if (answer === 'C') return 5.5;
      return 3.5;
    },
    required: true,
    followUp: {
      condition: (answer: string) => ['A', 'B'].includes(answer),
      question: '举例一个提效最明显的场景：',
      type: 'text',
    },
  },
  
  // PART 2: 维度5 - 信息雷达
  {
    id: 'Q5.1',
    part: 'PART 2',
    dimension: '信息雷达',
    title: '你的AI信息策略：',
    type: 'single',
    options: [
      { value: 'A', label: 'A. 前瞻网络：紧密跟随论文、核心开发者、前沿会议' },
      { value: 'B', label: 'B. 策展网络：依赖高质量周报、资深从业者筛选' },
      { value: 'C', label: 'C. 问题网络：仅为解决手头问题构建临时信息网络' },
      { value: 'D', label: 'D. 算法网络：主要靠推荐系统' },
    ],
    scoring: (answer: string) => {
      if (answer === 'A') return 9.5;
      if (answer === 'B') return 7.5;
      if (answer === 'C') return 5.5;
      return 3.5;
    },
    required: true,
  },
  {
    id: 'Q5.2',
    part: 'PART 2',
    dimension: '信息雷达',
    title: '回顾2025年，您认为以下哪些技术或领域取得了关键进展或已成为明确趋势？（可多选）',
    type: 'multiple',
    options: [
      { value: 'hardware_cost', label: '硬件成本重构：专用芯片（如TPU）竞争推动推理架构创新，核心目标从追求算力峰值转向降低实际部署与使用成本。' },
      { value: 'alignment_paradigm', label: '对齐范式革新：业界认识到RLHF等方法在消除模型深层偏见上存在局限，探索更可靠的新对齐技术已成为紧迫课题。' },
      { value: 'cognitive_trust', label: '认知与可信研究：对人脑与AI思维机制差异的探索，正驱动产业界提升对AI决策过程可解释性与可信赖性的要求。' },
      { value: 'model_squeeze', label: '模型挤压应用：大模型性能持续提升，一方面向上夯实技术基础，另一方面向下渗透垂直行业，压缩了中间层简单工具的空间。' },
      { value: 'vertical_landing', label: '垂直化落地深入：通用模型转向行业定制已成共识，但落地过程仍普遍面临高质量数据获取、部署成本与场景泛化能力的挑战。' },
      { value: 'agent_popularization', label: '智能体(Agent)普及：智能体成为将大模型能力转化为实际工作流的主流形态，但其开发效率、运行稳定性与合规门槛仍需优化。' },
      { value: 'video_generation', label: '视频生成突破与规制：文生视频质量取得跨越式进步，促使创作门槛降低，同时也引发了关于内容真实性、版权归属与伦理风险的全球性监管讨论。' },
      { value: 'ai_science', label: 'AI for Science规模化：人工智能在生物制药、新材料发现等科研领域实现了从实验工具到规模化生产力的转变，推动研发范式变革。' },
      { value: 'neuro_symbolic', label: '神经符号融合兴起：结合神经网络感知与符号系统推理的融合技术，被视为提升AI逻辑严谨性与决策可解释性的关键前沿方向。' },
      { value: 'open_source', label: '开源生态繁荣：优秀开源模型在多项实用指标上逼近闭源模型，同时以其灵活性构建了繁荣的开发者生态，为企业提供了重要技术选项。' },
    ],
    scoring: (answer: string[]) => {
      const count = answer.length;
      // 10个选项的评分标准
      if (count >= 8) return 9.5; // 8-10项：9-10分
      if (count >= 6) return 7.5; // 6-7项：7-8分
      if (count >= 4) return 5.5; // 4-5项：5-6分
      if (count >= 2) return 3.5; // 2-3项：3-4分
      return 1.5; // 0-1项：1-2分
    },
    required: true,
  },
  {
    id: 'Q5.3',
    part: 'PART 2',
    dimension: '信息雷达',
    title: '当重要新技术/模型发布时，你通常：',
    type: 'single',
    options: [
      { value: 'A', label: 'A. 立即实验：24小时内上手试用，形成一手认知' },
      { value: 'B', label: 'B. 快速评估：1-3天内阅读评测，判断是否投入' },
      { value: 'C', label: 'C. 观察等待：等社区形成共识后再决定' },
      { value: 'D', label: 'D. 按需关注：只在与当前工作相关时才了解' },
    ],
    scoring: (answer: string, text?: string) => {
      if (answer === 'A' && text && text.length > 20) return 9.5;
      if (answer === 'A') return 9;
      if (answer === 'B') return 7.5;
      if (answer === 'C') return 5.5;
      return 3.5;
    },
    required: true,
    followUp: {
      condition: (answer: string) => ['A', 'B'].includes(answer),
      question: '举例一个2025年你快速上手的技术：',
      type: 'text',
    },
  },
  
  // PART 3: 维度6 - 创新突破力
  {
    id: 'Q6.1',
    part: 'PART 3',
    dimension: '创新突破力',
    title: '描述一个2025年你做的"与众不同"的AI探索：',
    type: 'text',
    scoring: (text: string) => {
      if (!text || text.length < 30) return 3.5;
      if (text.length >= 150 && (text.includes('已完成') || text.includes('进行中'))) return 9.5;
      if (text.length >= 100) return 7.5;
      return 5.5;
    },
    required: true,
  },
  {
    id: 'Q6.2',
    part: 'PART 3',
    dimension: '创新突破力',
    title: '列出2-3个你认为"AI目前还做得很差，但值得解决"的真问题：',
    type: 'text',
    scoring: (text: string) => {
      if (!text || text.length < 50) return 3.5;
      const problemCount = (text.match(/问题[：:]/g) || []).length;
      if (problemCount >= 2 && text.length >= 200) return 9.5;
      if (problemCount >= 1 && text.length >= 100) return 7.5;
      return 5.5;
    },
    required: true,
  },
  {
    id: 'Q6.3',
    part: 'PART 3',
    dimension: '创新突破力',
    title: '分享一次你有价值的"失败实验"：',
    type: 'text',
    scoring: (text: string) => {
      if (!text || text.length < 50) return 4;
      if (text.length >= 200 && (text.includes('学到') || text.includes('教训'))) return 9.5;
      if (text.length >= 100) return 7.5;
      return 5.5;
    },
    required: true,
  },
  
  // PART 3: 维度7 - 影响力声量
  {
    id: 'Q7.1',
    part: 'PART 3',
    dimension: '影响力声量',
    title: '2025年你的AI相关内容产出：',
    type: 'scale',
    options: [
      { value: 'blog', label: '技术博客/公众号 - 文章/教程' },
      { value: 'github', label: 'GitHub - 开源项目/代码库' },
      { value: 'social', label: '社交媒体 - 深度帖子/线程' },
      { value: 'offline', label: '线下活动 - 演讲/分享/工作坊' },
      { value: 'community', label: '社群互动 - 高质量回答/讨论' },
    ],
    scoring: (answers: Record<string, number>) => {
      const scores = Object.values(answers);
      const total = scores.reduce((a, b) => a + b, 0);
      const platforms = scores.filter(s => s > 0).length;
      if (platforms >= 3 && total >= 30) return 9.5;
      if (platforms >= 2 || total >= 15) return 7.5;
      if (total >= 5) return 5.5;
      return 3.5;
    },
    required: true,
  },
  {
    id: 'Q7.2',
    part: 'PART 3',
    dimension: '影响力声量',
    title: '你的AI观点中，有没有"与主流看法不同"的地方？',
    type: 'text',
    scoring: (text: string) => {
      if (!text || text.length < 30) return 5.5;
      if (text.length >= 100 && (text.includes('理由') || text.includes('因为'))) return 9.5;
      if (text.length >= 50) return 7.5;
      return 6.5;
    },
    required: true,
  },
  
  // PART 3: 维度8 - 表达审美力
  {
    id: 'Q8.1',
    part: 'PART 3',
    dimension: '表达审美力',
    title: '你在做AI项目时，对"用户体验和美感"的重视程度：',
    type: 'single',
    options: [
      { value: 'A', label: 'A. 非常重视：会花大量时间打磨UI/UX/视觉设计' },
      { value: 'B', label: 'B. 比较重视：会在时间允许范围内尽力优化' },
      { value: 'C', label: 'C. 功能优先：先确保功能完整，再考虑美观' },
      { value: 'D', label: 'D. 基本不考虑：能用就行' },
    ],
    scoring: (answer: string, text?: string) => {
      const hasEthics = text && (text.includes('公平') || text.includes('可解释'));
      if (answer === 'A' && hasEthics) return 9.5;
      if (answer === 'A') return 8.5;
      if (answer === 'B' && text && text.includes('是')) return 7.5;
      if (answer === 'B') return 7;
      if (answer === 'C') return 5.5;
      return 3.5;
    },
    required: true,
    followUp: {
      condition: () => true,
      question: '除了好用和好看，你是否考虑过产品的公平性、可解释性？',
      type: 'text',
    },
  },
  {
    id: 'Q8.2',
    part: 'PART 3',
    dimension: '表达审美力',
    title: '以下哪类AI工具的设计风格最吸引你？',
    type: 'single',
    options: [
      { value: 'A', label: 'A. 极简抽象：如Raycast、Linear，隐藏复杂度' },
      { value: 'B', label: 'B. 专业深度：如Figma、Blender，功能强大界面复杂' },
      { value: 'C', label: 'C. 友好温暖：如Notion、Craft，注重情感化设计' },
      { value: 'D', label: 'D. 高效实用：如VSCode、终端，信息密度为王' },
      { value: 'E', label: 'E. 炫酷科技：强视觉冲击的未来感设计' },
    ],
    scoring: (_answer: string, _text?: string) => {
      if (_text && _text.length > 30) return 9.5;
      if (_text && _text.length > 10) return 8.5;
      return 6.5;
    },
    required: true,
    followUp: {
      condition: () => true,
      question: '你最欣赏的一个AI产品设计是什么？为什么？',
      type: 'text',
    },
  },
  
  // PART 4: 校准与展望
  {
    id: 'Q4.1',
    part: 'PART 4',
    dimension: '校准与展望',
    title: '基于刚才的回顾，你认为自己的实际能力轮廓与最初选择的身份相比：',
    type: 'single',
    options: [
      { value: '高度匹配', label: '高度匹配：我的能力分布与这个角色完美契合' },
      { value: '基本一致', label: '基本一致：大致符合，但有1-2个维度偏差' },
      { value: '部分偏差', label: '部分偏差：有显著差异，可能需要重新思考定位' },
      { value: '差异很大', label: '差异很大：我的实际能力是另一个角色类型' },
    ],
    scoring: () => 0,
    required: true,
  },
  {
    id: 'Q4.2',
    part: 'PART 4',
    dimension: '校准与展望',
    title: '2025年，让你最自豪/难忘的一个AI相关时刻是什么？',
    type: 'text',
    scoring: () => 0,
    required: true,
  },
  {
    id: 'Q4.3',
    part: 'PART 4',
    dimension: '校准与展望',
    title: '2026年，你希望自己的技能树：',
    type: 'text',
    scoring: () => 0,
    required: true,
  },
];

