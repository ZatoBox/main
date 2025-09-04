'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/landing/ui/sheet';
import { Menu } from 'lucide-react';
import Link from 'next/link'; // Import Link for client-side navigation
import { useLanguageContext } from '@/context/language-context';
import { getTranslation } from '@/utils/translations';
import { LanguageSwitcher } from './language-switcher';

export function Header() {
  const { language } = useLanguageContext();

  const navItems = [
    {
      name: getTranslation(language, 'nav.features'),
      href: '#features-section',
    },
    { name: getTranslation(language, 'nav.pricing'), href: '#pricing-section' },
    {
      name: getTranslation(language, 'nav.testimonials'),
      href: '#testimonials-section',
    },
  ];

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const targetId = href.substring(1); // Remove '#' from href
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className='bg-white w-full py-4 px-6'>
      <div className='max-w-7xl mx-auto flex items-center justify-between'>
        <div className='flex items-center gap-6'>
          <div className='flex items-center gap-3'>
            <img
              src='/logo.png'
              alt={getTranslation(language, 'accessibility.altTexts.logo')}
              className='h-8 w-auto'
            />
          </div>
          <nav className='hidden md:flex items-center gap-2'>
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleScroll(e, item.href)} // Add onClick handler
                className='text-black px-4 py-2 rounded-full font-medium'
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className='flex items-center gap-4'>
          <LanguageSwitcher />
          <Link
            href='https://forms.gle/qdmr2Y1EVLi5NLLn8'
            target='_blank'
            rel='noopener noreferrer'
            className='hidden md:block'
          >
            <Button className='bg-zatobox-500 text-white hover:opacity-90 px-6 py-2 rounded-full font-medium shadow-sm'>
              {getTranslation(language, 'nav.tryFree')}
            </Button>
          </Link>
          <Sheet>
            <SheetTrigger asChild className='md:hidden'>
              <Button variant='ghost' size='icon' className='text-foreground'>
                <Menu className='h-7 w-7' />
                <span className='sr-only'>
                  {getTranslation(
                    language,
                    'accessibility.ariaLabels.toggleNav'
                  )}
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side='bottom'
              className='bg-white border-t border-border text-zatobox-900'
            >
              <SheetHeader>
                <SheetTitle className='text-left text-xl font-semibold text-zatobox-900'>
                  {getTranslation(language, 'nav.navigation')}
                </SheetTitle>
              </SheetHeader>
              <nav className='flex flex-col gap-4 mt-6'>
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleScroll(e, item.href)} // Add onClick handler
                    className='text-black justify-start text-lg py-2'
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  href='https://forms.gle/qdmr2Y1EVLi5NLLn8'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-full mt-4'
                >
                  <Button className='bg-zatobox-500 text-white hover:opacity-90 px-6 py-2 rounded-full font-medium shadow-sm'>
                    {getTranslation(language, 'nav.tryFree')}
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
