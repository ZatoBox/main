import { HeroSection } from '@/components/landing/hero-section';
import { DashboardPreview } from '@/components/landing/dashboard-preview';
import { SocialProof } from '@/components/landing/social-proof';
import { BentoSection } from '@/components/landing/bento-section';
import { LargeTestimonial } from '@/components/landing/large-testimonial';
import { PricingSection } from '@/components/landing/pricing-section';
import { TestimonialGridSection } from '@/components/landing/testimonial-grid-section';
import { FAQSection } from '@/components/landing/faq-section';
import { CTASection } from '@/components/landing/cta-section';
import { FooterSection } from '@/components/landing/footer-section';
import { AnimatedSection } from '@/components/landing/animated-section';

export default function LandingPage() {
  return (
    <div className='relative min-h-screen pb-0 overflow-hidden bg-background'>
      <div className='relative z-10'>
        <main className='max-w-[1320px] mx-auto relative'>
          <HeroSection />
          {/* Dashboard Preview Wrapper */}
          <div className='absolute bottom-[-150px] md:bottom-[-400px] left-1/2 transform -translate-x-1/2 z-30'>
            <AnimatedSection>
              <DashboardPreview />
            </AnimatedSection>
          </div>
        </main>
        <AnimatedSection
          className='relative z-10 max-w-[1320px] mx-auto px-6 mt-[411px] md:mt-[400px]'
          delay={0.1}
        >
          <SocialProof />
        </AnimatedSection>
        <AnimatedSection
          id='features-section'
          className='relative z-10 max-w-[1320px] mx-auto mt-16'
          delay={0.2}
        >
          <BentoSection />
        </AnimatedSection>
        <AnimatedSection
          className='relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16'
          delay={0.2}
        >
          <LargeTestimonial />
        </AnimatedSection>
        <AnimatedSection
          id='pricing-section'
          className='relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16'
          delay={0.2}
        >
          <PricingSection />
        </AnimatedSection>
        <AnimatedSection
          id='testimonials-section'
          className='relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16'
          delay={0.2}
        >
          <TestimonialGridSection />
        </AnimatedSection>
        <AnimatedSection
          id='faq-section'
          className='relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16'
          delay={0.2}
        >
          <FAQSection />
        </AnimatedSection>
        <AnimatedSection
          className='relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16'
          delay={0.2}
        >
          <CTASection />
        </AnimatedSection>
        <AnimatedSection
          className='relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16'
          delay={0.2}
        >
          <FooterSection />
        </AnimatedSection>
      </div>
    </div>
  );
}
