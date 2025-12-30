// 国际化类型定义

export type Language = 'zh' | 'en';

export interface TranslationKey {
  [key: string]: string | TranslationKey;
}

