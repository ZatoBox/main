'use client';

import { usePathname, useRouter } from 'next/navigation';

interface ScrollLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const ScrollLink = ({ to, children, className }: ScrollLinkProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (to.startsWith('#')) {
      const elementId = to.substring(1);
      const element = document.getElementById(elementId);

      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (to.startsWith('/#')) {
      const elementId = to.substring(2);

      if (pathname === '/') {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        router.push('/');
        setTimeout(() => {
          const element = document.getElementById(elementId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else {
      router.push(to);
    }
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

export default ScrollLink;
