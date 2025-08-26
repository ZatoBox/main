"use client"

import { Twitter, Github, Linkedin } from "lucide-react"
import { useLanguageContext } from "@/contexts/language-context"
import { getTranslation } from "@/lib/translations"

export function FooterSection() {
  const { language } = useLanguageContext()
  
  return (
    <footer className="w-full max-w-[1320px] mx-auto px-5 flex flex-col md:flex-row justify-between items-start gap-8 md:gap-0 py-10 md:py-[70px]">
      {/* Left Section: Logo, Description, Social Links */}
      <div className="flex flex-col justify-start items-start gap-8 p-4 md:p-8">
        <div className="flex gap-3 items-stretch justify-center">
          <img src="/logo.png" alt={getTranslation(language, "accessibility.altTexts.logo")} className="h-8 w-auto" />
        </div>
        <div className="max-w-[300px]">
          <p className="text-foreground/90 text-sm font-medium leading-[18px] text-left">{getTranslation(language, "footer.description")}</p>
        </div>
        <div className="flex justify-start items-start gap-3">
                  <a href="https://x.com/ikhunsaa" target="_blank" rel="noopener noreferrer" aria-label={getTranslation(language, "accessibility.ariaLabels.twitter")} className="w-4 h-4 flex items-center justify-center">
          <Twitter className="w-full h-full text-muted-foreground" />
        </a>
                  <a href="https://github.com/ZatoBox" target="_blank" rel="noopener noreferrer" aria-label={getTranslation(language, "accessibility.ariaLabels.github")} className="w-4 h-4 flex items-center justify-center">
          <Github className="w-full h-full text-muted-foreground" />
        </a>
                  <a href="https://www.linkedin.com/company/zatobox" target="_blank" rel="noopener noreferrer" aria-label={getTranslation(language, "accessibility.ariaLabels.linkedin")} className="w-4 h-4 flex items-center justify-center">
          <Linkedin className="w-full h-full text-muted-foreground" />
        </a>
        </div>
      </div>
      
      {/* Right Section: 2 Columns with 2 links each */}
      <div className="grid grid-cols-2 gap-8 md:gap-12 p-4 md:p-8">
        <div className="flex flex-col justify-start items-start gap-3">
          <h3 className="text-muted-foreground text-sm font-medium leading-5">{getTranslation(language, "footer.navigation.title")}</h3>
          <div className="flex flex-col justify-end items-start gap-2">
            <a href="#features-section" className="text-foreground text-sm font-normal leading-5 hover:underline">
              {getTranslation(language, "footer.navigation.features")}
            </a>
            <a href="#pricing-section" className="text-foreground text-sm font-normal leading-5 hover:underline">
              {getTranslation(language, "footer.navigation.pricing")}
            </a>
          </div>
        </div>
        <div className="flex flex-col justify-start items-start gap-3">
          <h3 className="text-muted-foreground text-sm font-medium leading-5">{getTranslation(language, "footer.moreInfo.title")}</h3>
          <div className="flex flex-col justify-end items-start gap-2">
            <a href="#testimonials-section" className="text-foreground text-sm font-normal leading-5 hover:underline">
              {getTranslation(language, "footer.moreInfo.testimonials")}
            </a>
            <a href="#faq-section" className="text-foreground text-sm font-normal leading-5 hover:underline">
              {getTranslation(language, "footer.moreInfo.faq")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
