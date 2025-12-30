import { AssessmentResult } from '../types/questionnaire';
import RadarChart from './RadarChart';
import PersonalityCard from './PersonalityCard';
import AllPersonalityTypes from './AllPersonalityTypes';
import LanguageSwitch from './LanguageSwitch';
import PartnerFinder from './PartnerFinder';
import { useState } from 'react';
import { downloadMarkdown, downloadPersonalityCard } from '../utils/exportReport';
import { useLanguage } from '../contexts/LanguageContext';
import './ResultView.css';

interface ResultViewProps {
  result: AssessmentResult;
}

export default function ResultView({ result }: ResultViewProps) {
  const { language, t } = useLanguage();
  const [viewMode, setViewMode] = useState<'report' | 'all-types'>('report');

  const handleDownloadMarkdown = () => {
    downloadMarkdown(result, language);
  };

  const handleDownloadReport = () => {
    // 下载详细报告（Markdown格式，包含所有内容）
    downloadMarkdown(result, language);
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
      <div className="result-header-top">
        <LanguageSwitch />
      </div>
      <div className="result-header">
        <div className="view-mode-selector">
          <button
            className={viewMode === 'report' ? 'active' : ''}
            onClick={() => setViewMode('report')}
          >
            {t('result.viewDetails')}
          </button>
          <button
            className={viewMode === 'all-types' ? 'active' : ''}
            onClick={() => setViewMode('all-types')}
          >
            {t('result.viewAllTypes')}
          </button>
        </div>
        <div className="download-buttons">
          <button
            className="download-btn download-card"
            onClick={handleDownloadCard}
            title={language === 'en' ? 'Download personality card (onepage image)' : '下载人格名片（onepage图片）'}
          >
            {t('result.downloadCard')}
          </button>
          <button
            className="download-btn download-report"
            onClick={handleDownloadReport}
            title={language === 'en' ? 'Download detailed report (Markdown format, includes all content)' : '下载详细报告（Markdown格式，包含所有内容）'}
          >
            {t('result.downloadReport')}
          </button>
          <button
            className="download-btn download-md"
            onClick={handleDownloadMarkdown}
            title={language === 'en' ? 'Download Markdown format report' : '下载Markdown格式报告'}
          >
            {t('result.downloadMD')}
          </button>
        </div>
      </div>

      {viewMode === 'report' && (
        <div className="result-report">
          <PersonalityCard result={result} />
          <PartnerFinder result={result} />
          <div className="scores-section">
            <h2>{t('result.dimensionScores')}</h2>
            <RadarChart scores={result.scores} />
            <div className="dimension-details">
              {Object.entries(result.scores).map(([key, score]) => {
                const dimensionNames: Record<string, string> = {
                  theory: language === 'en' ? 'Theoretical Insight' : '理论洞察力',
                  engineering: language === 'en' ? 'Engineering Execution' : '工程实现力',
                  learning: language === 'en' ? 'Learning Agility' : '学习敏捷度',
                  collaboration: language === 'en' ? 'AI Collaboration' : 'AI协作力',
                  radar: language === 'en' ? 'Information Radar' : '信息雷达',
                  innovation: language === 'en' ? 'Innovation Breakthrough' : '创新突破力',
                  influence: language === 'en' ? 'Influence Voice' : '影响力声量',
                  aesthetics: language === 'en' ? 'Expression Aesthetics' : '表达审美力',
                };
                const breakdown = result.scoreBreakdown?.find(b => b.dimension === dimensionNames[key]);
                const isDefault = breakdown?.isDefault;
                
                return (
                  <div key={key} className="dimension-item">
                    <div className="dimension-header">
                      <span className="dimension-name">{dimensionNames[key] || key}</span>
                      {isDefault && (
                        <span className="default-score-badge" title={language === 'en' ? 'This dimension uses default score (estimated based on other dimensions)' : '该维度使用默认分（基于其他维度估算）'}>
                          {t('result.defaultScore')}
                        </span>
                      )}
                    </div>
                    <div className="dimension-score-row">
                      <div className="score-bar">
                        <div 
                          className="score-fill" 
                          style={{ width: `${(score / 10) * 100}%` }}
                        />
                      </div>
                      <span className="score-value">{score.toFixed(1)}/10</span>
                    </div>
                    {breakdown && breakdown.questionScores.length > 0 && (
                      <details className="score-breakdown">
                        <summary className="breakdown-toggle">{t('result.scoreBreakdown')}</summary>
                        <div className="breakdown-content">
                          {breakdown.questionScores.map((qs, idx) => (
                            <div key={idx} className="breakdown-item">
                              <span className="breakdown-question">{qs.questionTitle}</span>
                              <span className="breakdown-score">{qs.score.toFixed(1)}/10</span>
                            </div>
                          ))}
                          <div className="breakdown-average">
                            {t('result.averageScore')} {breakdown.averageScore.toFixed(1)}/10
                          </div>
                        </div>
                      </details>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {result.badges.length > 0 && (
            <div className="badges-section">
              <h2>{language === 'en' ? 'Achievement Badges' : '成就徽章'}</h2>
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

