'use client';

import { useLanguageContext } from '@/context/language-context';
import { translations } from '@/utils/translations';

type TranslationKeys = typeof translations.en;

function getNestedValue(obj: any, path: string): string {
  const keys = path.split('.');
  let value = obj;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return path;
    }
  }

  return typeof value === 'string' ? value : path;
}

export function useTranslation() {
  const { language } = useLanguageContext();

  const t = (key: string): string => {
    return getNestedValue(translations[language], key);
  };

  return { t, language };
}
