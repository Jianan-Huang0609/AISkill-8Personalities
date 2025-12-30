import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import './PreviewPage.css';

interface PreviewPageProps {
  onStart: () => void;
}

export default function PreviewPage({ onStart }: PreviewPageProps) {
  const { t } = useLanguage();
  const [currentCard, setCurrentCard] = useState(0);

  const cards = [
    {
      id: 'personality',
      icon: '🧩',
      title: t('preview.cards.personality.title'),
      desc: t('preview.cards.personality.desc'),
      highlight: '8种精准人格之一',
    },
    {
      id: 'skillTree',
      icon: '🌳',
      title: t('preview.cards.skillTree.title'),
      desc: t('preview.cards.skillTree.desc'),
      highlight: '8维度雷达 + 成长路径',
    },
    {
      id: 'report',
      icon: '📊',
      title: t('preview.cards.report.title'),
      desc: t('preview.cards.report.desc'),
      highlight: '+ 2026年个性化建议',
    },
  ];

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % cards.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [cards.length]);

  return (
    <div className="preview-page">
      <div className="preview-hero">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="preview-title"
        >
          {t('preview.title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="preview-subtitle"
        >
          {t('preview.subtitle')}
        </motion.p>
      </div>

      {/* 预览轮播 */}
      <div className="preview-carousel">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="preview-card"
          >
            <div className="preview-card-icon">{cards[currentCard].icon}</div>
            <h3 className="preview-card-title">{cards[currentCard].title}</h3>
            <p className="preview-card-desc">{cards[currentCard].desc}</p>
            <span className="preview-card-highlight">{cards[currentCard].highlight}</span>
          </motion.div>
        </AnimatePresence>

        {/* 指示器 */}
        <div className="preview-indicators">
          {cards.map((_, index) => (
            <button
              key={index}
              className={`preview-indicator ${index === currentCard ? 'active' : ''}`}
              onClick={() => setCurrentCard(index)}
            />
          ))}
        </div>
      </div>

      {/* 信任信号 */}
      <div className="trust-signals">
        <div className="trust-item">
          <span className="trust-icon">⏱️</span>
          <div className="trust-content">
            <div className="trust-title">{t('preview.trust.time')}</div>
            <div className="trust-desc">{t('preview.trust.timeDesc')}</div>
          </div>
        </div>
        <div className="trust-item">
          <span className="trust-icon">🔒</span>
          <div className="trust-content">
            <div className="trust-title">{t('preview.trust.security')}</div>
            <div className="trust-desc">{t('preview.trust.securityDesc')}</div>
          </div>
        </div>
        <div className="trust-item">
          <span className="trust-icon">🎁</span>
          <div className="trust-content">
            <div className="trust-title">{t('preview.trust.free')}</div>
            <div className="trust-desc">{t('preview.trust.freeDesc')}</div>
          </div>
        </div>
      </div>

      {/* CTA按钮 */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="cta-button"
      >
        {t('preview.cta.button')}
        <span className="cta-subtext">{t('preview.cta.subtext')}</span>
      </motion.button>
    </div>
  );
}

