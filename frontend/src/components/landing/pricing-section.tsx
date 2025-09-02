'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguageContext } from '@/context/language-context';
import { getTranslation } from '@/utils/translations';

export function PricingSection() {
  const { language } = useLanguageContext();
  const [isAnnual, setIsAnnual] = useState(true);

  const pricingPlans = [
    {
      name: getTranslation(language, 'pricing.plans.tester.name'),
      monthlyPrice: '$0',
      annualPrice: '$0',
      description: getTranslation(language, 'pricing.plans.tester.description'),
      features: getTranslation(language, 'pricing.plans.tester.features'),
      buttonText: getTranslation(language, 'pricing.plans.tester.buttonText'),
      buttonClass:
        'bg-zinc-300 shadow-[0px_1px_1px_-0.5px_rgba(16,24,40,0.20)] outline outline-0.5 outline-[#1e29391f] outline-offset-[-0.5px] text-gray-800 text-shadow-[0px_1px_1px_rgba(16,24,40,0.08)] hover:bg-zinc-400',
    },
    {
      name: getTranslation(language, 'pricing.plans.starter.name'),
      monthlyPrice: '$0',
      annualPrice: '$0',
      description: getTranslation(
        language,
        'pricing.plans.starter.description'
      ),
      features: getTranslation(language, 'pricing.plans.starter.features'),
      buttonText: getTranslation(language, 'pricing.plans.starter.buttonText'),
      buttonClass:
        'bg-primary-foreground shadow-[0px_1px_1px_-0.5px_rgba(16,24,40,0.20)] text-primary text-shadow-[0px_1px_1px_rgba(16,24,40,0.08)] hover:bg-primary-foreground/90',
      popular: true,
    },
    {
      name: getTranslation(language, 'pricing.plans.enterprise.name'),
      monthlyPrice: '$0',
      annualPrice: '$0',
      description: getTranslation(
        language,
        'pricing.plans.enterprise.description'
      ),
      features: getTranslation(language, 'pricing.plans.enterprise.features'),
      buttonText: getTranslation(
        language,
        'pricing.plans.enterprise.buttonText'
      ),
      buttonClass:
        'bg-secondary shadow-[0px_1px_1px_-0.5px_rgba(16,24,40,0.20)] text-secondary-foreground text-shadow-[0px_1px_1px_rgba(16,24,40,0.08)] hover:bg-secondary/90',
    },
  ];

  return (
    <section className='w-full px-5 overflow-hidden flex flex-col justify-start items-center my-0 py-8 md:py-14'>
      <div className='self-stretch relative flex flex-col justify-center items-center gap-2 py-0'>
        <div className='flex flex-col justify-start items-center gap-4'>
          <h2 className='text-center text-zatobox-900 text-4xl md:text-5xl font-semibold leading-tight md:leading-[40px]'>
            {getTranslation(language, 'pricing.title')}
          </h2>
          <p className='self-stretch text-center text-zatobox-600 text-sm font-medium leading-tight'>
            {getTranslation(language, 'pricing.subtitle')}
          </p>
        </div>
        <div className='pt-4'>
          <div className='p-0.5 bg-muted rounded-lg outline-1 outline-[#0307120a] outline-offset-[-1px] flex justify-start items-center gap-1 md:mt-0'>
            <button
              onClick={() => setIsAnnual(true)}
              className={`pl-2 pr-1 py-1 flex justify-start items-start gap-2 rounded-md ${
                isAnnual
                  ? 'bg-accent shadow-[0px_1px_1px_-0.5px_rgba(0,0,0,0.08)]'
                  : ''
              }`}
            >
              <span
                className={`text-center text-sm font-medium leading-tight ${
                  isAnnual ? 'text-zatobox-900' : 'text-zatobox-600'
                }`}
              >
                {getTranslation(language, 'pricing.toggle.annual')}
              </span>
            </button>
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-2 py-1 flex justify-start items-start rounded-md ${
                !isAnnual
                  ? 'bg-accent shadow-[0px_1px_1px_-0.5px_rgba(0,0,0,0.08)]'
                  : ''
              }`}
            >
              <span
                className={`text-center text-sm font-medium leading-tight ${
                  !isAnnual ? 'text-zatobox-900' : 'text-zatobox-600'
                }`}
              >
                {getTranslation(language, 'pricing.toggle.monthly')}
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className='self-stretch px-5 flex flex-col md:flex-row justify-start items-start gap-4 md:gap-6 mt-6 max-w-[1100px] mx-auto'>
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            className={`flex-1 p-4 overflow-hidden rounded-xl flex flex-col justify-start items-start gap-6 h-full min-h-[600px] ${
              plan.popular
                ? 'bg-zatobox-500 shadow-[0px_4px_8px_-2px_rgba(0,0,0,0.10)]'
                : 'bg-zatobox-50'
            }`}
            style={
              plan.popular
                ? {}
                : {
                    outline: '1px solid hsl(var(--border))',
                    outlineOffset: '-1px',
                  }
            }
          >
            <div className='self-stretch flex flex-col justify-between items-start gap-6 h-full'>
              <div className='self-stretch flex flex-col justify-start items-start gap-8'>
                <div
                  className={`w-full h-5 text-sm font-medium leading-tight ${
                    plan.popular ? 'text-primary-foreground' : 'text-foreground'
                  }`}
                >
                  {plan.name}
                  {plan.popular && (
                    <div className='ml-2 px-2 overflow-hidden rounded-full justify-center items-center gap-2.5 inline-flex mt-0 py-0.5 bg-gradient-to-b from-primary-light/50 to-primary-light bg-white'>
                      <div className='text-center text-primary-foreground text-xs font-normal leading-tight break-words'>
                        {getTranslation(language, 'pricing.popular')}
                      </div>
                    </div>
                  )}
                </div>
                <div className='self-stretch flex flex-col justify-start items-start gap-1'>
                  <div className='flex justify-start items-center gap-1.5'>
                    <div
                      className={`relative h-10 flex items-center text-3xl font-medium leading-10 ${
                        plan.popular
                          ? 'text-primary-foreground'
                          : 'text-foreground'
                      }`}
                    >
                      <span className='invisible'>
                        {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      <span
                        className='absolute inset-0 flex items-center transition-all duration-500'
                        style={{
                          opacity: isAnnual ? 1 : 0,
                          transform: `scale(${isAnnual ? 1 : 0.8})`,
                          filter: `blur(${isAnnual ? 0 : 4}px)`,
                        }}
                        aria-hidden={!isAnnual}
                      >
                        {plan.annualPrice}
                      </span>
                      <span
                        className='absolute inset-0 flex items-center transition-all duration-500'
                        style={{
                          opacity: !isAnnual ? 1 : 0,
                          transform: `scale(${!isAnnual ? 1 : 0.8})`,
                          filter: `blur(${!isAnnual ? 0 : 4}px)`,
                        }}
                        aria-hidden={isAnnual}
                      >
                        {plan.monthlyPrice}
                      </span>
                    </div>
                    <div
                      className={`text-center text-sm font-medium leading-tight ${
                        plan.popular
                          ? 'text-primary-foreground/70'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {plan.name ===
                      getTranslation(language, 'pricing.plans.tester.name')
                        ? getTranslation(language, 'pricing.period.tester')
                        : getTranslation(language, 'pricing.period.other')}
                    </div>
                  </div>
                  <div
                    className={`self-stretch text-sm font-medium leading-tight ${
                      plan.popular
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {plan.description}
                  </div>
                </div>
              </div>

              <div className='self-stretch flex flex-col justify-start items-start gap-4'>
                <div
                  className={`self-stretch text-sm font-medium leading-tight ${
                    plan.popular
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground'
                  }`}
                >
                  {plan.name ===
                  getTranslation(language, 'pricing.plans.tester.name')
                    ? getTranslation(language, 'pricing.includes')
                    : plan.name}
                </div>
                <div className='self-stretch flex flex-col justify-start items-start gap-3'>
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className='self-stretch flex justify-start items-center gap-2'
                    >
                      <div className='w-4 h-4 flex items-center justify-center'>
                        <Check
                          className={`w-full h-full ${
                            plan.popular
                              ? 'text-primary-foreground'
                              : 'text-muted-foreground'
                          }`}
                          strokeWidth={2}
                        />
                      </div>
                      <div
                        className={`leading-tight font-normal text-sm text-left ${
                          plan.popular
                            ? 'text-primary-foreground'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {feature}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                className={`self-stretch px-5 py-2 rounded-[40px] flex justify-center items-center ${plan.buttonClass}`}
              >
                <div className='px-1.5 flex justify-center items-center gap-2'>
                  <span
                    className={`text-center text-sm font-medium leading-tight ${
                      plan.name ===
                      getTranslation(language, 'pricing.plans.tester.name')
                        ? 'text-gray-800'
                        : plan.name ===
                          getTranslation(language, 'pricing.plans.starter.name')
                        ? 'text-primary'
                        : 'text-zinc-950'
                    }`}
                  >
                    {plan.buttonText}
                  </span>
                </div>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
