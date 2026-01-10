'use client';

import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

const Transparency = () => {
  const { t } = useTranslation();

  const faqs = [
    { question: t('faq.q1'), answer: t('faq.a1') },
    { question: t('faq.q2'), answer: t('faq.a2') },
    { question: t('faq.q3'), answer: t('faq.a3') },
    { question: t('faq.q4'), answer: t('faq.a4') },
    { question: t('faq.q5'), answer: t('faq.a5') },
    { question: t('faq.q6'), answer: t('faq.a6') },
  ];

  return (
    <section className="px-6 md:px-12 py-16">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
          {t('faq.title')}
        </h2>
        <p className="text-muted-foreground text-center mb-10">
          {t('faq.description')}
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group border border-border rounded-lg"
            >
              <summary className="flex cursor-pointer items-center justify-between p-4 text-foreground font-medium hover:bg-muted/50 transition-colors">
                {faq.question}
                <svg
                  className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="px-4 pb-4 text-muted-foreground">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Transparency;
