import { AssessmentResult } from '../types/questionnaire';
import RadarChart from './RadarChart';
import PersonalityCard from './PersonalityCard';
import AllPersonalityTypes from './AllPersonalityTypes';
import { useState } from 'react';
import { downloadMarkdown, generatePDFWithCharts, downloadPersonalityCard } from '../utils/exportReport';
import './ResultView.css';

interface ResultViewProps {
  result: AssessmentResult;
}

export default function ResultView({ result }: ResultViewProps) {
  const [viewMode, setViewMode] = useState<'report' | 'all-types'>('report');

  const handleDownloadMarkdown = () => {
    downloadMarkdown(result);
  };

  const handleDownloadPDF = async () => {
    try {
      // 确保在报告视图下
      if (viewMode !== 'report') {
        setViewMode('report');
        // 等待视图切换
        setTimeout(async () => {
          await generatePDFWithCharts(result);
        }, 500);
      } else {
        await generatePDFWithCharts(result);
      }
    } catch (error) {
      console.error('下载PDF失败:', error);
      alert('下载PDF失败，请稍后重试');
    }
  };

  const handleDownloadCard = async () => {
    try {
      await downloadPersonalityCard(result);
    } catch (error) {
      console.error('下载名片失败:', error);
      alert('下载名片失败，请稍后重试');
    }
  };

  return (
    <div className="result-view">
      <div className="result-header">
        <div className="view-mode-selector">
          <button
            className={viewMode === 'report' ? 'active' : ''}
            onClick={() => setViewMode('report')}
          >
            详细报告
          </button>
          <button
            className={viewMode === 'all-types' ? 'active' : ''}
            onClick={() => setViewMode('all-types')}
          >
            全部AI技能类型
          </button>
        </div>
        <div className="download-buttons">
          <button
            className="download-btn download-card"
            onClick={handleDownloadCard}
            title="下载人格名片（onepage图片）"
          >
            🎴 下载名片
          </button>
          <button
            className="download-btn download-md"
            onClick={handleDownloadMarkdown}
            title="下载Markdown格式报告"
          >
            📄 下载 MD
          </button>
          <button
            className="download-btn download-pdf"
            onClick={handleDownloadPDF}
            title="下载PDF格式报告"
          >
            📑 下载 PDF
          </button>
        </div>
      </div>

      {viewMode === 'report' && (
        <div className="result-report">
          <PersonalityCard result={result} />
          <div className="scores-section">
            <h2>维度得分</h2>
            <RadarChart scores={result.scores} />
            <div className="dimension-details">
              {Object.entries(result.scores).map(([key, score]) => {
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
                return (
                  <div key={key} className="dimension-item">
                    <span className="dimension-name">{dimensionNames[key] || key}</span>
                    <div className="score-bar">
                      <div 
                        className="score-fill" 
                        style={{ width: `${(score / 10) * 100}%` }}
                      />
                    </div>
                    <span className="score-value">{score.toFixed(1)}/10</span>
                  </div>
                );
              })}
            </div>
          </div>
          {result.badges.length > 0 && (
            <div className="badges-section">
              <h2>成就徽章</h2>
              <div className="badges-list">
                {result.badges.map((badge) => (
                  <span key={badge} className="badge">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {viewMode === 'all-types' && <AllPersonalityTypes />}
    </div>
  );
}

