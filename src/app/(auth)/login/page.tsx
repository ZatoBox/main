'use client';

import React from 'react';
import LoginContainer from '@/components/auth/login/LoginContainer';
import LoginForm from '@/components/auth/login/LoginForm';
import { useTranslation } from '@/hooks/use-translation';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="hidden min-h-screen lg:grid lg:grid-cols-2 lg:gap-6 lg:p-6">
        <div className="flex items-center justify-center">
          <LoginContainer
            title={t('auth.login.title')}
            description={t('auth.login.description')}
            logoSrc="/images/logozato.png"
            logoAlt="ZatoBox Logo"
          >
            <LoginForm />
          </LoginContainer>
        </div>

        <div className="hidden lg:flex lg:items-center lg:justify-center lg:p-8 bg-[url('/images/zatobackground.svg')] bg-cover bg-center">
          <div className="text-center text-white">
            <div className="mb-6">
              <img
                src="/images/logozato.png"
                alt="ZatoBox Logo"
                className="object-contain w-40 mx-auto"
              />
            </div>
            <h2 className="text-black mb-4 text-3xl font-bold">
              {t('auth.login.welcomeTitle')}
            </h2>
            <p className="text-black text-lg leading-relaxed opacity-90">
              {t('auth.login.welcomeDescription')}
              <br />
              {t('auth.login.welcomeSubtext')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col min-h-screen lg:hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <img
              src="/images/logozato.png"
              alt="ZatoBox Logo"
              className="object-contain w-10"
            />
            <span className="text-xl font-bold text-text-primary">ZatoBox</span>
          </div>
        </div>

        <div className="flex items-center justify-center flex-1 p-6">
          <div className="w-full max-w-sm space-y-6">
            <div className="text-center">
              <h1 className="mb-2 text-2xl font-bold text-text-primary">
                {t('auth.login.title')}
              </h1>
              <p className="text-text-secondary">
                {t('auth.login.mobileDescription')}
              </p>
            </div>

            <LoginForm />

            <div className="relative mt-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-divider"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-bg-main text-text-secondary">
                  {t('auth.login.orContinueWith')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
