import { useLanguage } from '../contexts/LanguageContext';
import './LanguageSwitch.css';

export default function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (lang: 'zh' | 'en') => {
    setLanguage(lang);
    // 强制触发重新渲染
    console.log('Language changed to:', lang);
  };

  return (
    <div className="language-switch">
      <button
        type="button"
        className={`lang-button ${language === 'zh' ? 'active' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleLanguageChange('zh');
        }}
      >
        中文
      </button>
      <span className="lang-separator">|</span>
      <button
        type="button"
        className={`lang-button ${language === 'en' ? 'active' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleLanguageChange('en');
        }}
      >
        English
      </button>
    </div>
  );
}

