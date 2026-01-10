'use client';

import LandingHeader from './Header';
import Hero from './sections/Hero';
import WhatIsZatoBox from './sections/WhatIsZatoBox';
import Problem from './sections/Problem';
import ProductOverview from './sections/ProductOverview';
import HowItWorks from './sections/HowItWorks';
import WhyZatoBox from './sections/WhyZatoBox';
import Transparency from './sections/Transparency';
import FinalCTA from './sections/FinalCTA';
import Footer from './sections/Footer';

const NewLandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <Hero />
        <WhatIsZatoBox />
        <Problem />
        <ProductOverview />
        <HowItWorks />
        <WhyZatoBox />
        <Transparency />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default NewLandingPage;
