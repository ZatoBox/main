'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguageContext } from '@/context/language-context';
import { getTranslation } from '@/utils/translations';

export function CTASection() {
  const { language } = useLanguageContext();

  return (
    <section className='w-full pt-20 md:pt-60 lg:pt-60 pb-10 md:pb-20 px-5 relative flex flex-col justify-center items-center overflow-visible'>
      <div className='absolute inset-0 z-0'>
        <img
          src='/images/ctabackground.svg'
          alt='CTA Background'
          className='absolute inset-0 w-full h-full mix-blend-overlay object-cover'
        />
      </div>
      <div className='relative z-10 flex flex-col justify-start items-center gap-9 max-w-4xl mx-auto'>
        <div className='flex flex-col justify-start items-center gap-4 text-center relative'>
          <h2 className='relative text-black text-4xl md:text-5xl lg:text-[68px] font-semibold leading-tight md:leading-tight lg:leading-[76px] break-words max-w-[600px] text-center mx-0'>
            {getTranslation(language, 'cta.title')}
          </h2>
          <p className='text-[#404040] text-sm md:text-base font-medium leading-[18.20px] md:leading-relaxed break-words max-w-2xl'>
            {getTranslation(language, 'cta.subtitle')}
          </p>
        </div>
        <Link
          href='https://zatobox.io/'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Button
            className='px-[30px] py-2 bg-[#F2F2F2] text-black text-base font-medium leading-6 rounded-[99px] shadow-[0px_0px_0px_4px_rgba(255,255,255,0.13)] hover:bg-orange-200 transition-all duration-200'
            size='lg'
          >
            {getTranslation(language, 'cta.button')}
          </Button>
        </Link>
      </div>
    </section>
  );
}
