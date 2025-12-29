import { useState } from 'react';
import { personalityDetails } from '../data/personalityDetails';
import { identityWeights } from '../data/questions';
import './AllPersonalityTypes.css';

export default function AllPersonalityTypes() {
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
        <h1>🧩 全部AI技能类型</h1>
        <p className="subtitle">探索八种AI人格类型，了解你的技能画像</p>
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
                        <strong>形象比喻：</strong>{type.metaphor}
                      </div>
                    )}
                    {type.coreTraits && type.coreTraits.length > 0 && (
                      <div className="type-traits">
                        <strong>核心特质：</strong>
                        <ul>
                          {type.coreTraits.map((trait, i) => (
                            <li key={i}>{trait}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {type.strengths && type.strengths.length > 0 && (
                      <div className="type-strengths">
                        <strong>优势：</strong>
                        <ul>
                          {type.strengths.slice(0, 3).map((strength, i) => (
                            <li key={i}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flip-hint">点击卡片查看猫猫形象 🐱</div>
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
                          container.innerHTML = `<div style="text-align: center; color: var(--text-gray); padding: 2rem;">图片加载失败<br/>${type.code.replace(/-/g, '')}.png</div>`;
                        }
                      }}
                      onLoad={() => {
                        console.log('图片加载成功:', `/8Cats/${type.code.replace(/-/g, '')}.png`);
                      }}
                    />
                  </div>
                  <div className="flip-hint">点击卡片返回</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="calculation-theory">
        <h2>📊 计算权重得分的理论方法</h2>
        
        <div className="theory-section">
          <h3>一、维度得分计算</h3>
          <p>每个维度的得分通过以下步骤计算：</p>
          <ol>
            <li><strong>问题分组：</strong>将问卷中的问题按8个维度进行分组</li>
            <li><strong>单题得分：</strong>根据用户答案，使用每题的评分函数计算得分（0-10分）</li>
            <li><strong>维度平均：</strong>计算该维度下所有问题的平均得分</li>
            <li><strong>身份权重：</strong>根据用户选择的身份角色，应用对应的权重矩阵</li>
          </ol>
          
          <div className="formula-box">
            <strong>计算公式：</strong>
            <div className="formula">
              维度得分 = Σ(单题得分) / 题目数量
            </div>
            <div className="formula">
              加权得分 = 维度得分 × 身份权重
            </div>
          </div>
        </div>

        <div className="theory-section">
          <h3>二、身份权重矩阵</h3>
          <p>不同身份角色对各维度的重视程度不同，权重矩阵如下：</p>
          <div className="weights-table-container">
            <table className="weights-table">
              <thead>
                <tr>
                  <th>维度</th>
                  {identityNames.map(identity => (
                    <th key={identity}>{identity}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>理论洞察力</td>
                  {identityNames.map(identity => (
                    <td key={identity}>{(identityWeights[identity].theory * 100).toFixed(0)}%</td>
                  ))}
                </tr>
                <tr>
                  <td>工程实现力</td>
                  {identityNames.map(identity => (
                    <td key={identity}>{(identityWeights[identity].engineering * 100).toFixed(0)}%</td>
                  ))}
                </tr>
                <tr>
                  <td>学习敏捷度</td>
                  {identityNames.map(identity => (
                    <td key={identity}>{(identityWeights[identity].learning * 100).toFixed(0)}%</td>
                  ))}
                </tr>
                <tr>
                  <td>AI协作力</td>
                  {identityNames.map(identity => (
                    <td key={identity}>{(identityWeights[identity].collaboration * 100).toFixed(0)}%</td>
                  ))}
                </tr>
                <tr>
                  <td>信息雷达</td>
                  {identityNames.map(identity => (
                    <td key={identity}>{(identityWeights[identity].radar * 100).toFixed(0)}%</td>
                  ))}
                </tr>
                <tr>
                  <td>创新突破力</td>
                  {identityNames.map(identity => (
                    <td key={identity}>{(identityWeights[identity].innovation * 100).toFixed(0)}%</td>
                  ))}
                </tr>
                <tr>
                  <td>影响力声量</td>
                  {identityNames.map(identity => (
                    <td key={identity}>{(identityWeights[identity].influence * 100).toFixed(0)}%</td>
                  ))}
                </tr>
                <tr>
                  <td>表达审美力</td>
                  {identityNames.map(identity => (
                    <td key={identity}>{(identityWeights[identity].aesthetics * 100).toFixed(0)}%</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="theory-section">
          <h3>三、人格类型判定</h3>
          <p>根据三个核心维度的得分，判定用户的人格类型：</p>
          <ol>
            <li>
              <strong>抽象(A) vs 具体(C)：</strong>
              <div className="formula-box">
                <div className="formula">A得分 = 理论洞察力得分</div>
                <div className="formula">C得分 = 工程实现力得分</div>
                <div className="formula">如果 A得分 &gt; C得分，则为抽象(A)，否则为具体(C)</div>
              </div>
            </li>
            <li>
              <strong>广度(B) vs 深度(D)：</strong>
              <div className="formula-box">
                <div className="formula">B得分 = (信息雷达得分 + 学习敏捷度得分) / 2</div>
                <div className="formula">D得分 = (理论洞察力得分 + 工程实现力得分) / 2</div>
                <div className="formula">如果 B得分 &gt; D得分，则为广度(B)，否则为深度(D)</div>
              </div>
            </li>
            <li>
              <strong>独立(I) vs 协作(O)：</strong>
              <div className="formula-box">
                <div className="formula">I得分 = 创新突破力得分</div>
                <div className="formula">O得分 = (AI协作力得分 + 影响力声量得分) / 2</div>
                <div className="formula">如果 I得分 &gt; O得分，则为独立(I)，否则为协作(O)</div>
              </div>
            </li>
          </ol>
          <div className="formula-box">
            <strong>最终类型代码：</strong>
            <div className="formula">
              类型代码 = (A或C) + (B或D) + (I或O)
            </div>
            <div className="formula-example">
              例如：A-B-O 表示抽象-广度-协作型，即"理论布道者"
            </div>
          </div>
        </div>

        <div className="theory-section">
          <h3>四、附加特质判定</h3>
          <p>如果表达审美力得分 ≥ 8.0，则获得"精致"附加特质，人格类型前会加上"精致"前缀。</p>
        </div>
      </div>
    </div>
  );
}

