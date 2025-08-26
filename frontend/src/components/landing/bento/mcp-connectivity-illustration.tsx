"use client"

import Image from "next/image"
import { useLanguageContext } from "@/contexts/language-context"
import { getTranslation } from "@/lib/translations"

const MCPConnectivityIllustration: React.FC = () => {
  const { language } = useLanguageContext()
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Image
        src="/images/mcp-connectivity.png"
        alt={getTranslation(language, "accessibility.altTexts.bentoImages.zatolink")}
        width={400}
        height={300}
        className="w-full h-full object-contain rounded-lg"
        style={{ objectFit: 'contain', objectPosition: 'center' }}
        priority={false}
      />
    </div>
  )
}

export default MCPConnectivityIllustration
