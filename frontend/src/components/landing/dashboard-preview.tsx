"use client"

import Image from "next/image" // Import the Image component
import { useLanguageContext } from "@/context/language-context"
import { getTranslation } from "@/utils/translations"

export function DashboardPreview() {
  const { language } = useLanguageContext()
  
  return (
    <div className="w-[calc(100vw-32px)] md:w-[1160px]">
      <div className="bg-primary-light/50 rounded-2xl p-2 shadow-2xl">
        <Image
          src="/images/dashboard-preview.png"
          alt={getTranslation(language, "accessibility.altTexts.dashboard")}
          width={1160}
          height={700}
          priority
          className="w-full h-full object-cover rounded-xl shadow-lg"
        />
      </div>
    </div>
  )
}
