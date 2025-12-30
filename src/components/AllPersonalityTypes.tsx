import { useState } from 'react';
import { personalityDetails } from '../data/personalityDetails';
import { identityWeights } from '../data/questions';
import { useLanguage } from '../contexts/LanguageContext';
import './AllPersonalityTypes.css';

export default function AllPersonalityTypes() {
  const { language, t } = useLanguage();
  const allTypes = Object.values(personalityDetails);
  const identityNames = Object.keys(identityWeights) as Array<keyof typeof identityWeights>;
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const handleCardClick = (code: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(code)) {
        newSet.delete(code);
      } else {
        newSet.add(code);
      }
      return newSet;
    });
  };

  return (
    <div className="all-personality-types">
      <div className="types-header">
        <h1>{t('allTypes.title')}</h1>
        <p className="subtitle">{t('allTypes.subtitle')}</p>
      </div>

      <div className="types-grid">
        {allTypes.map((type) => {
          const isFlipped = flippedCards.has(type.code);
          return (
            <div 
              key={type.code} 
              className={`type-card-wrapper ${isFlipped ? 'flipped' : ''}`}
              onClick={() => handleCardClick(type.code)}
            >
              <div className="type-card-inner">
                {/* 正面：内容 */}
                <div className="type-card-front">
                  <div className="type-header">
                    <h2>{type.name}</h2>
                    <span className="type-code">{type.code}</span>
                  </div>
                  <div className="type-content">
                    <p className="type-description">{type.description}</p>
                    {type.metaphor && (
                      <div className="type-metaphor">
                        <strong>{t('allTypes.metaphor')}</strong>{type.metaphor}
                      </div>
                    )}
                    {type.coreTraits && type.coreTraits.length > 0 && (
                      <div className="type-traits">
                        <strong>{t('allTypes.coreTraits')}</strong>
                        <ul>
                          {type.coreTraits.map((trait, i) => (
                            <li key={i}>{trait}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {type.strengths && type.strengths.length > 0 && (
                      <div className="type-strengths">
                        <strong>{t('allTypes.strengths')}</strong>
                        <ul>
                          {type.strengths.slice(0, 3).map((strength, i) => (
                            <li key={i}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flip-hint">{t('allTypes.flipHint')}</div>
                </div>
                {/* 背面：猫猫图片 */}
                <div className="type-card-back">
                  <div className="cat-image-back-container">
                    <img 
                      src={`/8Cats/${type.code.replace(/-/g, '')}.png`} 
                      alt={type.name}
                      className="cat-image-back"
                      onError={(e) => {
                        const imagePath = `/8Cats/${type.code.replace(/-/g, '')}.png`;
                        console.error('图片加载失败:', imagePath, '原始code:', type.code);
                        const container = (e.target as HTMLImageElement).parentElement;
                        if (container) {
                          container.innerHTML = `<div style="text-align: center; color: var(--text-gray); padding: 2rem;">${language === 'en' ? 'Image load failed' : '图片加载失败'}<br/>${type.code.replace(/-/g, '')}.png</div>`;
                        }
                      }}
                      onLoad={() => {
                        console.log('图片加载成功:', `/8Cats/${type.code.replace(/-/g, '')}.png`);
                      }}
                    />
                  </div>
                  <div className="flip-hint">{t('allTypes.flipBack')}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="calculation-theory">
        <h2>{t('allTypes.theoryTitle')}</h2>
        
        <div className="theory-section">
          <h3>{t('allTypes.dimensionCalculation')}</h3>
          <p>{t('allTypes.dimensionDesc')}</p>
          <ol>
            <li><strong>{t('allTypes.questionGrouping')}</strong></li>
            <li><strong>{t('allTypes.singleScore')}</strong></li>
            <li><strong>{t('allTypes.dimensionAverage')}</strong></li>
            <li><strong>{t('allTypes.identityWeight')}</strong></li>
          </ol>
          
          <div className="formula-box">
            <strong>{t('allTypes.formula')}</strong>
            <div className="formula">
              {t('allTypes.dimensionScoreFormula')}
            </div>
            <div className="formula">
              {t('allTypes.weightedScoreFormula')}
            </div>
          </div>
        </div>

        <div className="theory-section">
          <h3>{t('allTypes.identityWeights')}</h3>
          <p>{t('allTypes.identityWeightsDesc')}</p>
          <div className="weights-table-container">
            <table className="weights-table">
              <thead>
                <tr>
                  <th>{t('allTypes.dimension')}</th>
                  {identityNames.map(identity => (
                    <th key={identity}>{identity}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{language === 'en' ? 'Theoretical Insight' : '理论洞察力'}</td>
                  {identityNames.map(identity => (
                    <td key={identity}>{(identityWeights[identity].theory * 100).toFixed(0)}%</td>
                  ))}
                </tr>
                <tr>
                  <td>{language === 'en' ? 'Engineering Execution' : '工程实现力'}</td>
                  {identityNames.map(identity => (
                    <td key={identity}>{(identityWeights[identity].engineering * 100).toFixed(0)}%</td>
                  ))}
                </tr>
                <tr>
                  <td>{language === 'en' ? 'Learning Agility' : '学习敏捷度'}</td>
                  {identityNames.map(identity => (
                    <td key={identity}>{(identityWeights[identity].learning * 100).toFixed(0)}%</td>
                  ))}
                </tr>
                <tr>
                  <td>{language === 'en' ? 'AI Collaboration' : 'AI协作力'}</td>
                  {identityNames.map(identity => (
                    <td key={identity}>{(identityWeights[identity].collaboration * 100).toFixed(0)}%</td>
                  ))}
                </tr>
                <tr>
                  <td>{language === 'en' ? 'Information Radar' : '信息雷达'}</td>
                  {identityNames.map(identity => (
                    <td key={identity}>{(identityWeights[identity].radar * 100).toFixed(0)}%</td>
                  ))}
                </tr>
                <tr>
                  <td>{language === 'en' ? 'Innovation Breakthrough' : '创新突破力'}</td>
                  {identityNames.map(identity => (
                    <td key={identity}>{(identityWeights[identity].innovation * 100).toFixed(0)}%</td>
                  ))}
                </tr>
                <tr>
                  <td>{language === 'en' ? 'Influence Voice' : '影响力声量'}</td>
                  {identityNames.map(identity => (
                    <td key={identity}>{(identityWeights[identity].influence * 100).toFixed(0)}%</td>
                  ))}
                </tr>
                <tr>
                  <td>{language === 'en' ? 'Expression Aesthetics' : '表达审美力'}</td>
                  {identityNames.map(identity => (
                    <td key={identity}>{(identityWeights[identity].aesthetics * 100).toFixed(0)}%</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="theory-section">
          <h3>{t('allTypes.personalityType')}</h3>
          <p>{t('allTypes.personalityTypeDesc')}</p>
          <ol>
            <li>
              <strong>{t('allTypes.abstractVsConcrete')}</strong>
              <div className="formula-box">
                <div className="formula">{t('allTypes.aScore')}</div>
                <div className="formula">{t('allTypes.cScore')}</div>
                <div className="formula">{t('allTypes.aVsC')}</div>
              </div>
            </li>
            <li>
              <strong>{t('allTypes.breadthVsDepth')}</strong>
              <div className="formula-box">
                <div className="formula">{t('allTypes.bScore')}</div>
                <div className="formula">{t('allTypes.dScore')}</div>
                <div className="formula">{t('allTypes.bVsD')}</div>
              </div>
            </li>
            <li>
              <strong>{t('allTypes.independentVsCollaborative')}</strong>
              <div className="formula-box">
                <div className="formula">{t('allTypes.iScore')}</div>
                <div className="formula">{t('allTypes.oScore')}</div>
                <div className="formula">{t('allTypes.iVsO')}</div>
              </div>
            </li>
          </ol>
          <div className="formula-box">
            <strong>{t('allTypes.finalType')}</strong>
            <div className="formula">
              {t('allTypes.typeCodeFormula')}
            </div>
            <div className="formula-example">
              {t('allTypes.typeCodeExample')}
            </div>
          </div>
        </div>

        <div className="theory-section">
          <h3>{t('allTypes.additionalTrait')}</h3>
          <p>{t('allTypes.additionalTraitDesc')}</p>
        </div>
      </div>
    </div>
  );
}

