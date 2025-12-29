import { Answer, DimensionScores, Identity, PersonalityType, AssessmentResult } from '../types/questionnaire';
import { questions } from '../data/questions';
import { personalityDetails } from '../data/personalityDetails';

// 计算各维度得分
export function calculateDimensionScores(
  answers: Answer[]
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

  // 按维度分组问题
  const dimensionQuestions: Record<string, string[]> = {
    theory: ['Q1.1', 'Q1.2', 'Q1.3', 'Q1.4'],
    engineering: ['Q2.1', 'Q2.2', 'Q2.3'],
    learning: ['Q3.1', 'Q3.2', 'Q3.3'],
    collaboration: ['Q4.1', 'Q4.2', 'Q4.3'],
    radar: ['Q5.1', 'Q5.2', 'Q5.3'],
    innovation: ['Q6.1', 'Q6.2', 'Q6.3'],
    influence: ['Q7.1', 'Q7.2'],
    aesthetics: ['Q8.1', 'Q8.2'],
  };

  // 计算每个维度的平均分
  Object.entries(dimensionQuestions).forEach(([dimension, questionIds]) => {
    const dimensionScores: number[] = [];
    
    questionIds.forEach(qId => {
      const question = questions.find(q => q.id === qId);
      const answer = answers.find(a => a.questionId === qId);
      
      if (question && answer) {
        // 根据 scoring 函数的签名调用
        // 注意：虽然类型定义是 (answer: any) => number，但实际实现可能接受两个参数
        // 使用类型断言来调用
        const scoringFn = question.scoring as (answer: any, text?: string) => number;
        const score = scoringFn(answer.value, answer.text);
        if (score > 0) {
          dimensionScores.push(score);
        }
      }
    });
    
    if (dimensionScores.length > 0) {
      scores[dimension as keyof DimensionScores] = 
        dimensionScores.reduce((a, b) => a + b, 0) / dimensionScores.length;
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

// 计算最终结果
export function calculateResult(
  identity: Identity,
  answers: Answer[]
): AssessmentResult {
  const scores = calculateDimensionScores(answers);
  const actualType = calculatePersonalityType(scores);
  const badges = generateBadges(answers, scores);

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
  };
}

