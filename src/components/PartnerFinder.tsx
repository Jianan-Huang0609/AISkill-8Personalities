import { useState } from 'react';
import { AssessmentResult } from '../types/questionnaire';
import { personalityDetails } from '../data/personalityDetails';
import './PartnerFinder.css';

interface PartnerFinderProps {
  result: AssessmentResult;
}

export default function PartnerFinder({ result }: PartnerFinderProps) {
  const [inputCode, setInputCode] = useState('');
  const [searchedPartner, setSearchedPartner] = useState<string | null>(null);

  const currentType = result.actualType;
  const currentPartners = currentType.partners || [];

  // 所有8种人格类型
  const allPersonalityTypes = Object.keys(personalityDetails);

  // 根据输入的人格代码查找
  const handleSearch = () => {
    const code = inputCode.trim().toUpperCase().replace(/\s+/g, '-');
    if (allPersonalityTypes.includes(code)) {
      setSearchedPartner(code);
    } else {
      alert('未找到该人格类型，请输入正确的人格代码（如：A-B-I）');
      setSearchedPartner(null);
    }
  };

  // 获取人格类型详情
  const getPersonalityInfo = (code: string) => {
    return personalityDetails[code];
  };

  // 判断两个类型是否互补
  const isComplementary = (type1: string, type2: string) => {
    const partners1 = personalityDetails[type1]?.partners || [];
    return partners1.some(p => p.type.includes(type2.split('-')[0]) || p.type.includes(type2));
  };

  return (
    <div className="partner-finder">
      <div className="partner-finder-header">
        <h2>🤝 找到互补伙伴</h2>
        <p className="subtitle">快速定位自己，找到最适合的合作伙伴</p>
      </div>

      {/* 当前人格类型 */}
      <div className="current-personality">
        <div className="personality-badge current">
          <span className="badge-code">{currentType.code}</span>
          <span className="badge-name">{currentType.name}</span>
        </div>
        <p className="current-description">{currentType.description}</p>
      </div>

      {/* 推荐互补伙伴 */}
      {currentPartners.length > 0 && (
        <div className="recommended-partners">
          <h3>💡 系统推荐</h3>
          <div className="partners-list">
            {currentPartners.map((partner, idx) => {
              // 从partner.type中提取人格代码（格式可能是 "C-D-O 产品建造者" 或 "C-D-O"）
              const partnerCodeMatch = partner.type.match(/([A-Z]-[A-Z]-[A-Z])/);
              const partnerCode = partnerCodeMatch ? partnerCodeMatch[1] : partner.type.split(' ')[0];
              const partnerInfo = getPersonalityInfo(partnerCode);
              
              return (
                <div key={idx} className="partner-card">
                  <div className="partner-header">
                    <div className="personality-badge partner">
                      <span className="badge-code">{partnerCode}</span>
                      <span className="badge-name">{partnerInfo?.name || partner.type}</span>
                    </div>
                    <span className="complementary-badge">互补</span>
                  </div>
                  <div className="partner-content">
                    <p className="partner-how">
                      <strong>如何互补：</strong>{partner.how}
                    </p>
                    {partner.note && (
                      <p className="partner-note">
                        <strong>注意事项：</strong>{partner.note}
                      </p>
                    )}
                    {partnerInfo && (
                      <div className="partner-strengths">
                        <strong>他们的优势：</strong>
                        <ul>
                          {partnerInfo.strengths.slice(0, 3).map((strength, i) => (
                            <li key={i}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 快速查找功能 */}
      <div className="quick-search">
        <h3>🔍 快速查找其他类型</h3>
        <p className="search-hint">输入人格代码（如：C-D-O）查看该类型的详细信息</p>
        <div className="search-input-group">
          <input
            type="text"
            className="partner-code-input"
            placeholder="输入人格代码，如：A-B-I"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="search-button" onClick={handleSearch}>
            查找
          </button>
        </div>

        {searchedPartner && (
          <div className="searched-result">
            {(() => {
              const partnerInfo = getPersonalityInfo(searchedPartner);
              if (!partnerInfo) return null;
              
              const isComp = isComplementary(currentType.code, searchedPartner);
              
              return (
                <div className={`partner-card ${isComp ? 'complementary' : ''}`}>
                  <div className="partner-header">
                    <div className="personality-badge partner">
                      <span className="badge-code">{partnerInfo.code}</span>
                      <span className="badge-name">{partnerInfo.name}</span>
                    </div>
                    {isComp && <span className="complementary-badge">互补</span>}
                  </div>
                  <div className="partner-content">
                    <p className="partner-description">{partnerInfo.description}</p>
                    <div className="partner-strengths">
                      <strong>优势：</strong>
                      <ul>
                        {partnerInfo.strengths.slice(0, 3).map((strength, i) => (
                          <li key={i}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                    {partnerInfo.partners && partnerInfo.partners.length > 0 && (
                      <div className="partner-partners">
                        <strong>他们推荐的伙伴：</strong>
                        <ul>
                          {partnerInfo.partners.map((p, i) => (
                            <li key={i}>{p.type} - {p.how}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 所有类型快速选择 */}
        <div className="all-types-quick">
          <p className="quick-hint">或快速选择：</p>
          <div className="type-buttons">
            {allPersonalityTypes.map((code) => {
              const info = getPersonalityInfo(code);
              return (
                <button
                  key={code}
                  className={`type-button ${searchedPartner === code ? 'active' : ''}`}
                  onClick={() => {
                    setInputCode(code);
                    setSearchedPartner(code);
                  }}
                  title={info?.name}
                >
                  {code}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 互补原理说明 */}
      <div className="complementary-explanation">
        <h3>📚 互补原理</h3>
        <div className="explanation-content">
          <p>
            互补伙伴通常具有<strong>不同的核心维度特征</strong>，能够：
          </p>
          <ul>
            <li><strong>维度互补：</strong>抽象(A)与具体(C)、广度(B)与深度(D)、独立(I)与协作(O)的互补</li>
            <li><strong>能力互补：</strong>理论洞察与工程实现、创新突破与团队协作的互补</li>
            <li><strong>风格互补：</strong>快速迭代与深度思考、独立探索与团队合作的互补</li>
          </ul>
          <p className="tip">
            💡 <strong>提示：</strong>找到互补伙伴后，建议明确分工，定期沟通，发挥各自优势，共同完成项目。
          </p>
        </div>
      </div>
    </div>
  );
}

