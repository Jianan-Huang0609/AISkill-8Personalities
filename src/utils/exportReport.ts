import { AssessmentResult, Answer } from '../types/questionnaire';
import { questions } from '../data/questions';
// @ts-ignore - jsPDF类型定义问题
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import React from 'react';
import { createRoot } from 'react-dom/client';
import PersonalityOnePage from '../components/PersonalityOnePage';

// 格式化答案显示
function formatAnswer(question: any, answer: Answer): string {
  if (question.type === 'text') {
    return answer.text || String(answer.value) || '未填写';
  }
  
  if (Array.isArray(answer.value)) {
    if (question.options) {
      return answer.value.map(v => {
        const option = question.options?.find((opt: any) => opt.value === v);
        return option ? option.label : v;
      }).join('、');
    }
    return answer.value.join('、');
  }
  
  if (question.options) {
    const option = question.options.find((opt: any) => opt.value === answer.value);
    return option ? option.label : String(answer.value);
  }
  
  return String(answer.value);
}

// 生成Markdown格式的完整报告
export function generateMarkdownReport(result: AssessmentResult, language: 'zh' | 'en' = 'zh'): string {
  const { identity, actualType, scores, badges, bias, highlights, answers = [], outputs = [] } = result;
  const locale = language === 'en' ? 'en-US' : 'zh-CN';
  const date = new Date().toLocaleDateString(locale, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

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

  // 计算三个维度得分
  const A_score = scores.theory;
  const C_score = scores.engineering;
  const B_score = (scores.radar + scores.learning) / 2;
  const D_score = (scores.theory + scores.engineering) / 2;
  const I_score = scores.innovation;
  const O_score = (scores.collaboration + scores.influence) / 2;

  const title = language === 'en' 
    ? '# 🧩 2025 AI Skill Tree Assessment Report\n\n'
    : '# 🧩 2025年AI技能树评测报告\n\n';
  const generatedTime = language === 'en' ? '**Generated Time**' : '**生成时间**';
  const section1 = language === 'en' ? '## I. Identity Positioning\n\n' : '## 一、身份定位\n\n';
  const section2 = language === 'en' ? '## II. Core Personality Profile\n\n' : '## 二、核心人格画像\n\n';
  const mainRole = language === 'en' ? '**Your Main AI Role in 2025**' : '**你的2025年AI主角色**';
  const outputForm = language === 'en' ? '**Main Output Forms**' : '**主要产出形式**';
  const personalityCode = language === 'en' ? '### Your AI Personality Code' : '### 你的AI人格代码';
  const separator = language === 'en' ? ', ' : '、';

  let md = title;
  md += `${generatedTime}: ${date}\n\n`;
  md += `---\n\n`;

  // 一、身份定位
  md += section1;
  md += `${mainRole}: ${identity}\n\n`;
  if (outputs.length > 0) {
    md += `${outputForm}: ${outputs.join(separator)}\n\n`;
  }
  md += `---\n\n`;

  // 二、核心人格画像
  md += section2;
  md += `${personalityCode}: ${actualType.code}\n\n`;
  
  if (actualType.coreTraits && actualType.coreTraits.length > 0) {
    actualType.coreTraits.forEach(trait => {
      md += `${trait}\n\n`;
    });
  }
  
  const metaphorLabel = language === 'en' ? '**Metaphor**' : '**形象比喻**';
  const descriptionLabel = language === 'en' ? '**Personality Description**' : '**人格描述**';
  const identityLabel = language === 'en' ? '**Preset Identity**' : '**预设身份**';
  const biasLabel = language === 'en' ? '**Cognitive Bias**' : '**认知偏差**';
  const section3 = language === 'en' ? '## III. Dimension Score Analysis\n\n' : '## 三、维度得分分析\n\n';
  const section4 = language === 'en' ? '## IV. Strengths & Achievement Patterns\n\n' : '## 四、优势与成就模式\n\n';
  const section5 = language === 'en' ? '## V. Potential Blind Spots & Development Advice\n\n' : '## 五、潜在盲点与发展建议\n\n';
  const section6 = language === 'en' ? '## VI. Achievements & Highlights\n\n' : '## 六、成就与高光\n\n';
  const section7 = language === 'en' ? '## VII. Questionnaire Answers Details\n\n' : '## 七、问卷答案详情\n\n';
  const section8 = language === 'en' ? '## VIII. Appendix\n\n' : '## 八、附录\n\n';
  const dimensionLabel = language === 'en' ? 'Dimension' : '维度';
  const scoreLabel = language === 'en' ? 'Score' : '得分';
  const levelLabel = language === 'en' ? 'Level' : '等级';
  const eightDimensions = language === 'en' ? '### Eight-Dimension Ability Scores\n\n' : '### 八维能力得分\n\n';
  const threeCoreDimensions = language === 'en' ? '### Three Core Dimensions\n\n' : '### 三个核心维度\n\n';
  const superpowers = language === 'en' ? '### 🌟 Your Superpowers\n\n' : '### 🌟 你的超能力\n\n';
  const successFormula = language === 'en' ? '### 🚀 Success Formula\n\n' : '### 🚀 成功方程式\n\n';
  const careerPath = language === 'en' ? '### 📈 Career Path\n\n' : '### 📈 职业生涯路径\n\n';
  const blindSpots = language === 'en' ? '### ⚠️ Common Blind Spots\n\n' : '### ⚠️ 常见盲点\n\n';
  const growthPrescription = language === 'en' ? '### 💡 2026 Growth Prescription\n\n' : '### 💡 2026年成长处方\n\n';
  const partners = language === 'en' ? '### 🤝 Complementary Partners\n\n' : '### 🤝 互补伙伴\n\n';
  const howComplement = language === 'en' ? '- How to complement: ' : '- 如何互补：';
  const partnerNote = language === 'en' ? '- Cooperation Notes: ' : '- 合作注意事项：';
  const yearlyFocus = language === 'en' ? '### 📅 Annual Development Focus\n\n' : '### 📅 年度发展重点\n\n';
  const evolutionPath = language === 'en' ? '### 🎯 Personality Evolution Path\n\n' : '### 🎯 人格进化路径\n\n';
  const badgesLabel = language === 'en' ? '### 🏆 Achievement Badges\n\n' : '### 🏆 成就徽章\n\n';
  const highlightsLabel = language === 'en' ? '### ✨ Highlight Moments\n\n' : '### ✨ 高光时刻\n\n';
  const dimensionDesc = language === 'en' ? '### 📈 Dimension Descriptions\n\n' : '### 📈 维度说明\n\n';
  const decisionStyle = language === 'en' ? '### 🎯 Decision Style\n\n' : '### 🎯 决策模式\n\n';
  const coreDecision = language === 'en' ? '**Core Decision Logic**' : '**核心决策逻辑**';
  const workStyle = language === 'en' ? '### 💼 Work Style\n\n' : '### 💼 工作风格\n\n';
  const learningStyle = language === 'en' ? '### 🎓 Learning Style\n\n' : '### 🎓 学习模式\n\n';
  const pressureResponse = language === 'en' ? '### 😰 Pressure Response\n\n' : '### 😰 压力状态\n\n';
  const recoveryStrategies = language === 'en' ? '### 🛟 Recovery Strategies\n\n' : '### 🛟 恢复策略\n\n';
  const abstractLabel = language === 'en' ? 'Abstract (A)' : '抽象(A)';
  const concreteLabel = language === 'en' ? 'Concrete (C)' : '具体(C)';
  const breadthLabel = language === 'en' ? 'Breadth (B)' : '广度(B)';
  const depthLabel = language === 'en' ? 'Depth (D)' : '深度(D)';
  const independentLabel = language === 'en' ? 'Independent (I)' : '独立(I)';
  const collaborativeLabel = language === 'en' ? 'Collaborative (O)' : '协作(O)';
  const optionAnswer = language === 'en' ? '*Option Answer*' : '*选项答案*';
  const dimensionDescriptions = language === 'en' ? [
    '- **Theoretical Insight**: Understanding depth and systematic thinking ability of AI theory',
    '- **Engineering Execution**: Ability to transform ideas into runnable systems',
    '- **Learning Agility**: Ability to learn quickly and transfer knowledge',
    '- **AI Collaboration**: Ability to collaborate efficiently with AI tools',
    '- **Information Radar**: Ability to acquire and predict cutting-edge information',
    '- **Innovation Breakthrough**: Ability to discover problems and original exploration',
    '- **Influence Voice**: Ability to produce content and spread viewpoints',
    '- **Expression Aesthetics**: Emphasis on product aesthetics and user experience'
  ] : [
    '- **理论洞察力**: 对AI理论的理解深度和系统化思考能力',
    '- **工程实现力**: 将想法转化为可运行系统的能力',
    '- **学习敏捷度**: 快速学习和知识迁移的能力',
    '- **AI协作力**: 与AI工具高效协作的能力',
    '- **信息雷达**: 获取和预判前沿信息的能力',
    '- **创新突破力**: 发现问题和原创探索的能力',
    '- **影响力声量**: 内容产出和观点传播的能力',
    '- **表达审美力**: 产品美感和用户体验的重视程度'
  ];
  const footerText = language === 'en' 
    ? '*This report is generated by the 2025 AI Skill Tree Assessment System*\n*For more information, visit: https://ai-skill-tree.vercel.app*\n'
    : '*本报告由2025年AI技能树评测系统生成*\n*更多信息请访问: https://ai-skill-tree.vercel.app*\n';

  if (actualType.metaphor) {
    md += `${metaphorLabel}: ${actualType.metaphor}\n\n`;
  }
  
  md += `${descriptionLabel}: ${actualType.description}\n\n`;
  md += `${identityLabel}: ${identity}\n`;
  md += `${biasLabel}: ${bias}\n\n`;
  
  // 添加人格类型图片（Markdown格式）
  md += `![${actualType.name}](/8Cats/${actualType.code.replace(/-/g, '')}.png)\n\n`;

  // 三、维度得分分析
  md += section3;
  md += eightDimensions;
  md += `| ${dimensionLabel} | ${scoreLabel} | ${levelLabel} |\n`;
  md += `|------|------|------|\n`;
  
  Object.entries(scores).forEach(([key, score]) => {
    const name = dimensionNames[key] || key;
    const level = score >= 8 ? '⭐⭐⭐' : score >= 6 ? '⭐⭐' : '⭐';
    md += `| ${name} | ${score.toFixed(1)}/10 | ${level} |\n`;
  });
  md += `\n`;

  // 三个核心维度
  md += threeCoreDimensions;
  md += `| ${dimensionLabel} | ${scoreLabel} |\n`;
  md += `|------|------|\n`;
  md += `| ${abstractLabel} | ${A_score.toFixed(1)}/10 |\n`;
  md += `| ${concreteLabel} | ${C_score.toFixed(1)}/10 |\n`;
  md += `| ${breadthLabel} | ${B_score.toFixed(1)}/10 |\n`;
  md += `| ${depthLabel} | ${D_score.toFixed(1)}/10 |\n`;
  md += `| ${independentLabel} | ${I_score.toFixed(1)}/10 |\n`;
  md += `| ${collaborativeLabel} | ${O_score.toFixed(1)}/10 |\n\n`;
  md += `---\n\n`;

  // 四、优势与成就模式
  md += section4;
  md += superpowers;
  actualType.strengths.forEach((strength, i) => {
    md += `${i + 1}. ${strength}\n`;
  });
  md += `\n`;

  if (actualType.successFormula) {
    md += successFormula;
    md += `${actualType.successFormula}\n\n`;
  }

  if (actualType.careerPath && actualType.careerPath.length > 0) {
    md += careerPath;
    actualType.careerPath.forEach((path, i) => {
      md += `${i + 1}. ${path}\n`;
    });
    md += `\n`;
  }

  // 五、潜在盲点与发展建议
  md += section5;
  
  if (actualType.blindSpots && actualType.blindSpots.length > 0) {
    md += blindSpots;
    actualType.blindSpots.forEach((spot, i) => {
      md += `${i + 1}. ${spot}\n`;
    });
    md += `\n`;
  }

  md += growthPrescription;
  if (actualType.detailedAdvice && actualType.detailedAdvice.length > 0) {
    actualType.detailedAdvice.forEach((adviceGroup) => {
      md += `#### ${adviceGroup.title}\n\n`;
      adviceGroup.items.forEach((item, j) => {
        md += `${j + 1}. ${item}\n`;
      });
      md += `\n`;
    });
  } else {
    actualType.growthAdvice.forEach((advice, i) => {
      md += `${i + 1}. ${advice}\n`;
    });
    md += `\n`;
  }

  if (actualType.partners && actualType.partners.length > 0) {
    md += partners;
    actualType.partners.forEach((partner) => {
      md += `**${partner.type}**\n`;
      md += `${howComplement}${partner.how}\n`;
      if (partner.note) {
        md += `${partnerNote}${partner.note}\n`;
      }
      md += `\n`;
    });
  }

  if (actualType.yearlyFocus && actualType.yearlyFocus.length > 0) {
    md += yearlyFocus;
    actualType.yearlyFocus.forEach((focus, i) => {
      md += `${i + 1}. ${focus}\n`;
    });
    md += `\n`;
  }

  if (actualType.evolutionPath) {
    md += evolutionPath;
    md += `${actualType.evolutionPath}\n\n`;
  }

  // 六、成就与高光
  if (badges.length > 0) {
    md += section6;
    md += badgesLabel;
    badges.forEach(badge => {
      md += `- 🎖️ ${badge}\n`;
    });
    md += `\n`;
  }

  if (highlights.length > 0) {
    md += highlightsLabel;
    highlights.forEach((highlight, i) => {
      md += `${i + 1}. ${highlight}\n`;
    });
    md += `\n`;
  }

  // 七、问卷答案详情
  if (answers.length > 0) {
    md += section7;
    
    // 按部分分组问题
    const questionsByPart: Record<string, typeof questions> = {};
    questions.forEach(q => {
      if (!questionsByPart[q.part]) {
        questionsByPart[q.part] = [];
      }
      questionsByPart[q.part].push(q);
    });

    Object.entries(questionsByPart).forEach(([part, partQuestions]) => {
      if (part === 'PART 0') return; // 身份定位已在前面显示
      
      md += `### ${part}\n\n`;
      partQuestions.forEach(question => {
        const answer = answers.find(a => a.questionId === question.id);
        if (answer) {
          md += `**${question.title}**\n\n`;
          const formattedAnswer = formatAnswer(question, answer);
          // 如果答案有文本说明，优先显示文本，让报告更个性化
          if (answer.text && answer.text.trim()) {
            md += `> ${answer.text}\n\n`;
            if (formattedAnswer && formattedAnswer !== answer.text) {
              md += `${optionAnswer}: ${formattedAnswer}\n\n`;
            }
          } else {
            md += `> ${formattedAnswer}\n\n`;
          }
        }
      });
    });
  }

  // 八、附录
  md += `---\n\n`;
  md += section8;
  md += dimensionDesc;
  dimensionDescriptions.forEach(desc => {
    md += `${desc}\n`;
  });
  md += `\n`;

  if (actualType.decisionStyle) {
    md += decisionStyle;
    md += `${coreDecision}: ${actualType.decisionStyle}\n\n`;
  }

  if (actualType.workStyle && actualType.workStyle.length > 0) {
    md += workStyle;
    actualType.workStyle.forEach((style, i) => {
      md += `${i + 1}. ${style}\n`;
    });
    md += `\n`;
  }

  if (actualType.learningStyle) {
    md += learningStyle;
    md += `${actualType.learningStyle}\n\n`;
  }

  if (actualType.pressureResponse && actualType.pressureResponse.length > 0) {
    md += pressureResponse;
    actualType.pressureResponse.forEach((response, i) => {
      md += `${i + 1}. ${response}\n`;
    });
    md += `\n`;
  }

  if (actualType.recoveryStrategies && actualType.recoveryStrategies.length > 0) {
    md += recoveryStrategies;
    actualType.recoveryStrategies.forEach((strategy, i) => {
      md += `${i + 1}. ${strategy}\n`;
    });
    md += `\n`;
  }

  md += `---\n\n`;
  md += footerText;

  return md;
}

// 下载Markdown文件
export function downloadMarkdown(result: AssessmentResult, language: 'zh' | 'en' = 'zh') {
  const md = generateMarkdownReport(result, language);
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const filename = language === 'en' 
    ? `AI_Skill_Tree_Report_${result.actualType.name}_${new Date().toISOString().split('T')[0]}.md`
    : `AI技能树评测报告_${result.actualType.name}_${new Date().toISOString().split('T')[0]}.md`;
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 生成完整PDF报告（包含问题和答案）
export async function generatePDFReport(result: AssessmentResult) {
  const { identity, actualType, scores, badges, bias, highlights, answers = [], outputs = [] } = result;
  const date = new Date().toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

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

  // 计算三个维度得分
  const A_score = scores.theory;
  const C_score = scores.engineering;
  const B_score = (scores.radar + scores.learning) / 2;
  const D_score = (scores.theory + scores.engineering) / 2;
  const I_score = scores.innovation;
  const O_score = (scores.collaboration + scores.influence) / 2;

  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;
  const margin = 20;
  const lineHeight = 7;

  // 辅助函数：检查并添加新页面
  const checkPage = (requiredSpace: number = 20) => {
    if (yPos > pageHeight - requiredSpace) {
      doc.addPage();
      yPos = 20;
      return true;
    }
    return false;
  };

  // 辅助函数：添加文本（自动换行，处理中文）
  const addText = (text: string, fontSize: number = 11, color: number[] = [0, 0, 0], isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    if (isBold) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    doc.setTextColor(color[0], color[1], color[2]);
    
    // 处理中文：将文本转换为UTF-8编码的字符串
    // jsPDF对中文支持有限，使用splitTextToSize可能有问题
    // 尝试直接使用text方法，如果失败则使用备用方案
    try {
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      lines.forEach((line: string) => {
        checkPage();
        // 使用UTF-8编码
        doc.text(line, margin, yPos, { encoding: 'UTF8' });
        yPos += lineHeight;
      });
    } catch (error) {
      // 如果失败，尝试直接输出（可能显示为乱码）
      console.warn('PDF文本编码失败，尝试备用方案:', error);
      checkPage();
      // 使用简单的文本替换，避免特殊字符
      const safeText = text.replace(/[^\x00-\x7F]/g, '?'); // 将非ASCII字符替换为?
      const lines = doc.splitTextToSize(safeText, pageWidth - 2 * margin);
      lines.forEach((line: string) => {
        checkPage();
        doc.text(line, margin, yPos);
        yPos += lineHeight;
      });
    }
    
    if (isBold) {
      doc.setFont('helvetica', 'normal');
    }
  };

  // 标题
  doc.setFontSize(20);
  doc.setTextColor(200, 16, 46);
  doc.text('🧩 2025年AI技能树评测报告', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`生成时间: ${date}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // 一、身份定位
  checkPage(30);
  doc.setFontSize(16);
  doc.setTextColor(200, 16, 46);
  doc.text('一、身份定位', margin, yPos);
  yPos += 10;

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  addText(`你的2025年AI主角色: ${identity}`, 11);
  if (outputs.length > 0) {
    addText(`主要产出形式: ${outputs.join('、')}`, 11);
  }
  yPos += 5;

  // 二、核心人格画像
  checkPage(40);
  doc.setFontSize(16);
  doc.setTextColor(200, 16, 46);
  doc.text('二、核心人格画像', margin, yPos);
  yPos += 10;

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  addText(`你的AI人格代码：${actualType.code}`, 14, [0, 0, 0], true);
  yPos += 5;

  if (actualType.coreTraits && actualType.coreTraits.length > 0) {
    actualType.coreTraits.forEach(trait => {
      addText(trait, 11);
    });
  }

  if (actualType.metaphor) {
    addText(`形象比喻: ${actualType.metaphor}`, 11);
  }

  addText(`人格描述: ${actualType.description}`, 11);
  addText(`预设身份: ${identity}`, 11);
  addText(`认知偏差: ${bias}`, 11);
  yPos += 5;
  
  // 添加人格类型图片（PDF中显示图片路径提示）
  checkPage(30);
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`人格类型图片: /8Cats/${actualType.code.replace(/-/g, '')}.png`, margin, yPos);
  yPos += 8;

  // 三、维度得分分析
  checkPage(50);
  doc.setFontSize(16);
  doc.setTextColor(200, 16, 46);
  doc.text('三、维度得分分析', margin, yPos);
  yPos += 10;

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('八维能力得分', margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  Object.entries(scores).forEach(([key, score]) => {
    checkPage();
    const name = dimensionNames[key] || key;
    const level = score >= 8 ? '⭐⭐⭐' : score >= 6 ? '⭐⭐' : '⭐';
    doc.text(`${name}: ${score.toFixed(1)}/10 ${level}`, margin, yPos);
    yPos += lineHeight;
  });
  yPos += 5;

  doc.setFontSize(12);
  doc.text('三个核心维度', margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.text(`抽象(A): ${A_score.toFixed(1)}/10`, margin, yPos);
  yPos += lineHeight;
  doc.text(`具体(C): ${C_score.toFixed(1)}/10`, margin, yPos);
  yPos += lineHeight;
  doc.text(`广度(B): ${B_score.toFixed(1)}/10`, margin, yPos);
  yPos += lineHeight;
  doc.text(`深度(D): ${D_score.toFixed(1)}/10`, margin, yPos);
  yPos += lineHeight;
  doc.text(`独立(I): ${I_score.toFixed(1)}/10`, margin, yPos);
  yPos += lineHeight;
  doc.text(`协作(O): ${O_score.toFixed(1)}/10`, margin, yPos);
  yPos += 10;

  // 四、优势与成就模式
  checkPage(40);
  doc.setFontSize(16);
  doc.setTextColor(200, 16, 46);
  doc.text('四、优势与成就模式', margin, yPos);
  yPos += 10;

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('🌟 你的超能力', margin, yPos);
  yPos += 8;

  doc.setFontSize(11);
  actualType.strengths.forEach((strength) => {
    checkPage();
    addText(`• ${strength}`, 11);
  });
  yPos += 5;

  if (actualType.successFormula) {
    checkPage(20);
    doc.setFontSize(12);
    doc.text('🚀 成功方程式', margin, yPos);
    yPos += 8;
    addText(actualType.successFormula, 11);
    yPos += 5;
  }

  if (actualType.careerPath && actualType.careerPath.length > 0) {
    checkPage(30);
    doc.setFontSize(12);
    doc.text('📈 职业生涯路径', margin, yPos);
    yPos += 8;
    doc.setFontSize(11);
    actualType.careerPath.forEach((path) => {
      checkPage();
      addText(`• ${path}`, 11);
    });
    yPos += 5;
  }

  // 五、潜在盲点与发展建议
  checkPage(50);
  doc.setFontSize(16);
  doc.setTextColor(200, 16, 46);
  doc.text('五、潜在盲点与发展建议', margin, yPos);
  yPos += 10;

  if (actualType.blindSpots && actualType.blindSpots.length > 0) {
    doc.setFontSize(12);
    doc.text('⚠️ 常见盲点', margin, yPos);
    yPos += 8;
    doc.setFontSize(11);
    actualType.blindSpots.forEach((spot) => {
      checkPage();
      addText(`• ${spot}`, 11);
    });
    yPos += 5;
  }

  doc.setFontSize(12);
  doc.text('💡 2026年成长处方', margin, yPos);
  yPos += 8;

  doc.setFontSize(11);
  if (actualType.detailedAdvice && actualType.detailedAdvice.length > 0) {
    actualType.detailedAdvice.forEach((adviceGroup) => {
      checkPage(30);
      doc.setFont('helvetica', 'bold');
      addText(adviceGroup.title, 11, [0, 0, 0], true);
      doc.setFont('helvetica', 'normal');
      adviceGroup.items.forEach((item) => {
        checkPage();
        addText(`  • ${item}`, 11);
      });
      yPos += 3;
    });
  } else {
    actualType.growthAdvice.forEach((advice) => {
      checkPage();
      addText(`• ${advice}`, 11);
    });
  }
  yPos += 5;

  if (actualType.partners && actualType.partners.length > 0) {
    checkPage(30);
    doc.setFontSize(12);
    doc.text('🤝 互补伙伴', margin, yPos);
    yPos += 8;
    doc.setFontSize(11);
    actualType.partners.forEach((partner) => {
      checkPage(25);
      doc.setFont('helvetica', 'bold');
      addText(partner.type, 11, [0, 0, 0], true);
      doc.setFont('helvetica', 'normal');
      addText(`  如何互补: ${partner.how}`, 10);
      if (partner.note) {
        addText(`  注意事项: ${partner.note}`, 10);
      }
      yPos += 3;
    });
  }

  if (actualType.yearlyFocus && actualType.yearlyFocus.length > 0) {
    checkPage(30);
    doc.setFontSize(12);
    doc.text('📅 年度发展重点', margin, yPos);
    yPos += 8;
    doc.setFontSize(11);
    actualType.yearlyFocus.forEach((focus) => {
      checkPage();
      addText(`• ${focus}`, 11);
    });
    yPos += 5;
  }

  if (actualType.evolutionPath) {
    checkPage(20);
    doc.setFontSize(12);
    doc.text('🎯 人格进化路径', margin, yPos);
    yPos += 8;
    addText(actualType.evolutionPath, 11);
    yPos += 5;
  }

  // 六、成就与高光
  if (badges.length > 0) {
    checkPage(30);
    doc.setFontSize(16);
    doc.setTextColor(200, 16, 46);
    doc.text('六、成就与高光', margin, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('🏆 成就徽章', margin, yPos);
    yPos += 8;

    doc.setFontSize(11);
    badges.forEach((badge) => {
      checkPage();
      doc.text(`🎖️ ${badge}`, margin, yPos);
      yPos += lineHeight;
    });
    yPos += 5;
  }

  if (highlights.length > 0) {
    checkPage(30);
    doc.setFontSize(12);
    doc.text('✨ 高光时刻', margin, yPos);
    yPos += 8;

    doc.setFontSize(11);
    highlights.forEach((highlight) => {
      checkPage();
      addText(`• ${highlight}`, 11);
    });
    yPos += 5;
  }

  // 七、问卷答案详情
  if (answers.length > 0) {
    checkPage(40);
    doc.setFontSize(16);
    doc.setTextColor(200, 16, 46);
    doc.text('七、问卷答案详情', margin, yPos);
    yPos += 10;

    // 按部分分组问题
    const questionsByPart: Record<string, typeof questions> = {};
    questions.forEach(q => {
      if (!questionsByPart[q.part]) {
        questionsByPart[q.part] = [];
      }
      questionsByPart[q.part].push(q);
    });

    Object.entries(questionsByPart).forEach(([part, partQuestions]) => {
      if (part === 'PART 0') return; // 身份定位已在前面显示
      
      checkPage(40);
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text(part, margin, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 10;

      partQuestions.forEach(question => {
        const answer = answers.find(a => a.questionId === question.id);
        if (answer) {
          checkPage(30);
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          addText(question.title, 11, [0, 0, 0], true);
          doc.setFont('helvetica', 'normal');
          yPos += 3;

          const formattedAnswer = formatAnswer(question, answer);
          // 如果答案有文本说明，优先显示文本，让报告更个性化
          if (answer.text && answer.text.trim()) {
            addText(`答案: ${answer.text}`, 10, [50, 50, 50]);
            if (formattedAnswer && formattedAnswer !== answer.text) {
              addText(`选项: ${formattedAnswer}`, 10, [100, 100, 100]);
            }
          } else {
            addText(`答案: ${formattedAnswer}`, 10, [50, 50, 50]);
          }
          yPos += 5;
        }
      });
    });
  }

  // 八、附录
  checkPage(40);
  doc.setFontSize(16);
  doc.setTextColor(200, 16, 46);
  doc.text('八、附录', margin, yPos);
  yPos += 10;

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('📈 维度说明', margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  const dimensionDescriptions = [
    '理论洞察力: 对AI理论的理解深度和系统化思考能力',
    '工程实现力: 将想法转化为可运行系统的能力',
    '学习敏捷度: 快速学习和知识迁移的能力',
    'AI协作力: 与AI工具高效协作的能力',
    '信息雷达: 获取和预判前沿信息的能力',
    '创新突破力: 发现问题和原创探索的能力',
    '影响力声量: 内容产出和观点传播的能力',
    '表达审美力: 产品美感和用户体验的重视程度',
  ];

  dimensionDescriptions.forEach(desc => {
    checkPage();
    doc.text(`• ${desc}`, margin, yPos);
    yPos += lineHeight;
  });
  yPos += 5;

  if (actualType.decisionStyle) {
    checkPage(20);
    doc.setFontSize(12);
    doc.text('🎯 决策模式', margin, yPos);
    yPos += 8;
    addText(`核心决策逻辑: ${actualType.decisionStyle}`, 11);
    yPos += 5;
  }

  if (actualType.workStyle && actualType.workStyle.length > 0) {
    checkPage(30);
    doc.setFontSize(12);
    doc.text('💼 工作风格', margin, yPos);
    yPos += 8;
    doc.setFontSize(11);
    actualType.workStyle.forEach((style) => {
      checkPage();
      addText(`• ${style}`, 11);
    });
    yPos += 5;
  }

  if (actualType.learningStyle) {
    checkPage(20);
    doc.setFontSize(12);
    doc.text('🎓 学习模式', margin, yPos);
    yPos += 8;
    addText(actualType.learningStyle, 11);
    yPos += 5;
  }

  if (actualType.pressureResponse && actualType.pressureResponse.length > 0) {
    checkPage(30);
    doc.setFontSize(12);
    doc.text('😰 压力状态', margin, yPos);
    yPos += 8;
    doc.setFontSize(11);
    actualType.pressureResponse.forEach((response) => {
      checkPage();
      addText(`• ${response}`, 11);
    });
    yPos += 5;
  }

  if (actualType.recoveryStrategies && actualType.recoveryStrategies.length > 0) {
    checkPage(30);
    doc.setFontSize(12);
    doc.text('🛟 恢复策略', margin, yPos);
    yPos += 8;
    doc.setFontSize(11);
    actualType.recoveryStrategies.forEach((strategy) => {
      checkPage();
      addText(`• ${strategy}`, 11);
    });
  }

  // 页脚
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `第 ${i} 页 / 共 ${totalPages} 页`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    doc.text(
      '本报告由2025年AI技能树评测系统生成',
      pageWidth / 2,
      pageHeight - 5,
      { align: 'center' }
    );
  }

  // 保存PDF
  doc.save(`AI技能树评测报告_${actualType.name}_${new Date().toISOString().split('T')[0]}.pdf`);
}

// 通过截图生成PDF（包含图表）
export async function generatePDFWithCharts(result: AssessmentResult) {
  try {
    // 先生成完整文本PDF
    await generatePDFReport(result);
  } catch (error) {
    console.error('生成PDF失败:', error);
    alert('生成PDF失败，请稍后重试');
  }
}

// 下载名片（onepage图片）
export async function downloadPersonalityCard(result: AssessmentResult) {
  try {
    // 创建一个隐藏的容器
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '1200px';
    container.style.height = '800px';
    container.id = 'onepage-download-container';
    document.body.appendChild(container);

    // 使用React渲染onepage组件
    const root = createRoot(container);
    root.render(React.createElement(PersonalityOnePage, { result }));

    // 等待渲染完成
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 查找onepage元素
    const onepageElement = document.getElementById('personality-onepage');
    if (!onepageElement) {
      throw new Error('无法找到onepage元素');
    }

    // 使用html2canvas截图
    const canvas = await html2canvas(onepageElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: 1200,
      height: 800,
    });

    // 转换为图片并下载
    const imgData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `AI人格名片_${result.actualType.name}_${new Date().toISOString().split('T')[0]}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 清理
    root.unmount();
    document.body.removeChild(container);
  } catch (error) {
    console.error('生成名片失败:', error);
    alert('生成名片失败，请稍后重试');
  }
}
