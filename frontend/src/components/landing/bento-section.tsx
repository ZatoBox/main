'use client';

import AiCodeReviews from './bento/ai-code-reviews';
import RealtimeCodingPreviews from './bento/real-time-previews';
import OneClickIntegrationsIllustration from './bento/one-click-integrations-illustration';
import MCPConnectivityIllustration from './bento/mcp-connectivity-illustration'; // Updated import
import EasyDeployment from './bento/easy-deployment';
import WhatsAppAutomation from './bento/parallel-agents'; // Updated import
import { useLanguageContext } from '@/context/language-context';
import { getTranslation } from '@/utils/translations';

interface BentoCardProps {
  title: string;
  description: string;
  Component: React.ComponentType;
}

const BentoCard = ({ title, description, Component }: BentoCardProps) => (
  <div className='overflow-hidden rounded-2xl border border-white/20 flex flex-col justify-start items-start relative'>
    {/* Background with blur effect */}
    <div
      className='absolute inset-0 rounded-2xl'
      style={{
        background: 'rgba(231, 236, 235, 0.08)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
    />
    {/* Additional subtle gradient overlay */}
    <div className='absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl' />

    <div className='self-stretch p-6 flex flex-col justify-start items-start gap-2 relative z-10'>
      <div className='self-stretch flex flex-col justify-start items-start gap-1.5'>
        <p className='self-stretch text-lg leading-7'>
          <span className='text-zatobox-900 font-bold'>{title}</span> <br />
          <span className='text-zatobox-600 font-light'>{description}</span>
        </p>
      </div>
    </div>
    <div className='self-stretch h-80 relative z-10'>
      <Component />
    </div>
  </div>
);

export function BentoSection() {
  const { language } = useLanguageContext();

  const cards = [
    {
      title: getTranslation(language, 'bento.cards.inventory.title'),
      description: getTranslation(
        language,
        'bento.cards.inventory.description'
      ),
      Component: AiCodeReviews,
    },
    {
      title: getTranslation(language, 'bento.cards.ocr.title'),
      description: getTranslation(language, 'bento.cards.ocr.description'),
      Component: RealtimeCodingPreviews,
    },
    {
      title: getTranslation(language, 'bento.cards.payments.title'),
      description: getTranslation(language, 'bento.cards.payments.description'),
      Component: OneClickIntegrationsIllustration,
    },
    {
      title: getTranslation(language, 'bento.cards.zatolink.title'),
      description: getTranslation(language, 'bento.cards.zatolink.description'),
      Component: MCPConnectivityIllustration, // mantenido igual
    },
    {
      title: getTranslation(language, 'bento.cards.bitcoin.title'),
      description: getTranslation(language, 'bento.cards.bitcoin.description'),
      Component: EasyDeployment, // mantenido igual
    },
    {
      title: getTranslation(language, 'bento.cards.automation.title'),
      description: getTranslation(
        language,
        'bento.cards.automation.description'
      ),
      Component: WhatsAppAutomation, // Updated component
    },
  ];

  return (
    <section className='w-full px-5 flex flex-col justify-center items-center overflow-visible bg-transparent'>
      <div className='w-full py-8 md:py-16 relative flex flex-col justify-start items-start gap-6'>
        <div className='w-[547px] h-[938px] absolute top-[614px] left-[80px] origin-top-left rotate-[-33.39deg] bg-zatobox-500/10 blur-[130px] z-0' />
        <div className='self-stretch py-8 md:py-14 flex flex-col justify-center items-center gap-2 z-10'>
          <div className='flex flex-col justify-start items-center gap-4'>
            <h2 className='w-full max-w-[655px] text-center text-zatobox-900 text-4xl md:text-6xl font-semibold leading-tight md:leading-[66px]'>
              {getTranslation(language, 'bento.title')}
            </h2>
            <p className='w-full max-w-[600px] text-center text-zatobox-600 text-lg md:text-xl font-medium leading-relaxed'>
              {getTranslation(language, 'bento.subtitle')}
            </p>
          </div>
        </div>
        <div className='self-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10'>
          {cards.map((card) => (
            <BentoCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
