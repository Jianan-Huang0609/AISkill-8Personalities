import { useQuestionnaireStore } from './store/questionnaireStore';
import Questionnaire from './components/Questionnaire';
import ResultView from './components/ResultView';
import PreviewPage from './components/PreviewPage';
import LanguageSwitch from './components/LanguageSwitch';
import { LanguageProvider } from './contexts/LanguageContext';
import { IdentityProvider } from './contexts/IdentityContext';
import './App.css';
import './components/GuidePage.css';

function App() {
  const { 
    currentStep, 
    result
  } = useQuestionnaireStore();

  if (result) {
    return (
      <LanguageProvider>
        <ResultView result={result} />
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <IdentityProvider>
        <div className="app">
          {/* 语言切换 - 右上角（所有页面都显示） */}
          <div className="app-header-top">
            <LanguageSwitch />
          </div>

          {/* 预告页 */}
          {currentStep === -1 && (
            <PreviewPage onStart={() => {
              const store = useQuestionnaireStore.getState();
              store.setCurrentStep(-0.5); // 使用 -0.5 表示填写引导页
            }} />
          )}

          {/* 填写引导页 - 在预告页之后 */}
          {currentStep === -0.5 && (
            <div className="guide-page">
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
                  <p className="guide-time">预计时间：10-20分钟（根据身份自适应）</p>
                  <button 
                    className="guide-start-button"
                    onClick={() => {
                      const store = useQuestionnaireStore.getState();
                      store.setCurrentStep(0);
                    }}
                  >
                    开始填写
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 问题页面 */}
          {currentStep >= 0 && (
            <Questionnaire />
          )}
        </div>
      </IdentityProvider>
    </LanguageProvider>
  );
}

export default App;

