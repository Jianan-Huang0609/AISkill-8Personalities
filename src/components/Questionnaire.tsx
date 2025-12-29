import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuestionnaireStore } from '../store/questionnaireStore';
import { questions } from '../data/questions';
import { Answer, Identity, OutputType } from '../types/questionnaire';
import { calculateResult } from '../utils/scoring';
import QuestionCard from './QuestionCard';
import './Questionnaire.css';

export default function Questionnaire() {
  const { currentStep, setCurrentStep, updateAnswer, identity, setIdentity, setOutputs, outputs, answers, setResult } = useQuestionnaireStore();
  const [localAnswers, setLocalAnswers] = useState<Record<string, any>>({});
  const [localTexts, setLocalTexts] = useState<Record<string, string>>({});

  // 过滤掉PART 0的问题（单独处理）
  const regularQuestions = questions.filter(q => q.part !== 'PART 0');
  const totalSteps = regularQuestions.length + 1; // +1 for identity selection

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

  return (
    <div className="questionnaire-container">
      <div className="questionnaire-header">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
        <div className="step-indicator">
          步骤 {currentStep + 1} / {totalSteps}
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
              onIdentityChange={setIdentity}
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
  const identities = [
    { value: '工程架构师', label: '工程架构师 - 构建可靠、可扩展的AI系统' },
    { value: '算法研究员', label: '算法研究员 - 深入模型机理，追求性能突破' },
    { value: '产品塑造者', label: '产品塑造者 - 用AI创造卓越用户体验' },
    { value: '组织催化剂', label: '组织催化剂 - 在组织内驱动AI转型与赋能' },
    { value: '跨界探索者', label: '跨界探索者 - 探索AI与特定领域的深度融合' },
  ];

  const outputTypes = [
    '可运行的系统/产品',
    '被复用的代码/框架',
    '有洞见的论文/方法论',
    '被传播的内容/观点',
    '可量化的业务结果',
  ];

  const handleOutputToggle = (output: string) => {
    if (outputs.includes(output)) {
      onOutputsChange(outputs.filter(o => o !== output));
    } else if (outputs.length < 2) {
      onOutputsChange([...outputs, output]);
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
                onChange={() => onIdentityChange(id.value)}
              />
              <span>{id.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="question-section">
        <h3>Q0.2 你的主要产出形式是？（最多选2项）</h3>
        <div className="options-list">
          {outputTypes.map((output) => (
            <label 
              key={output} 
              className={`option-card ${outputs.includes(output) ? 'selected' : ''} ${outputs.length >= 2 && !outputs.includes(output) ? 'disabled' : ''}`}
            >
              <input
                type="checkbox"
                checked={outputs.includes(output)}
                onChange={() => handleOutputToggle(output)}
                disabled={outputs.length >= 2 && !outputs.includes(output)}
              />
              <span>{output}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

