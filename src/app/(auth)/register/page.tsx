'use client';

import React from 'react';
import RegisterContainer from '@/components/auth/register/RegisterContainer';
import RegisterForm from '@/components/auth/register/RegisterForm';
import { useTranslation } from '@/hooks/use-translation';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="hidden min-h-screen lg:grid lg:grid-cols-5 lg:gap-6">
        <div className="lg:col-span-3 flex items-center justify-center">
          <div
            className="w-full max-w-md p-6 rounded-lg shadow-sm bg-bg-surface"
            style={{ border: '1px solid #e0e0e0' }}
          >
            <RegisterContainer
              title={t('auth.register.title')}
              description={t('auth.register.description')}
              logoSrc="/images/logozato.png"
              logoAlt="ZatoBox Logo"
            >
              <RegisterForm />
            </RegisterContainer>
          </div>
        </div>

        <div className="hidden lg:block lg:col-span-2 lg:h-screen bg-[url('/images/registerbackground.jpg')] bg-cover bg-center" />
      </div>

      <div className="min-h-screen p-4 lg:hidden">
        <div className="flex items-center justify-between p-4 mb-8">
          <div className="flex items-center space-x-2">
            <img
              src="/images/logozato.png"
              alt="ZatoBox Logo"
              className="object-contain w-10"
            />
            <span className="text-xl font-bold text-text-primary">ZatoBox</span>
          </div>
        </div>

        <div className="flex items-center justify-center flex-1">
          <div className="w-full max-w-sm space-y-6">
            <RegisterContainer
              title={t('auth.register.title')}
              description={t('auth.register.description')}
            >
              <RegisterForm />
            </RegisterContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
