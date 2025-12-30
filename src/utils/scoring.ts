import { Answer, DimensionScores, Identity, PersonalityType, AssessmentResult, ScoreBreakdown } from '../types/questionnaire';
import { questions } from '../data/questions';
import { personalityDetails } from '../data/personalityDetails';
import { getIdentityRole } from '../types/identity';
import { generateQuestionsByTrack } from './questionRouter';

// 计算各维度得分
export function calculateDimensionScores(
  answers: Answer[],
  identity?: Identity
): DimensionScores {
  const scores: DimensionScores = {
    theory: 0,
    engineering: 0,
    learning: 0,
    collaboration: 0,
    radar: 0,
    innovation: 0,
    influence: 0,
    aesthetics: 0,
  };

  // 根据身份获取对应轨道的问题集
  let allQuestions = questions;
  if (identity) {
    const role = getIdentityRole(identity);
    if (role) {
      allQuestions = generateQuestionsByTrack(role.track);
    }
  }

  // 按维度分组问题（支持不同轨道的问题ID）
  // 理论洞察力维度：可能是 Q1.1, Q1.1-app, Q1.1-explore 等
  // 工程实现力维度：可能是 Q2.1, Q2.1-app 等（AI Self-starter可能没有）
  // 其他维度：统一使用 Q3.x, Q4.x 等
  const dimensionQuestionPatterns: Record<string, RegExp[]> = {
    theory: [/^Q1\.1/, /^Q1\.2/, /^Q1\.3/, /^Q1\.4/], // 匹配 Q1.1, Q1.1-app, Q1.1-explore 等
    engineering: [/^Q2\.1/, /^Q2\.2/, /^Q2\.3/], // 匹配 Q2.1, Q2.1-app 等（AI Self-starter可能没有）
    learning: [/^Q3\.1/, /^Q3\.2/, /^Q3\.3/],
    collaboration: [/^Q4\.1/, /^Q4\.2/, /^Q4\.3/],
    radar: [/^Q5\.1/, /^Q5\.2/, /^Q5\.3/],
    innovation: [/^Q6\.1/, /^Q6\.2/, /^Q6\.3/],
    influence: [/^Q7\.1/, /^Q7\.2/],
    aesthetics: [/^Q8\.1/, /^Q8\.2/],
  };

  // 计算每个维度的平均分
  Object.entries(dimensionQuestionPatterns).forEach(([dimension, patterns]) => {
    const dimensionScores: number[] = [];
    
    patterns.forEach(pattern => {
      // 找到匹配该模式的问题（从对应轨道的问题集中查找）
      const matchingQuestion = allQuestions.find(q => pattern.test(q.id));
      if (!matchingQuestion) return;
      
      // 找到对应的答案（可能ID不完全匹配，需要匹配模式）
      const answer = answers.find(a => pattern.test(a.questionId));
      
      if (answer) {
        // 根据 scoring 函数的签名调用
        const scoringFn = matchingQuestion.scoring as (answer: any, text?: string) => number;
        const score = scoringFn(answer.value, answer.text);
        if (score > 0) {
          dimensionScores.push(score);
        }
      }
    });
    
    if (dimensionScores.length > 0) {
      scores[dimension as keyof DimensionScores] = 
        dimensionScores.reduce((a, b) => a + b, 0) / dimensionScores.length;
    } else if (dimension === 'engineering') {
      // 如果工程实现力维度没有得分（如AI Self-starter），给一个默认分
      // 基于其他维度估算一个合理的分数
      const avgOtherScores = (
        scores.theory + scores.learning + scores.collaboration + 
        scores.radar + scores.innovation + scores.influence + scores.aesthetics
      ) / 7;
      scores.engineering = Math.max(avgOtherScores * 0.6, 3); // 给一个相对较低的默认分
    }
  });

  return scores;
}

// 计算人格类型
export function calculatePersonalityType(scores: DimensionScores): PersonalityType {
  // 抽象 vs 具体
  const A_score = scores.theory;
  const C_score = scores.engineering;
  const isAbstract = A_score > C_score;

  // 广度 vs 深度
  const B_score = (scores.radar + scores.learning) / 2;
  const D_score = (scores.theory + scores.engineering) / 2;
  const isBroad = B_score > D_score;

  // 独立 vs 协作
  const I_score = scores.innovation;
  const O_score = (scores.collaboration + scores.influence) / 2;
  const isIndependent = I_score > O_score;

  // 构建类型代码（添加连字符以匹配模板）
  const typeCode = 
    (isAbstract ? 'A' : 'C') + '-' +
    (isBroad ? 'B' : 'D') + '-' +
    (isIndependent ? 'I' : 'O');

  // 获取人格类型详情
  return getPersonalityTypeDetails(typeCode);
}

function getPersonalityTypeDetails(code: string): PersonalityType {
  const detailed = personalityDetails[code];
  console.log('查找人格类型:', code, '找到:', !!detailed);
  if (detailed) {
    return {
      code: detailed.code,
      name: detailed.name,
      description: detailed.description,
      strengths: detailed.strengths,
      weaknesses: detailed.weaknesses,
      growthAdvice: detailed.growthAdvice,
      metaphor: detailed.metaphor,
      coreTraits: detailed.coreTraits,
      decisionStyle: detailed.decisionStyle,
      workStyle: detailed.workStyle,
      learningStyle: detailed.learningStyle,
      successFormula: detailed.successFormula,
      careerPath: detailed.careerPath,
      blindSpots: detailed.blindSpots,
      detailedAdvice: detailed.detailedAdvice,
      partners: detailed.partners,
      pressureResponse: detailed.pressureResponse,
      recoveryStrategies: detailed.recoveryStrategies,
      yearlyFocus: detailed.yearlyFocus,
      evolutionPath: detailed.evolutionPath,
    };
  }
  
  // 降级方案：如果找不到详细模板，使用基础模板
  console.warn('未找到人格类型模板:', code, '可用类型:', Object.keys(personalityDetails));
  const fallback: Omit<PersonalityType, 'code'> = {
    name: '未知类型',
    description: '无法确定人格类型',
    strengths: [],
    weaknesses: [],
    growthAdvice: [],
  };
  return { code, ...fallback };
}

// 生成成就徽章
export function generateBadges(answers: Answer[], scores: DimensionScores): string[] {
  const badges: string[] = [];

  // 负能力者
  const q4_2 = answers.find(a => a.questionId === 'Q4.2');
  if (q4_2 && typeof q4_2.value === 'object' && 'negative' in q4_2.value) {
    const negativeScore = (q4_2.value as Record<string, number>).negative;
    if (negativeScore >= 4) badges.push('负能力者');
  }

  // 伦理考量者
  if (q4_2 && typeof q4_2.value === 'object' && 'ethics' in q4_2.value) {
    const ethicsScore = (q4_2.value as Record<string, number>).ethics;
    if (ethicsScore >= 4) badges.push('伦理考量者');
  }

  // 趋势预言家
  const q5_2 = answers.find(a => a.questionId === 'Q5.2');
  if (q5_2 && Array.isArray(q5_2.value) && q5_2.value.length >= 5) {
    badges.push('趋势预言家');
  }

  // 跨界融合者
  const q3_3 = answers.find(a => a.questionId === 'Q3.3');
  if (q3_3 && typeof q3_3.value === 'string' && q3_3.value.length >= 100) {
    badges.push('跨界融合者');
  }

  // 高审美
  if (scores.aesthetics >= 8) badges.push('美学追求者');

  // 高创新
  if (scores.innovation >= 8) badges.push('创新先锋');

  // 高影响力
  if (scores.influence >= 8) badges.push('影响力达人');

  return badges;
}

// 计算评分明细
export function calculateScoreBreakdown(
  answers: Answer[],
  identity?: Identity
): ScoreBreakdown[] {
  const breakdown: ScoreBreakdown[] = [];
  
  // 根据身份获取对应轨道的问题集
  let allQuestions = questions;
  if (identity) {
    const role = getIdentityRole(identity);
    if (role) {
      allQuestions = generateQuestionsByTrack(role.track);
    }
  }

  const dimensionQuestionPatterns: Record<string, RegExp[]> = {
    theory: [/^Q1\.1/, /^Q1\.2/, /^Q1\.3/, /^Q1\.4/],
    engineering: [/^Q2\.1/, /^Q2\.2/, /^Q2\.3/],
    learning: [/^Q3\.1/, /^Q3\.2/, /^Q3\.3/],
    collaboration: [/^Q4\.1/, /^Q4\.2/, /^Q4\.3/],
    radar: [/^Q5\.1/, /^Q5\.2/, /^Q5\.3/],
    innovation: [/^Q6\.1/, /^Q6\.2/, /^Q6\.3/],
    influence: [/^Q7\.1/, /^Q7\.2/],
    aesthetics: [/^Q8\.1/, /^Q8\.2/],
  };

  const dimensionNames: Record<string, string> = {
    theory: '理论洞察力',
    engineering: '工程实现力',
    learning: '学习敏捷度',
    collaboration: 'AI协作力',
    radar: '信息雷达',
    innovation: '创新突破力',
    influence: '影响力声量',
    aesthetics: '表达审美力',
  };

  Object.entries(dimensionQuestionPatterns).forEach(([dimension, patterns]) => {
    const questionScores: ScoreBreakdown['questionScores'] = [];
    
    patterns.forEach(pattern => {
      const matchingQuestion = allQuestions.find(q => pattern.test(q.id));
      if (!matchingQuestion) return;
      
      const answer = answers.find(a => pattern.test(a.questionId));
      
      if (answer) {
        const scoringFn = matchingQuestion.scoring as (answer: any, text?: string) => number;
        const score = scoringFn(answer.value, answer.text);
        if (score > 0) {
          questionScores.push({
            questionId: matchingQuestion.id,
            questionTitle: matchingQuestion.title,
            score,
            maxScore: 10,
          });
        }
      }
    });

    if (questionScores.length > 0) {
      const averageScore = questionScores.reduce((sum: number, q: { score: number }) => sum + q.score, 0) / questionScores.length;
      breakdown.push({
        dimension: dimensionNames[dimension] || dimension,
        questionScores,
        averageScore,
      });
    } else if (dimension === 'engineering') {
      // AI Self-starter的工程实现力使用默认分
      breakdown.push({
        dimension: dimensionNames[dimension] || dimension,
        questionScores: [],
        averageScore: 0, // 会在calculateResult中设置
        isDefault: true,
      });
    }
  });

  return breakdown;
}

// 计算最终结果
export function calculateResult(
  identity: Identity,
  answers: Answer[]
): AssessmentResult {
  // 计算各维度得分（传入identity以获取正确的问题集）
  const scores = calculateDimensionScores(answers, identity);
  const actualType = calculatePersonalityType(scores);
  const badges = generateBadges(answers, scores);
  
  // 计算评分明细
  const scoreBreakdown = calculateScoreBreakdown(answers, identity);
  
  // 如果工程实现力是默认分，更新breakdown中的分数
  const engineeringBreakdown = scoreBreakdown.find(b => b.dimension === '工程实现力');
  if (engineeringBreakdown?.isDefault) {
    engineeringBreakdown.averageScore = scores.engineering;
  }

  // 计算认知偏差
  const q4_1 = answers.find(a => a.questionId === 'Q4.1');
  const bias = (q4_1?.value as string) || '基本一致';

  // 提取高光时刻
  const q4_2 = answers.find(a => a.questionId === 'Q4.2');
  const highlights: string[] = [];
  if (q4_2 && typeof q4_2.value === 'string' && q4_2.value.length > 20) {
    highlights.push(q4_2.value.substring(0, 100));
  }

  return {
    identity,
    actualType,
    scores,
    badges,
    highlights,
    bias: bias as AssessmentResult['bias'],
    answers, // 保存答案用于导出
    scoreBreakdown, // 评分明细
  };
}

