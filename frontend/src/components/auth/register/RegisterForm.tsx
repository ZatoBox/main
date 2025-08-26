'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authAPI } from '@/services/api.service';

const validationSchema = Yup.object().shape({
  full_name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  phone: Yup.string().notRequired(),
  acceptTerms: Yup.boolean().oneOf(
    [true],
    'You must accept the Terms and Conditions'
  ),
});

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

      console.log('[RegisterForm] payload', payload);
      const res = await authAPI.register(payload as any);
      console.log('[RegisterForm] success', res);

      router.push('/');
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
      <Form className='space-y-4'>
        <div>
          <Field
            name='full_name'
            placeholder='Your full name'
            className='w-full px-4 transition-all duration-150 ease-in-out border rounded h-11 border-divider focus:ring-2 focus:ring-primary focus:border-transparent bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm'
          />
          <div className='mt-1 text-sm text-error-700'>
            <ErrorMessage name='full_name' />
          </div>
        </div>

        <div>
          <Field
            name='email'
            type='email'
            placeholder='example@email.com'
            className='w-full px-4 transition-all duration-150 ease-in-out border rounded h-11 border-divider focus:ring-2 focus:ring-primary focus:border-transparent bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm'
          />
          <div className='mt-1 text-sm text-error-700'>
            <ErrorMessage name='email' />
          </div>
        </div>

        <div className='relative'>
          <Field
            name='password'
            type={showPassword ? 'text' : 'password'}
            placeholder='at least 8 characters'
            className='w-full px-4 pr-12 transition-all duration-150 ease-in-out border rounded h-11 border-divider focus:ring-2 focus:ring-primary focus:border-transparent bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm'
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute transition-colors transform -translate-y-1/2 right-3 top-1/2 text-text-secondary hover:text-text-primary'
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          <div className='mt-1 text-sm text-error-700'>
            <ErrorMessage name='password' />
          </div>
        </div>

        <div className='relative'>
          <Field
            name='confirmPassword'
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder='confirm your password'
            className='w-full px-4 pr-12 transition-all duration-150 ease-in-out border rounded h-11 border-divider focus:ring-2 focus:ring-primary focus:border-transparent bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm'
          />
          <button
            type='button'
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className='absolute transition-colors transform -translate-y-1/2 right-3 top-1/2 text-text-secondary hover:text-text-primary'
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          <div className='mt-1 text-sm text-error-700'>
            <ErrorMessage name='confirmPassword' />
          </div>
        </div>

        <div>
          <Field
            name='phone'
            placeholder='phone number (optional)'
            className='w-full px-4 transition-all duration-150 ease-in-out border rounded h-11 border-divider focus:ring-2 focus:ring-primary focus:border-transparent bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm'
          />
          <div className='mt-1 text-sm text-error-700'>
            <ErrorMessage name='phone' />
          </div>
        </div>

        <div className='flex items-start space-x-3'>
          <Field
            name='acceptTerms'
            type='checkbox'
            className='w-4 h-4 mt-1 border-gray-300 rounded text-complement focus:ring-complement'
          />
          <label htmlFor='acceptTerms' className='text-sm text-text-secondary'>
            I agree to the{' '}
            <button
              type='button'
              className='font-medium transition-colors text-complement hover:text-complement-600'
            >
              Terms and Conditions
            </button>{' '}
            and{' '}
            <button
              type='button'
              className='font-medium transition-colors text-complement hover:text-complement-600'
            >
              Privacy Policy
            </button>
          </label>
        </div>

        {error && (
          <div className='p-3 text-sm border rounded-lg bg-error-50 border-error-200 text-error-700'>
            {error}
          </div>
        )}

        <button
          type='submit'
          disabled={isLoading}
          className='w-full font-medium text-black transition-all duration-150 ease-in-out rounded-lg h-11 bg-primary hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </Form>
    </Formik>
  );
};

export default RegisterForm;
