"use client"

import { useState, useEffect } from 'react'

export type Language = 'es' | 'en'

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('es')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window !== 'undefined') {
      // Detectar idioma del navegador
      const detectLanguage = () => {
        const browserLang = navigator.language || navigator.languages?.[0] || 'es'
        const detectedLang = browserLang.startsWith('en') ? 'en' : 'es'
        setLanguage(detectedLang)
        setIsLoading(false)
      }

      detectLanguage()
    } else {
      // En el servidor, usar español por defecto
      setIsLoading(false)
    }
  }, [])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es')
  }

  return {
    language,
    isLoading,
    toggleLanguage,
    isSpanish: language === 'es',
    isEnglish: language === 'en'
  }
}
