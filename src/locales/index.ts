import zh from './zh.json';
import en from './en.json';
import { Language } from '../types/i18n';

export default {
  zh,
  en,
};

export function getTranslation(key: string, language: Language = 'zh', params?: Record<string, any>): string {
  const keys = key.split('.');
  let value: any = language === 'en' ? en : zh;
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }

  if (typeof value !== 'string') {
    return key;
  }

  // 简单的参数替换
  if (params) {
    return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match;
    });
  }

  return value;
}

