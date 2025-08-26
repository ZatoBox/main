"use client"

import Image from "next/image"
import { useLanguageContext } from '@/context/language-context';
import { getTranslation } from '@/utils/translations';

export function SocialProof() {
  const { language } = useLanguageContext()
  
  return (
    <section className="self-stretch py-4 md:py-8 flex flex-col justify-center items-center gap-4 md:gap-6 overflow-hidden">
      <div className="text-center text-gray-300 text-sm font-medium leading-tight">
        {getTranslation(language, "socialProof.text")}
      </div>
      <div className="self-stretch flex flex-col gap-4 md:gap-8 items-center max-w-[800px] mx-auto">
        {/* Primera fila: 4 logos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 justify-items-center">
          {Array.from({ length: 4 }).map((_, i) => (
            <Image
              key={i}
              src={`/logos/logo0${i + 1}.svg`}
              alt={`${getTranslation(language, "accessibility.altTexts.companyLogo")} ${i + 1}`}
              width={200}
              height={60}
              className="w-[200px] h-auto object-contain grayscale opacity-70"
              priority={false}
              sizes="200px"
              style={{ width: '200px', height: 'auto' }}
            />
          ))}
        </div>
        {/* Segunda fila: 2 logos centrados */}
        <div className="grid grid-cols-2 gap-4 md:gap-8 justify-items-center">
          {Array.from({ length: 2 }).map((_, i) => (
            <Image
              key={i + 4}
              src={`/logos/logo0${i + 5}.svg`}
              alt={`${getTranslation(language, "accessibility.altTexts.companyLogo")} ${i + 5}`}
              width={200}
              height={60}
              className="w-[200px] h-auto object-contain grayscale opacity-70"
              priority={false}
              sizes="200px"
              style={{ width: '200px', height: 'auto' }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
