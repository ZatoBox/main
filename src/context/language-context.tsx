"use client"

import React, { createContext, useContext, ReactNode } from 'react'
import { useLanguage, Language } from '@/hooks/use-language'

interface LanguageContextType {
  language: Language
  isLoading: boolean
  toggleLanguage: () => void
  isSpanish: boolean
  isEnglish: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const languageData = useLanguage()

  return (
    <LanguageContext.Provider value={languageData}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguageContext() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider')
  }
  return context
}
