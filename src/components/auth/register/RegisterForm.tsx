'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/context/auth-store';
import { useTranslation } from '@/hooks/use-translation';

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    full_name: Yup.string().required(t('auth.validation.fullNameRequired')),
    email: Yup.string()
      .email(t('auth.validation.invalidEmail'))
      .required(t('auth.validation.emailRequired')),
    password: Yup.string()
      .min(8, t('auth.validation.passwordMin'))
      .required(t('auth.validation.passwordRequired')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], t('auth.validation.passwordsMustMatch'))
      .required(t('auth.validation.confirmPassword')),
    phone: Yup.string().notRequired(),
    acceptTerms: Yup.boolean().oneOf([true], t('auth.validation.acceptTerms')),
  });

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    setError('');
    try {
      const payload = {
        full_name: values.full_name,
        email: values.email,
        password: values.password,
        phone: values.phone,
      };

      await registerUser(payload as any);
      router.push('/upgrade');
    } catch (e: any) {
      console.error('[RegisterForm] error', e);
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        e?.message ||
        'Error registering user';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{
        full_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        acceptTerms: false,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className="space-y-4">
        <div>
          <Field
            name="full_name"
            placeholder={t('auth.register.fullNamePlaceholder')}
            className="w-full px-4 transition-all duration-150 ease-in-out border rounded h-11 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 hover:shadow-sm"
            style={{
              color: 'black',
              backgroundColor: 'white',
              borderColor: '#e0e0e0',
            }}
          />
          <div className="mt-1 text-sm" style={{ color: 'black' }}>
            <ErrorMessage name="full_name" />
          </div>
        </div>

        <div>
          <Field
            name="email"
            type="email"
            placeholder={t('auth.register.emailPlaceholder')}
            className="w-full px-4 transition-all duration-150 ease-in-out border rounded h-11 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 hover:shadow-sm"
            style={{
              color: 'black',
              backgroundColor: 'white',
              borderColor: '#e0e0e0',
            }}
          />
          <div className="mt-1 text-sm" style={{ color: 'black' }}>
            <ErrorMessage name="email" />
          </div>
        </div>

        <div className="relative flex items-center">
          <Field
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={t('auth.register.passwordPlaceholder')}
            className="w-full px-4 pr-12 transition-all duration-150 ease-in-out border rounded h-11 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 hover:shadow-sm"
            style={{
              color: 'black',
              backgroundColor: 'white',
              borderColor: '#e0e0e0',
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center hover:shadow-sm"
            style={{ height: '44px' }}
          >
            {showPassword ? (
              <EyeOff size={20} color="#CC6E13" />
            ) : (
              <Eye size={20} color="#CC6E13" />
            )}
          </button>
        </div>
        <div className="mt-1 text-sm" style={{ color: 'black' }}>
          <ErrorMessage name="password" />
        </div>

        <div className="relative flex items-center">
          <Field
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder={t('auth.register.confirmPasswordPlaceholder')}
            className="w-full px-4 pr-12 transition-all duration-150 ease-in-out border rounded h-11 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 hover:shadow-sm"
            style={{
              color: 'black',
              backgroundColor: 'white',
              borderColor: '#e0e0e0',
            }}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center hover:shadow-sm"
            style={{ height: '44px' }}
          >
            {showConfirmPassword ? (
              <EyeOff size={20} color="#CC6E13" />
            ) : (
              <Eye size={20} color="#CC6E13" />
            )}
          </button>
        </div>
        <div className="mt-1 text-sm" style={{ color: 'black' }}>
          <ErrorMessage name="confirmPassword" />
        </div>

        <div>
          <Field
            name="phone"
            placeholder={t('auth.register.phonePlaceholder')}
            className="w-full px-4 transition-all duration-150 ease-in-out border rounded h-11 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 hover:shadow-sm"
            style={{
              color: 'black',
              backgroundColor: 'white',
              borderColor: '#e0e0e0',
            }}
          />
          <div className="mt-1 text-sm" style={{ color: 'black' }}>
            <ErrorMessage name="phone" />
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Field
            name="acceptTerms"
            type="checkbox"
            className="w-4 h-4 mt-1 border-gray-300 rounded focus:ring-zatobox-500"
            style={{ color: 'black' }}
          />
          <label
            htmlFor="acceptTerms"
            className="text-sm"
            style={{ color: 'black' }}
          >
            {t('auth.register.agreeToTerms')}{' '}
            <button
              type="button"
              className="font-medium transition-colors"
              style={{ color: 'black' }}
            >
              {t('auth.register.termsAndConditions')}
            </button>{' '}
            {t('auth.register.and')}{' '}
            <button
              type="button"
              className="font-medium transition-colors"
              style={{ color: 'black' }}
            >
              {t('auth.register.privacyPolicy')}
            </button>
          </label>
        </div>

        {error && (
          <div
            className="p-3 text-sm border rounded-lg bg-red-50 border-red-200"
            style={{ color: 'black' }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full font-medium text-white transition-all duration-150 ease-in-out rounded-lg h-11 bg-zatobox-500 hover:bg-zatobox-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? t('auth.register.creatingAccount')
            : t('auth.register.createAccount')}
        </button>
        <div className="mt-4 text-center">
          <p className="text-[#888888]">
            {t('auth.register.alreadyHaveAccount')}{' '}
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="font-medium transition-colors text-black hover:text-zatobox-600"
            >
              {t('auth.register.signIn')}
            </button>
          </p>
        </div>
      </Form>
    </Formik>
  );
};

export default RegisterForm;
