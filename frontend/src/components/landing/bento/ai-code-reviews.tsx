"use client"

import Image from "next/image"
import { useLanguageContext } from "@/contexts/language-context"
import { getTranslation } from "@/lib/translations"

const AiCodeReviews: React.FC = () => {
  const { language } = useLanguageContext()
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Image
        src="/images/ai-code-reviews.png"
        alt={getTranslation(language, "accessibility.altTexts.bentoImages.inventory")}
        width={400}
        height={300}
        className="w-full h-full object-contain rounded-lg"
        style={{ objectFit: 'contain', objectPosition: 'center' }}
        priority={false}
      />
    </div>
  )
}

export default AiCodeReviews
