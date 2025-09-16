'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguageContext } from '@/context/language-context';
import { getTranslation } from '@/utils/translations';
import { useAuth } from '@/context/auth-store';
import { createCheckout } from '@/services/payments-service';

export function PricingSectionCompact() {
  const { language } = useLanguageContext();
  const [isAnnual, setIsAnnual] = useState(true);
  const { user } = useAuth();

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
      monthlyPrice: '$30',
      annualPrice: '$200',
      description: getTranslation(
        language,
        'pricing.plans.starter.description'
      ),
      features: getTranslation(language, 'pricing.plans.starter.features'),
      buttonText: getTranslation(language, 'pricing.plans.starter.buttonText'),
      buttonClass:
        'bg-white shadow-[0px_1px_1px_-0.5px_rgba(16,24,40,0.20)] text-orange-500 text-shadow-[0px_1px_1px_rgba(16,24,40,0.08)] hover:bg-white/90',
      popular: true,
    },
    {
      name: getTranslation(language, 'pricing.plans.enterprise.name'),
      monthlyPrice: '',
      annualPrice: '',
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
        'bg-[#F2F2F2] shadow-[0px_1px_1px_-0.5px_rgba(16,24,40,0.20)] text-black text-shadow-[0px_1px_1px_rgba(16,24,40,0.08)] hover:bg-[#F2F2F2]/90',
    },
  ];

  const handleSubscribe = async () => {
    try {
      const userId = user?.id;
      const cycle = isAnnual ? 'annual' : 'monthly';
      const plan = 'starter';
      const res = await createCheckout(userId || '', plan, cycle);
      if (res?.url) {
        window.location.href = res.url;
      }
    } catch {}
  };

  return (
    <section className='flex flex-col items-center justify-start w-full px-5 py-8 my-0 overflow-hidden md:py-14'>
      <h1 className='mt-2 text-3xl font-bold mb-2'>Upgrade Plan</h1>
      <div className='relative flex flex-col items-center self-stretch justify-center gap-2 py-0'>
        <div className='flex flex-col items-center justify-start gap-4'>
          <div className='pt-4'>
            <div className='p-0.5 bg-muted rounded-lg outline-1 outline-[#0307120a] outline-offset-[-1px] flex justify-start items-center gap-1 md:mt-0'>
              <button
                onClick={() => setIsAnnual(true)}
                className={`pl-2 pr-1 py-1 flex justify-start items-start gap-2 rounded-md ${
                  isAnnual
                    ? 'bg-[#F2F2F2] shadow-[0px_1px_1px_-0.5px_rgba(0,0,0,0.08)]'
                    : ''
                }`}
              >
                <span
                  className={`text-center text-sm font-medium leading-tight ${
                    isAnnual ? 'text-black' : 'text-[#404040]'
                  }`}
                >
                  {getTranslation(language, 'pricing.toggle.annual')}
                </span>
              </button>
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-2 py-1 flex justify-start items-start rounded-md ${
                  !isAnnual
                    ? 'bg-[#F2F2F2] shadow-[0px_1px_1px_-0.5px_rgba(0,0,0,0.08)]'
                    : ''
                }`}
              >
                <span
                  className={`text-center text-sm font-medium leading-tight ${
                    !isAnnual ? 'text-black' : 'text-[#404040]'
                  }`}
                >
                  {getTranslation(language, 'pricing.toggle.monthly')}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='self-stretch px-5 flex flex-col md:flex-row justify-start items-start gap-4 md:gap-6 mt-6 max-w-[1100px] mx-auto'>
        {pricingPlans.map((plan) => {
          const parseNumber = (s: string) => {
            const n = Number(String(s).replace(/[^0-9.]/g, ''));
            return Number.isFinite(n) ? n : 0;
          };
          const monthlyFromAnnual = plan.annualPrice
            ? `$${Math.floor(parseNumber(plan.annualPrice) / 12)}`
            : plan.monthlyPrice;
          const displayMainPrice =
            isAnnual && plan.annualPrice ? plan.annualPrice : plan.monthlyPrice;
          const displaySecondaryPrice =
            isAnnual && plan.annualPrice
              ? `${Math.floor(parseNumber(plan.annualPrice) / 12)}/mes`
              : '';
          return (
            <div
              key={plan.name}
              className={`flex-1 p-4 overflow-hidden rounded-xl flex flex-col justify-start items-start gap-6 h-full min-h-[600px] ${
                plan.popular
                  ? 'bg-[#FF9D14] shadow-[0px_4px_8px_-2px_rgba(0,0,0,0.10)]'
                  : 'bg-transparent'
              }`}
              style={
                plan.popular
                  ? {}
                  : {
                      outline: '1px solid rgba(128, 128, 128, 0.12)',
                      outlineOffset: '-1px',
                    }
              }
            >
              <div className='flex flex-col items-start self-stretch justify-between h-full gap-6'>
                <div className='flex flex-col items-start self-stretch justify-start gap-8'>
                  <div
                    className={`w-full h-5 text-sm font-medium leading-tight ${
                      plan.popular ? 'text-white' : 'text-black'
                    }`}
                  >
                    {plan.name}
                    {plan.popular && (
                      <div className='ml-2 px-2 overflow-hidden rounded-full justify-center items-center gap-2.5 inline-flex mt-0 py-0.5 bg-gradient-to-b from-white/30 to-[#FFC44D]'>
                        <div className='text-xs font-normal leading-tight text-center break-words text-white'>
                          {getTranslation(language, 'pricing.popular')}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className='flex flex-col items-start self-stretch justify-start gap-1'>
                    {(plan.monthlyPrice || plan.annualPrice) && (
                      <div className='flex justify-start items-center gap-1.5'>
                        <div className='flex flex-col items-start'>
                          <div
                            className={`relative h-10 flex items-center text-3xl font-medium leading-10 ${
                              plan.popular ? 'text-white' : 'text-black'
                            }`}
                          >
                            <span className='invisible'>
                              {displayMainPrice}
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
                              {displayMainPrice}
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
                          {displaySecondaryPrice ? (
                            <div
                              className={`text-sm mt-1 ${
                                plan.popular ? 'text-white/70' : 'text-black/70'
                              }`}
                            >
                              {displaySecondaryPrice}
                            </div>
                          ) : null}
                        </div>
                        {!isAnnual && (
                          <div
                            className={`text-center text-sm font-medium leading-tight ${
                              plan.popular ? 'text-white' : 'text-black'
                            }`}
                          >
                            {plan.name ===
                            getTranslation(
                              language,
                              'pricing.plans.tester.name'
                            )
                              ? getTranslation(
                                  language,
                                  'pricing.period.tester'
                                )
                              : getTranslation(
                                  language,
                                  'pricing.period.other'
                                )}
                          </div>
                        )}
                      </div>
                    )}
                    <div
                      className={`self-stretch text-sm font-medium leading-tight ${
                        plan.popular ? 'text-white/70' : 'text-black/70'
                      }`}
                    >
                      {plan.description}
                    </div>
                  </div>
                </div>

                <div className='flex flex-col items-start self-stretch justify-start gap-4'>
                  <div
                    className={`self-stretch text-sm font-medium leading-tight ${
                      plan.popular ? 'text-white/70' : 'text-black/70'
                    }`}
                  >
                    {plan.name ===
                    getTranslation(language, 'pricing.plans.tester.name')
                      ? getTranslation(language, 'pricing.includes')
                      : plan.name}
                  </div>
                  <div className='flex flex-col items-start self-stretch justify-start gap-3'>
                    {plan.features.map((feature: string) => (
                      <div
                        key={feature}
                        className='flex items-center self-stretch justify-start gap-2'
                      >
                        <div className='flex items-center justify-center w-4 h-4'>
                          <Check
                            className={`w-full h-full ${
                              plan.popular ? 'text-white' : 'text-black'
                            }`}
                            strokeWidth={2}
                          />
                        </div>
                        <div
                          className={`leading-tight font-normal text-sm text-left ${
                            plan.popular ? 'text-white' : 'text-black'
                          }`}
                        >
                          {feature}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {plan.name ===
                getTranslation(language, 'pricing.plans.starter.name') ? (
                  <Button
                    onClick={handleSubscribe}
                    className={`self-stretch px-5 py-2 rounded-[40px] flex justify-center items-center ${plan.buttonClass}`}
                  >
                    <div className='px-1.5 flex justify-center items-center gap-2'>
                      <span
                        className={`text-center text-sm font-medium leading-tight ${
                          plan.name ===
                          getTranslation(language, 'pricing.plans.tester.name')
                            ? 'text-gray-800'
                            : plan.name ===
                              getTranslation(
                                language,
                                'pricing.plans.starter.name'
                              )
                            ? 'text-orange-500'
                            : 'text-black'
                        }`}
                      >
                        {plan.buttonText}
                      </span>
                    </div>
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubscribe}
                    className={`self-stretch px-5 py-2 rounded-[40px] flex justify-center items-center ${plan.buttonClass}`}
                  >
                    <div className='px-1.5 flex justify-center items-center gap-2'>
                      <span
                        className={`text-center text-sm font-medium leading-tight ${
                          plan.name ===
                          getTranslation(language, 'pricing.plans.tester.name')
                            ? 'text-gray-800'
                            : plan.name ===
                              getTranslation(
                                language,
                                'pricing.plans.starter.name'
                              )
                            ? 'text-orange-500'
                            : 'text-black'
                        }`}
                      >
                        {plan.buttonText}
                      </span>
                    </div>
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
