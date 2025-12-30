import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuestionnaireStore } from '../store/questionnaireStore';
import { questions } from '../data/questions';
import { Identity, OutputType } from '../types/questionnaire';
import { identityRoles, OutputType as NewOutputType, getIdentityRole } from '../types/identity';
import { useIdentity } from '../contexts/IdentityContext';
import { generateQuestionsByTrack } from '../utils/questionRouter';
import { calculateResult } from '../utils/scoring';
import QuestionCard from './QuestionCard';
import './Questionnaire.css';

export default function Questionnaire() {
  const { currentStep, setCurrentStep, updateAnswer, identity, setIdentity, setOutputs, outputs, answers, setResult } = useQuestionnaireStore();
  const { track } = useIdentity();
  const [localAnswers, setLocalAnswers] = useState<Record<string, any>>({});
  const [localTexts, setLocalTexts] = useState<Record<string, string>>({});

  // 根据轨道动态加载问题
  // 如果identity已选择但track还未更新，使用identity直接获取track
  let currentTrack = track;
  if (!currentTrack && identity) {
    const role = getIdentityRole(identity);
    currentTrack = role?.track || null;
  }
  
  const regularQuestions = currentTrack 
    ? generateQuestionsByTrack(currentTrack, identity || undefined) 
    : questions.filter(q => q.part !== 'PART 0');
  const totalSteps = regularQuestions.length + 1; // +1 for identity selection
  
  // 调试：输出问题信息
  console.log('当前身份:', identity, '轨道:', currentTrack, '问题数:', regularQuestions.length);
  if (currentStep > 0 && currentStep <= regularQuestions.length) {
    console.log('当前问题:', regularQuestions[currentStep - 1]?.id, regularQuestions[currentStep - 1]?.title);
  }

  const handleNext = () => {
    if (currentStep === 0) {
      // 身份选择步骤
      if (!identity) {
        alert('请先选择您的AI主角色');
        return;
      }
      setCurrentStep(1);
    } else {
      const question = regularQuestions[currentStep - 1];
      const answer = localAnswers[question.id];
      const text = localTexts[question.id];
      
      // 对于text类型的问题，检查text是否有内容
      if (question.type === 'text') {
        if (question.required && (!text || text.trim().length === 0)) {
          alert('请完成当前问题');
          return;
        }
        // text类型的问题，answer可以是空字符串，但text必须有内容
        updateAnswer(question.id, text || '', text);
      } else {
        // 其他类型的问题检查answer
        if (question.required && !answer) {
          alert('请完成当前问题');
          return;
        }
        // 保存答案
        if (answer !== undefined) {
          updateAnswer(question.id, answer, text);
        }
      }

      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // 完成问卷，立即计算并显示结果
        // 使用setTimeout确保答案已保存到store
        setTimeout(() => {
          if (identity) {
            // 获取最新的答案（包括刚保存的）
            const latestAnswers = [...answers];
            // 确保当前问题的答案已包含
            const currentAnswerIndex = latestAnswers.findIndex(a => a.questionId === question.id);
            if (currentAnswerIndex >= 0) {
              latestAnswers[currentAnswerIndex] = { questionId: question.id, value: answer || text || '', text };
            } else if (answer !== undefined || text) {
              latestAnswers.push({ questionId: question.id, value: answer || text || '', text });
            }
            
            console.log('问卷完成，开始计算结果...');
            console.log('身份:', identity);
            console.log('答案数:', latestAnswers.length);
            console.log('答案列表:', latestAnswers.map(a => a.questionId));
            
            try {
              const result = calculateResult(identity, latestAnswers);
              // 添加答案和产出形式到结果中，用于导出
              result.answers = latestAnswers;
              result.outputs = outputs;
              console.log('计算结果:', result);
              console.log('人格类型:', result.actualType);
              console.log('维度得分:', result.scores);
              setResult(result);
            } catch (error) {
              console.error('计算错误:', error);
              alert('计算结果时出错，请检查控制台');
            }
          }
        }, 100);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setLocalAnswers({ ...localAnswers, [questionId]: value });
  };

  const handleTextChange = (questionId: string, text: string) => {
    setLocalTexts({ ...localTexts, [questionId]: text });
  };

  // 当身份改变时，更新IdentityContext
  const handleIdentityChange = (id: Identity) => {
    setIdentity(id);
    // IdentityContext会自动从store中获取identity并更新track
  };

  // 获取当前问题所属的PART
  const getCurrentPart = () => {
    if (currentStep === 0) return 'PART 0';
    const question = regularQuestions[currentStep - 1];
    return question?.part || '';
  };

  // 获取所有PART列表
  const getAllParts = () => {
    const parts = new Set<string>();
    parts.add('PART 0');
    regularQuestions.forEach(q => {
      if (q.part) parts.add(q.part);
    });
    return Array.from(parts).sort();
  };

  const currentPart = getCurrentPart();
  const allParts = getAllParts();
  const currentPartIndex = allParts.indexOf(currentPart);

  return (
    <div className="questionnaire-container">
      {/* 导航栏 */}
      <div className="questionnaire-navbar">
        <div className="navbar-left">
          {allParts.map((part, index) => (
            <div
              key={part}
              className={`nav-part ${part === currentPart ? 'active' : ''} ${index < currentPartIndex ? 'completed' : ''}`}
            >
              {part}
            </div>
          ))}
        </div>
        <div className="navbar-center">
          <h1 className="navbar-title">🎄 2025年AI技能树评测</h1>
        </div>
        <div className="navbar-right">
          <div className="step-indicator">
            步骤 {currentStep + 1} / {totalSteps}
          </div>
        </div>
      </div>

      <div className="questionnaire-header">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="question-content"
        >
          {currentStep === 0 ? (
            <IdentitySelection
              identity={identity}
              outputs={outputs}
              onIdentityChange={handleIdentityChange}
              onOutputsChange={setOutputs}
            />
          ) : (
            <QuestionCard
              question={regularQuestions[currentStep - 1]}
              value={localAnswers[regularQuestions[currentStep - 1].id]}
              text={localTexts[regularQuestions[currentStep - 1].id]}
              onAnswerChange={handleAnswerChange}
              onTextChange={handleTextChange}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="questionnaire-actions">
        <button 
          onClick={handleBack} 
          disabled={currentStep === 0}
          className="btn btn-secondary"
        >
          上一步
        </button>
        <button 
          onClick={handleNext}
          className="btn btn-primary"
        >
          {currentStep === totalSteps - 1 ? '完成' : '下一步'}
        </button>
      </div>
    </div>
  );
}

function IdentitySelection({
  identity,
  outputs,
  onIdentityChange,
  onOutputsChange,
}: {
  identity: Identity | null;
  outputs: OutputType[];
  onIdentityChange: (id: Identity) => void;
  onOutputsChange: (outputs: OutputType[]) => void;
}) {
  // 使用新的10种身份
  const identities = identityRoles.map(role => ({
    value: role.name,
    label: `${role.icon} ${role.name} - ${role.description}`,
  }));

  // 扩展到9种产出类型
  const outputTypes: NewOutputType[] = [
    '可运行的系统/产品',
    '被复用的代码/框架',
    '有洞见的论文/方法论',
    '被传播的内容/观点',
    '可量化的业务结果',
    '提效工具/工作流',
    '社群运营/用户增长',
    '投资决策/分析报告',
    'AI辅助创作内容',
  ];

  const handleOutputToggle = (output: NewOutputType) => {
    if (outputs.includes(output as OutputType)) {
      onOutputsChange(outputs.filter(o => o !== output));
    } else if (outputs.length < 3) { // 改为最多3项
      onOutputsChange([...outputs, output as OutputType]);
    }
  };

  return (
    <div className="identity-selection">
      <h2>🎭 PART 0 | 身份定位</h2>
      <p className="subtitle">这决定了后续评估的默认权重和侧重点</p>

      <div className="question-section">
        <h3>Q0.1 你的2025年AI主角色是？（单选）</h3>
        <div className="options-list">
          {identities.map((id) => (
            <label key={id.value} className="option-card">
              <input
                type="radio"
                name="identity"
                value={id.value}
                checked={identity === id.value}
                onChange={() => onIdentityChange(id.value as Identity)}
              />
              <span>{id.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="question-section">
        <h3>Q0.2 你的主要产出形式是？（最多选3项）</h3>
        <div className="options-list">
          {outputTypes.map((output) => (
            <label 
              key={output} 
              className={`option-card ${outputs.includes(output as OutputType) ? 'selected' : ''} ${outputs.length >= 3 && !outputs.includes(output as OutputType) ? 'disabled' : ''}`}
            >
              <input
                type="checkbox"
                checked={outputs.includes(output as OutputType)}
                onChange={() => handleOutputToggle(output)}
                disabled={outputs.length >= 3 && !outputs.includes(output as OutputType)}
              />
              <span>{output}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

