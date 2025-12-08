'use client';

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  isLoading: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isSpanish: boolean;
  isEnglish: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('zatobox-language') as Language;
      if (savedLang && (savedLang === 'en' || savedLang === 'es')) {
        setLanguageState(savedLang);
      } else {
        const browserLang =
          navigator.language || navigator.languages?.[0] || 'en';
        const detectedLang = browserLang.startsWith('es') ? 'es' : 'en';
        setLanguageState(detectedLang);
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('zatobox-language', lang);
    }
  };

  const toggleLanguage = () => {
    const newLang = language === 'es' ? 'en' : 'es';
    setLanguage(newLang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        isLoading,
        setLanguage,
        toggleLanguage,
        isSpanish: language === 'es',
        isEnglish: language === 'en',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error(
      'useLanguageContext must be used within a LanguageProvider'
    );
  }
  return context;
}

export const useLanguage = useLanguageContext;
