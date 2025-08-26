"use client"

import { useLanguageContext } from '@/context/language-context';
import { getTranslation } from '@/utils/translations';
import { Button } from '@/components/ui/button'
import { Languages } from 'lucide-react'

export function LanguageSwitcher() {
  const { language, toggleLanguage, isSpanish, isEnglish } = useLanguageContext()

  return (
    <Button
      onClick={toggleLanguage}
      variant="ghost"
      size="sm"
      className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
    >
      <Languages className="w-4 h-4" />
      <span className="hidden sm:inline">
        {isSpanish ? getTranslation(language, "language.english") : getTranslation(language, "language.spanish")}
      </span>
    </Button>
  )
}
