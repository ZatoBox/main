'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import {
  Package,
  ShoppingCart,
  Users,
  Lightbulb,
  Star,
  CheckCircle,
} from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import ScrollLink from '../ScrollLink';
import '@/lib/i18n';

const Problem = () => {
  const { t } = useTranslation();
  const { ref: sectionRef, isVisible } = useScrollAnimation({
    threshold: 0.1,
  });

  return (
    <section className="px-6 md:px-12 py-24">
      <div className="max-w-6xl mx-auto">
        <div
          ref={sectionRef}
          className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex-shrink-0">
            <Image
              src="/landing/doodle-paper-plane.png"
              alt="Paper plane illustration"
              className="h-64 md:h-80 w-auto object-contain"
              width={320}
              height={320}
            />
          </div>

          <div className="flex-1">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-4">
              {t('problem.openLetter')}
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center md:text-left mb-4">
              {t('problem.heyOwner')}
            </h2>

            <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center md:text-left mb-8">
              {t('problem.growTitle')}
            </h3>

            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>{t('problem.intro')}</p>
              <p>
                {t('problem.question')}{' '}
                <strong className="text-foreground">
                  {t('problem.questionBold')}
                </strong>
              </p>
              <p>{t('problem.truth')}</p>
              <p>{t('problem.noVisibility')}</p>
              <p>
                {t('problem.solution')}{' '}
                <Link
                  href="#"
                  className="underline hover:text-foreground transition-colors"
                >
                  {t('problem.pointOfSale')}
                </Link>
                {t('problem.your')}{' '}
                <Link
                  href="#"
                  className="underline hover:text-foreground transition-colors"
                >
                  {t('problem.inventoryControl')}
                </Link>
                {t('problem.solutionEnd')}
              </p>
              <p className="font-medium text-foreground">
                {t('problem.zatoboxHelps')}{' '}
                <ScrollLink
                  to="#features"
                  className="underline hover:text-foreground/80 transition-colors"
                >
                  ZatoBox
                </ScrollLink>{' '}
                {t('problem.helps')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6 mb-20 flex-wrap">
          <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
            <Package className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
            <Star className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mb-8">
          <p className="text-sm text-muted-foreground uppercase tracking-wider italic font-serif">
            {t('problem.hearItOut')}
          </p>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
          {t('problem.whyVisibility')}
        </h2>

        <p className="text-center text-muted-foreground text-lg mb-12">
          {t('problem.whyVisibilityDesc')}
        </p>

        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="grid md:grid-cols-2 gap-8 flex-1">
            <div>
              <h3 className="font-bold text-foreground text-lg mb-2">
                {t('problem.compass')}
              </h3>
              <p className="text-muted-foreground">
                {t('problem.compassDesc')}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground text-lg mb-2">
                {t('problem.losses')}
              </h3>
              <p className="text-muted-foreground">{t('problem.lossesDesc')}</p>
            </div>

            <div>
              <h3 className="font-bold text-foreground text-lg mb-2">
                {t('problem.decisions')}
              </h3>
              <p className="text-muted-foreground">
                {t('problem.decisionsDesc')}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground text-lg mb-2">
                {t('problem.success')}
              </h3>
              <p className="text-muted-foreground">
                {t('problem.successDesc')}
              </p>
            </div>
          </div>

          <div className="flex-shrink-0">
            <Image
              src="/landing/doodle-zato-coach.png"
              alt="Zato coach illustration"
              className="h-64 md:h-80 w-auto object-contain"
              width={320}
              height={320}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
