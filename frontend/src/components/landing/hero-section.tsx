'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Header } from './header';
import Link from 'next/link';
import { useLanguageContext } from '@/context/language-context';
import { getTranslation } from '@/utils/translations';

export function HeroSection() {
  const { language } = useLanguageContext();

  return (
    <section
      className='flex flex-col items-center text-center relative mx-auto rounded-2xl overflow-hidden my-6 py-0 px-4
        w-full h-[400px] md:w-[1220px] md:h-[600px] lg:h-[810px] md:px-0'
    >
      <div className='absolute inset-0 z-0'>
        <img
          src='/images/zatobackground.svg'
          alt='Background pattern'
          className='absolute inset-0 w-full h-full opacity-70 mix-blend-overlay object-cover'
        />
      </div>

      <div className='absolute top-0 left-0 right-0 z-30'>
        <Header />
      </div>

      <div className='relative z-40 space-y-4 md:space-y-5 lg:space-y-6 mb-6 md:mb-7 lg:mb-9 max-w-md md:max-w-[500px] lg:max-w-[588px] mt-16 md:mt-[120px] lg:mt-[160px] px-4'>
        <h1 className='text-[#0D0D0D] text-3xl md:text-4xl lg:text-6xl font-semibold leading-tight'>
          {getTranslation(language, 'hero.title')}
        </h1>
        <p className='text-[#404040] text-base md:text-base lg:text-lg font-medium leading-relaxed max-w-lg mx-auto'>
          {getTranslation(language, 'hero.subtitle')}
        </p>
      </div>

      <Link
        href='https://zatobox.io/'
        target='_blank'
        rel='noopener noreferrer'
      >
        <Button className='relative z-10 bg-zatobox-500 text-white hover:opacity-90 px-8 py-3 rounded-full font-medium text-base shadow-lg ring-1 ring-white/10'>
          {getTranslation(language, 'hero.cta')}
        </Button>
      </Link>
    </section>
  );
}
