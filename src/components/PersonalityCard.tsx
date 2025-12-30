import { AssessmentResult } from '../types/questionnaire';
import { useLanguage } from '../contexts/LanguageContext';
import './PersonalityCard.css';

interface PersonalityCardProps {
  result: AssessmentResult;
}

export default function PersonalityCard({ result }: PersonalityCardProps) {
  const { language, t } = useLanguage();
  const { actualType, scores, bias } = result;

  // 按照Plan.md的格式计算三个维度值
  const A_score = scores.theory;
  const C_score = scores.engineering;
  const B_score = (scores.radar + scores.learning) / 2;
  const D_score = (scores.theory + scores.engineering) / 2;
  const I_score = scores.innovation;
  const O_score = (scores.collaboration + scores.influence) / 2;

  const isRefined = scores.aesthetics >= 8;
  
  // 调试信息
  console.log('PersonalityCard 渲染:', {
    type: actualType.code,
    name: actualType.name,
    A_score,
    C_score,
    B_score,
    D_score,
    I_score,
    O_score,
    hasMetaphor: !!actualType.metaphor,
    hasCoreTraits: !!actualType.coreTraits,
    hasDetailedAdvice: !!actualType.detailedAdvice,
  });

  const refinedPrefix = language === 'en' ? 'Refined ' : '精致 ';
  
  return (
    <div className="personality-card">
      <div className="card-header">
        <h1>{t('result.personalityType')}</h1>
        <h2 className="personality-name">
          {isRefined ? refinedPrefix : ''}{actualType.name}
        </h2>
        <div className="personality-code">{actualType.code}</div>
      </div>

      <div className="card-body">
        <div className="dimension-bars">
          <div className="dimension-bar">
            <span className="dim-label">{t('result.abstract')}</span>
            <div className="bar">
              <div 
                className="bar-fill" 
                style={{ width: `${(A_score / 10) * 100}%` }}
              />
            </div>
            <span className="dim-value">{A_score.toFixed(1)}</span>
          </div>
          <div className="dimension-bar">
            <span className="dim-label">{t('result.concrete')}</span>
            <div className="bar">
              <div 
                className="bar-fill" 
                style={{ width: `${(C_score / 10) * 100}%` }}
              />
            </div>
            <span className="dim-value">{C_score.toFixed(1)}</span>
          </div>
          <div className="dimension-bar">
            <span className="dim-label">{t('result.breadth')}</span>
            <div className="bar">
              <div 
                className="bar-fill" 
                style={{ width: `${(B_score / 10) * 100}%` }}
              />
            </div>
            <span className="dim-value">{B_score.toFixed(1)}</span>
          </div>
          <div className="dimension-bar">
            <span className="dim-label">{t('result.depth')}</span>
            <div className="bar">
              <div 
                className="bar-fill" 
                style={{ width: `${(D_score / 10) * 100}%` }}
              />
            </div>
            <span className="dim-value">{D_score.toFixed(1)}</span>
          </div>
          <div className="dimension-bar">
            <span className="dim-label">{t('result.independent')}</span>
            <div className="bar">
              <div 
                className="bar-fill" 
                style={{ width: `${(I_score / 10) * 100}%` }}
              />
            </div>
            <span className="dim-value">{I_score.toFixed(1)}</span>
          </div>
          <div className="dimension-bar">
            <span className="dim-label">{t('result.collaborative')}</span>
            <div className="bar">
              <div 
                className="bar-fill" 
                style={{ width: `${(O_score / 10) * 100}%` }}
              />
            </div>
            <span className="dim-value">{O_score.toFixed(1)}</span>
          </div>
        </div>

        {isRefined && (
          <div className="refined-badge">
            <span className="badge-icon">✨</span>
            <span>{t('result.refinedTrait')}</span>
            <span className="aesthetics-score">{t('result.aestheticsScore')}{scores.aesthetics.toFixed(1)}/10</span>
          </div>
        )}

        <div className="description">
          <p>{actualType.description}</p>
        </div>

        {actualType.metaphor && (
          <div className="metaphor-section">
            <h3>{t('result.metaphor')}</h3>
            <p className="metaphor-text">{actualType.metaphor}</p>
          </div>
        )}

        {actualType.coreTraits && actualType.coreTraits.length > 0 && (
          <div className="core-traits">
            <h3>{t('result.coreTraits')}</h3>
            <ul>
              {actualType.coreTraits.map((trait, i) => (
                <li key={i}>{trait}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="strengths">
          <h3>{t('result.superpowers')}</h3>
          <ul>
            {actualType.strengths.map((strength, i) => (
              <li key={i}>{strength}</li>
            ))}
          </ul>
        </div>

        {actualType.blindSpots && actualType.blindSpots.length > 0 && (
          <div className="blind-spots">
            <h3>{t('result.blindSpots')}</h3>
            <ul>
              {actualType.blindSpots.map((spot, i) => (
                <li key={i}>{spot}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="growth">
          <h3>{t('result.growthPrescription')}</h3>
          {actualType.detailedAdvice && actualType.detailedAdvice.length > 0 ? (
            actualType.detailedAdvice.map((adviceGroup, i) => (
              <div key={i} className="advice-group">
                <h4>{adviceGroup.title}</h4>
                <ul>
                  {adviceGroup.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <ul>
              {actualType.growthAdvice.map((advice, i) => (
                <li key={i}>{advice}</li>
              ))}
            </ul>
          )}
        </div>

        {actualType.partners && actualType.partners.length > 0 && (
          <div className="partners">
            <h3>{t('result.complementaryPartners')}</h3>
            <ul>
              {actualType.partners.map((partner, i) => (
                <li key={i}>
                  <strong>{partner.type}</strong>：{partner.how}
                  {partner.note && <span className="partner-note">（{partner.note}）</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {actualType.yearlyFocus && actualType.yearlyFocus.length > 0 && (
          <div className="yearly-focus">
            <h3>{t('result.yearlyFocus')}</h3>
            <ul>
              {actualType.yearlyFocus.map((focus, i) => (
                <li key={i}>{focus}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="bias-info">
          <p>{t('result.cognitiveBias')}<strong>{bias}</strong></p>
        </div>

        {/* 人格类型图片 */}
        <div className="personality-image-container">
          <img 
            src={`/8Cats/${actualType.code.replace(/-/g, '')}.png`} 
            alt={actualType.name}
            className="personality-image"
            onError={(e) => {
              const imagePath = `/8Cats/${actualType.code.replace(/-/g, '')}.png`;
              console.error('PersonalityCard 图片加载失败:', imagePath, '原始code:', actualType.code);
              (e.target as HTMLImageElement).style.display = 'none';
            }}
            onLoad={() => {
              console.log('PersonalityCard 图片加载成功:', `/8Cats/${actualType.code.replace(/-/g, '')}.png`);
            }}
          />
        </div>
      </div>
    </div>
  );
}

