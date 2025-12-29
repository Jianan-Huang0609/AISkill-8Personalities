import { AssessmentResult } from '../types/questionnaire';
import RadarChart from './RadarChart';
import './PersonalityOnePage.css';

interface PersonalityOnePageProps {
  result: AssessmentResult;
}

export default function PersonalityOnePage({ result }: PersonalityOnePageProps) {
  const { actualType, scores } = result;

  return (
    <div className="onepage-container" id="personality-onepage">
      {/* 左上：属性解读 */}
      <div className="onepage-section attribute-section">
        <div className="section-label">属性 : 解读</div>
        <div className="personality-info">
          <div className="personality-name-large">{actualType.name}</div>
          <div className="personality-code-large">{actualType.code}</div>
          {actualType.metaphor && (
            <div className="personality-metaphor">{actualType.metaphor}</div>
          )}
          <div className="personality-description">{actualType.description}</div>
        </div>
      </div>

      {/* 左下：核心特质 → 超能力 → 潜在盲点 → 互补伙伴 */}
      <div className="onepage-section traits-section">
        <div className="traits-section-content">
          <div>
            <div className="section-label">核心特质</div>
            {actualType.coreTraits && actualType.coreTraits.length > 0 && (
              <ul className="traits-list">
                {actualType.coreTraits.map((trait, i) => (
                  <li key={i}>{trait}</li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <div className="section-label">超能力</div>
            <ul className="strengths-list">
              {actualType.strengths.slice(0, 3).map((strength, i) => (
                <li key={i}>{strength}</li>
              ))}
            </ul>
          </div>

          {actualType.blindSpots && actualType.blindSpots.length > 0 && (
            <div>
              <div className="section-label">潜在盲点</div>
              <ul className="blindspots-list">
                {actualType.blindSpots.slice(0, 3).map((spot, i) => (
                  <li key={i}>{spot}</li>
                ))}
              </ul>
            </div>
          )}

          {actualType.partners && actualType.partners.length > 0 && (
            <div>
              <div className="section-label">互补伙伴</div>
              <ul className="partners-list">
                {actualType.partners.map((partner, i) => (
                  <li key={i}>
                    <strong>{partner.type}</strong>
                    <span className="partner-how">{partner.how}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 右侧：使用嵌套grid让两行各占50% */}
      <div className="right-column-wrapper">
        {/* 右上：人格类型猫猫图片 */}
        <div className="onepage-section cat-image-section">
          <div className="section-label">人格形象</div>
          <div className="cat-image-wrapper">
            <img 
              src={`/8Cats/${actualType.code.replace(/-/g, '')}.png`} 
              alt={actualType.name}
              className="personality-cat-image"
              onError={(e) => {
                const imagePath = `/8Cats/${actualType.code.replace(/-/g, '')}.png`;
                console.error('PersonalityOnePage 图片加载失败:', imagePath, '原始code:', actualType.code);
                (e.target as HTMLImageElement).style.display = 'none';
              }}
              onLoad={() => {
                console.log('PersonalityOnePage 图片加载成功:', `/8Cats/${actualType.code.replace(/-/g, '')}.png`);
              }}
            />
          </div>
        </div>

        {/* 右下：雷达图 */}
        <div className="onepage-section radar-section">
          <div className="section-label">雷达</div>
          <div className="radar-container">
            <RadarChart scores={scores} />
          </div>
        </div>
      </div>
    </div>
  );
}

