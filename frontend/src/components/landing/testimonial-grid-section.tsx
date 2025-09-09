'use client';

import Image from 'next/image';
import { useLanguageContext } from '@/context/language-context';
import { getTranslation } from '@/utils/translations';
import { Language } from '@/hooks/use-language';

const avatarMapping = [
  '/images/avatars/annette-black.png',
  '/images/avatars/dianne-russell.png',
  '/images/avatars/cameron-williamson.png',
  '/images/avatars/robert-fox.png',
  '/images/avatars/darlene-robertson.png',
  '/images/avatars/cody-fisher.png',
  '/images/avatars/albert-flores.png',
];

const typeMapping = [
  'large-teal',
  'small-dark',
  'small-dark',
  'small-dark',
  'small-dark',
  'small-dark',
  'large-light',
];

interface TestimonialCardProps {
  quote: string;
  name: string;
  company: string;
  avatar: string;
  type: string;
  language: Language;
}

const TestimonialCard = ({
  quote,
  name,
  company,
  avatar,
  type,
  language,
}: TestimonialCardProps) => {
  if (!type || !quote || !name || !company || !avatar) {
    console.warn('TestimonialCard: Faltan propiedades requeridas', {
      quote,
      name,
      company,
      avatar,
      type,
    });
    return null;
  }

  const isLargeCard = type.startsWith('large');
  const avatarSize = isLargeCard ? 48 : 36;
  const avatarBorderRadius = isLargeCard
    ? 'rounded-[41px]'
    : 'rounded-[30.75px]';
  const padding = isLargeCard ? 'p-6' : 'p-[30px]';

  let cardClasses = `flex flex-col justify-between items-start overflow-hidden rounded-[10px] shadow-[0px_2px_4px_rgba(128,128,128,0.08)] relative ${padding}`;
  let quoteClasses = '';
  let nameClasses = '';
  let companyClasses = '';
  let backgroundElements = null;
  let cardHeight = '';
  const cardWidth = 'w-full md:w-[384px]';

  if (type === 'large-teal') {
    cardClasses += ' bg-[#FF9D14]';
    quoteClasses += ' text-white text-2xl font-medium leading-8';
    nameClasses += ' text-white text-base font-normal leading-6';
    companyClasses += ' text-white/60 text-base font-normal leading-6';
    cardHeight = 'h-[502px]';
    backgroundElements = (
      <div
        className='absolute inset-0 w-full h-full bg-center bg-no-repeat bg-cover'
        style={{
          backgroundImage: "url('/images/large-card-background.svg')",
          zIndex: 0,
        }}
      />
    );
  } else if (type === 'large-light') {
    cardClasses += ' bg-white border border-gray-200';
    quoteClasses += ' text-black text-2xl font-medium leading-8';
    nameClasses += ' text-black text-base font-semibold leading-6';
    companyClasses += ' text-black text-base font-normal leading-6';
    cardHeight = 'h-[502px]';
    backgroundElements = (
      <div
        className='absolute inset-0 w-full h-full bg-center bg-no-repeat bg-cover opacity-10'
        style={{
          backgroundImage: "url('/images/large-card-background.svg')",
          zIndex: 0,
        }}
      />
    );
  } else {
    cardClasses += ' bg-white border border-gray-200';
    quoteClasses += ' text-black text-[17px] font-normal leading-6';
    nameClasses += ' text-black text-sm font-normal leading-[22px]';
    companyClasses += ' text-black text-sm font-normal leading-[22px]';
    cardHeight = 'h-[244px]';
  }

  return (
    <div className={`${cardClasses} ${cardWidth} ${cardHeight}`}>
      {backgroundElements}
      <div className={`relative z-10 font-normal break-words ${quoteClasses}`}>
        {quote}
      </div>
      <div className='relative z-10 flex items-center justify-start gap-3'>
        <Image
          src={avatar || '/placeholder.svg'}
          alt={`${name} ${getTranslation(
            language,
            'accessibility.altTexts.avatar'
          )}`}
          width={avatarSize}
          height={avatarSize}
          className={`w-${avatarSize / 4} h-${
            avatarSize / 4
          } ${avatarBorderRadius}`}
          style={{ border: '1px solid rgba(128, 128, 128, 0.12)' }}
        />
        <div className='flex flex-col justify-start items-start gap-0.5'>
          <div className={nameClasses}>{name}</div>
          <div className={companyClasses}>{company}</div>
        </div>
      </div>
    </div>
  );
};

export function TestimonialGridSection() {
  const { language }: { language: Language } = useLanguageContext();

  const testimonials = getTranslation(language, 'testimonials.items').map(
    (item: any, index: number) => ({
      quote: item.quote,
      name: item.name,
      company: item.company,
      avatar: avatarMapping[index],
      type: typeMapping[index],
    })
  );

  return (
    <section className='flex flex-col justify-start w-full px-5 py-6 overflow-hidden md:py-8 lg:py-14'>
      <div className='flex flex-col items-center self-stretch justify-center gap-2 py-6 md:py-8 lg:py-14'>
        <div className='flex flex-col items-center justify-start gap-4'>
          <h2 className='text-center text-black text-3xl md:text-4xl lg:text-[40px] font-semibold leading-tight md:leading-tight lg:leading-[40px]'>
            {getTranslation(language, 'testimonials.title')}
          </h2>
          <p className='self-stretch text-center text-black text-sm md:text-sm lg:text-base font-medium leading-[18.20px] md:leading-relaxed lg:leading-relaxed'>
            {getTranslation(language, 'testimonials.subtitle')}
          </p>
        </div>
      </div>
      <div className='w-full pt-0.5 pb-4 md:pb-6 lg:pb-10 flex flex-col md:flex-row justify-center items-start gap-4 md:gap-4 lg:gap-6 max-w-[1100px] mx-auto'>
        <div className='flex flex-col items-start justify-start flex-1 gap-4 md:gap-4 lg:gap-6'>
          <TestimonialCard {...testimonials[0]} language={language} />
          <TestimonialCard {...testimonials[1]} language={language} />
        </div>
        <div className='flex flex-col items-start justify-start flex-1 gap-4 md:gap-4 lg:gap-6'>
          <TestimonialCard {...testimonials[2]} language={language} />
          <TestimonialCard {...testimonials[3]} language={language} />
          <TestimonialCard {...testimonials[4]} language={language} />
        </div>
        <div className='flex flex-col items-start justify-start flex-1 gap-4 md:gap-4 lg:gap-6'>
          <TestimonialCard {...testimonials[5]} language={language} />
          <TestimonialCard {...testimonials[6]} language={language} />
        </div>
      </div>
    </section>
  );
}
