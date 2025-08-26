"use client"

import Image from "next/image"
import { useLanguageContext } from "@/context/language-context"
import { getTranslation } from "@/utils/translations"

const OneClickIntegrationsIllustration: React.FC = () => {
  const { language } = useLanguageContext()
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Image
        src="/images/one-click-integrations.png"
        alt={getTranslation(language, "accessibility.altTexts.bentoImages.payments")}
        width={400}
        height={300}
        className="w-full h-full object-contain rounded-lg"
        style={{ objectFit: 'contain', objectPosition: 'center' }}
        priority={false}
      />
    </div>
  )
}

export default OneClickIntegrationsIllustration
