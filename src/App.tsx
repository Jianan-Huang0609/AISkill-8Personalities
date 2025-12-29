import { useQuestionnaireStore } from './store/questionnaireStore';
import Questionnaire from './components/Questionnaire';
import ResultView from './components/ResultView';
import './App.css';

function App() {
  const { 
    currentStep, 
    result
  } = useQuestionnaireStore();

  if (result) {
    return <ResultView result={result} />;
  }

  return (
    <div className="app">
      <div className="app-header">
        <h1>🎄 2025年AI技能树评测</h1>
        <p className="subtitle">
          全方位复盘您的2025年成长 · 生成专属技能树 · 指引2026年发展方向
        </p>
      </div>

      {/* 填写引导 - 只在首页显示 */}
      {currentStep === 0 && (
        <div className="guide-section">
          <div className="guide-section-inner">
            <div className="guide-header">
              <span className="guide-icon">📋</span>
              <h2>填写引导</h2>
            </div>
            <p className="guide-welcome">欢迎参加2025年AI技能树评测！本问卷将：</p>
            <ol className="guide-steps">
              <li>先确定您的AI角色 - 为您定制评估重点</li>
              <li>评估8个核心维度 - 全方位复盘您的2025年成长</li>
              <li>生成专属技能树 - 可视化您的AI能力图谱</li>
              <li>提供成长建议 - 指引2026年发展方向</li>
            </ol>
            <p className="guide-time">预计时间：10-15分钟</p>
          </div>
        </div>
      )}

      <Questionnaire />
    </div>
  );
}

export default App;

