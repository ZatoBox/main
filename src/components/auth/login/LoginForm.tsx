'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/context/auth-store';
import SocialButtons from './SocialButtons';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login, loading, error: authError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values: {
    email: string;
    password: string;
    remember: boolean;
  }) => {
    setError('');
    try {
      await login(values.email, values.password);
      router.push('/home');
    } catch (err: any) {
      setError(err?.message || 'Error logging in');
    }
  };

  return (
    <>
      <Formik
        initialValues={{ email: '', password: '', remember: true }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="space-y-4">
          <div>
            <Field
              name="email"
              type="email"
              placeholder="Example@email.com"
              className="w-full h-12 px-4 transition-all duration-150 ease-in-out border rounded border-[#CBD5E1] focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-white text-black placeholder-[#888888] hover:shadow-sm"
            />
            <div className="mt-1 text-sm text-error-700">
              <ErrorMessage name="email" />
            </div>
          </div>

          <div className="relative">
            <Field
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="at least 8 characters"
              className="w-full h-12 px-4 transition-all duration-150 ease-in-out border rounded border-[#CBD5E1] focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-white text-black placeholder-[#888888] hover:shadow-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute transition-colors transform -translate-y-1/2 right-3 top-1/2 text-zatobox-600 hover:text-zatobox-900"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <div className="mt-1 text-sm text-error-700">
              <ErrorMessage name="password" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm cursor-pointer select-none text-[#888888]">
              <Field
                type="checkbox"
                name="remember"
                className="w-4 h-4 border-gray-300 rounded text-black focus:ring-zatobox-500"
              />
              <span>Recordarme</span>
            </label>
            <button
              type="button"
              className="text-sm transition-colors text-zatobox-500 hover:text-zatobox-600"
            >
              Olvidaste tu contraseña?
            </button>
          </div>

          {(error || authError) && (
            <div className="p-3 text-sm border rounded-lg bg-red-50 border-red-200 text-red-700">
              {/Acceso restringido/i.test(error || authError || '') ||
              /HTTP error 403/i.test(error || authError || '') ? (
                <>
                  Acceso restringido. Requiere plan Premium. Ve a{' '}
                  <button
                    type="button"
                    onClick={() => router.push('/upgrade')}
                    className="underline font-medium text-red-700 hover:text-red-800"
                  >
                    mejorar
                  </button>{' '}
                  para mejorar tu plan.
                </>
              ) : (
                <>{error || authError}</>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 font-medium text-white transition-all duration-150 ease-in-out rounded-lg bg-zatobox-500 hover:bg-zatobox-600 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </Form>
      </Formik>

      <div className="relative mt-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#CBD5E1]"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-black">O continuar con</span>
        </div>
      </div>

      <SocialButtons />

      <div className="mt-4 text-center">
        <p className="text-[#888888]">
          No tienes una cuenta?{' '}
          <button
            onClick={() => router.push('/register')}
            className="font-medium transition-colors text-black hover:text-zatobox-600"
          >
            Regístrate
          </button>
        </p>
      </div>
    </>
  );
};

export default LoginForm;
