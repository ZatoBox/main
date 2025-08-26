"use client"

import Image from "next/image"
import { useLanguageContext } from "@/contexts/language-context"
import { getTranslation } from "@/lib/translations"

const RealtimeCodingPreviews: React.FC = () => {
  const { language } = useLanguageContext()
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Image
        src="/images/realtime-coding-previews.png"
        alt={getTranslation(language, "accessibility.altTexts.bentoImages.ocr")}
        width={400}
        height={300}
        className="w-full h-full object-contain rounded-lg"
        style={{ objectFit: 'contain', objectPosition: 'center' }}
        priority={false}
      />
    </div>
  )
}

export default RealtimeCodingPreviews
