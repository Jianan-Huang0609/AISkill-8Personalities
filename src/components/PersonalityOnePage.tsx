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

      {/* 左下：核心特质 → 超能力 */}
      <div className="onepage-section traits-section">
        <div className="section-label">核心特质</div>
        {actualType.coreTraits && actualType.coreTraits.length > 0 && (
          <ul className="traits-list">
            {actualType.coreTraits.map((trait, i) => (
              <li key={i}>{trait}</li>
            ))}
          </ul>
        )}

        <div className="section-label">超能力</div>
        <ul className="strengths-list">
          {actualType.strengths.map((strength, i) => (
            <li key={i}>{strength}</li>
          ))}
        </ul>
      </div>

      {/* 右上：互补伙伴 */}
      <div className="onepage-section partners-section">
        <div className="section-label">互补伙伴</div>
        {actualType.partners && actualType.partners.length > 0 && (
          <ul className="partners-list">
            {actualType.partners.map((partner, i) => (
              <li key={i}>
                <strong>{partner.type}</strong>
                <span className="partner-how">{partner.how}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 右下：雷达图 */}
      <div className="onepage-section radar-section">
        <div className="section-label">雷达</div>
        <div className="radar-container">
          <RadarChart scores={scores} />
        </div>
      </div>
    </div>
  );
}

