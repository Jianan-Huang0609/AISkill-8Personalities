import { QuestionTrack } from '../types/identity';
import { Question } from '../data/questions';
import { questions } from '../data/questions';
import { questionsApplication } from '../data/questions/application';
import { questionsExploration } from '../data/questions/exploration';

// 根据轨道和身份生成问题
export function generateQuestionsByTrack(track: QuestionTrack, identityName?: string): Question[] {
  // 技术轨使用原有问题
  if (track === 'technical') {
    return questions.filter(q => q.part !== 'PART 0');
  }

  // 应用轨使用应用层问题
  if (track === 'application') {
    return questionsApplication;
  }

  // 探索轨使用探索层问题
  if (track === 'exploration') {
    let explorationQuestions = questionsExploration;
    
    // 如果是AI Self-starter，跳过工程实现力问题（Q2.1, Q2.2, Q2.3）
    if (identityName === 'AI Self-starter') {
      explorationQuestions = explorationQuestions.filter(q => 
        q.dimension !== '工程实现力' || !q.id.startsWith('Q2')
      );
    }
    
    return explorationQuestions;
  }

  // 默认返回原有问题
  return questions.filter(q => q.part !== 'PART 0');
}

