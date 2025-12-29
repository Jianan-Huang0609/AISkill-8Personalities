import { Question } from '../data/questions';

interface QuestionCardProps {
  question: Question;
  value: any;
  text?: string;
  onAnswerChange: (questionId: string, value: any) => void;
  onTextChange: (questionId: string, text: string) => void;
}

export default function QuestionCard({
  question,
  value,
  text,
  onAnswerChange,
  onTextChange,
}: QuestionCardProps) {
  const renderQuestion = () => {
    switch (question.type) {
      case 'single':
        return (
          <div className="options-list">
            {question.options?.map((option) => (
              <label key={option.value} className="option-card">
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => onAnswerChange(question.id, option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'multiple':
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="options-list">
            {question.options?.map((option) => (
              <label key={option.value} className="option-card">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onAnswerChange(question.id, [...selectedValues, option.value]);
                    } else {
                      onAnswerChange(question.id, selectedValues.filter((v: string) => v !== option.value));
                    }
                  }}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'scale':
        const scaleAnswers = typeof value === 'object' && value !== null ? value : {};
        return (
          <div className="scale-options">
            {question.options?.map((option) => {
              const currentValue = scaleAnswers[option.value] || 0;
              return (
                <div key={option.value} className="scale-item">
                  <label className="scale-item-label">{option.label}</label>
                  <div className="scale-buttons">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        className={`scale-btn ${currentValue === num ? 'active' : ''}`}
                        onClick={() => {
                          onAnswerChange(question.id, {
                            ...scaleAnswers,
                            [option.value]: num,
                          });
                        }}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  {currentValue > 0 && (
                    <span className="scale-selected-value">已选择: {currentValue} 分</span>
                  )}
                </div>
              );
            })}
          </div>
        );

      case 'text':
        // text类型的问题，将文本内容同时保存到value和text
        return (
          <textarea
            className="text-input"
            value={text || ''}
            onChange={(e) => {
              const newText = e.target.value;
              onTextChange(question.id, newText);
              // 同时更新answer，这样验证逻辑可以正常工作
              onAnswerChange(question.id, newText);
            }}
            onFocus={(e) => {
              e.stopPropagation();
              e.currentTarget.focus();
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            placeholder="请输入您的回答..."
            rows={8}
            autoFocus={false}
          />
        );

      default:
        return null;
    }
  };

  const shouldShowFollowUp = question.followUp && 
    question.followUp.condition(value);

  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-part">{question.part}</span>
        <span className="question-dimension">{question.dimension}</span>
      </div>
      <h3 className="question-title">{question.title}</h3>
      
      {renderQuestion()}

      {shouldShowFollowUp && (
        <div className="follow-up">
          <label className="follow-up-label">
            {question.followUp!.question}
          </label>
          {question.followUp!.type === 'text' ? (
            <textarea
              className="text-input"
              value={text || ''}
              onChange={(e) => {
                const newText = e.target.value;
                onTextChange(question.id, newText);
                onAnswerChange(question.id, newText);
              }}
              onFocus={(e) => {
                e.stopPropagation();
                e.currentTarget.focus();
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              placeholder="请输入..."
              rows={4}
              autoFocus={false}
            />
          ) : (
            <input
              type="number"
              className="number-input"
              value={text || ''}
              onChange={(e) => {
                const newText = e.target.value;
                onTextChange(question.id, newText);
                onAnswerChange(question.id, newText);
              }}
              onFocus={(e) => {
                e.stopPropagation();
                e.currentTarget.focus();
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              placeholder="请输入数字..."
            />
          )}
        </div>
      )}
    </div>
  );
}

