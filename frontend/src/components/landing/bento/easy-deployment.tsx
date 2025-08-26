"use client"

import Image from "next/image"
import { useLanguageContext } from "@/contexts/language-context"
import { getTranslation } from "@/lib/translations"

interface DeploymentEasyProps {
  /** Width of component – number (px) or any CSS size value */
  width?: number | string
  /** Height of component – number (px) or any CSS size value */
  height?: number | string
  /** Extra Tailwind / CSS classes for root element */
  className?: string
}

const DeploymentEasy: React.FC<DeploymentEasyProps> = ({ width = "100%", height = "100%", className = "" }) => {
  const { language } = useLanguageContext()
  
  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`} style={{ width, height }}>
      <Image
        src="/images/deployment-easy.png"
        alt={getTranslation(language, "accessibility.altTexts.bentoImages.bitcoin")}
        width={400}
        height={300}
        className="w-full h-full object-contain rounded-lg"
        style={{ objectFit: 'contain', objectPosition: 'center' }}
        priority={false}
      />
    </div>
  )
}

export default DeploymentEasy
