'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authAPI } from '@/services/api.service';
import { useAuth } from '@/context/auth-store';

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
  const { register: registerUser } = useAuth();
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
      <Form className='space-y-4'>
        <div>
          <Field
            name='full_name'
            placeholder='Your full name'
            className='w-full px-4 transition-all duration-150 ease-in-out border rounded h-11 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 hover:shadow-sm'
            style={{
              color: 'black',
              backgroundColor: 'white',
              borderColor: '#e0e0e0',
            }}
          />
          <div className='mt-1 text-sm' style={{ color: 'black' }}>
            <ErrorMessage name='full_name' />
          </div>
        </div>

        <div>
          <Field
            name='email'
            type='email'
            placeholder='example@email.com'
            className='w-full px-4 transition-all duration-150 ease-in-out border rounded h-11 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 hover:shadow-sm'
            style={{
              color: 'black',
              backgroundColor: 'white',
              borderColor: '#e0e0e0',
            }}
          />
          <div className='mt-1 text-sm' style={{ color: 'black' }}>
            <ErrorMessage name='email' />
          </div>
        </div>

        <div className='relative flex items-center'>
          <Field
            name='password'
            type={showPassword ? 'text' : 'password'}
            placeholder='at least 8 characters'
            className='w-full px-4 pr-12 transition-all duration-150 ease-in-out border rounded h-11 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 hover:shadow-sm'
            style={{
              color: 'black',
              backgroundColor: 'white',
              borderColor: '#e0e0e0',
            }}
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center hover:shadow-sm'
            style={{ height: '44px' }}
          >
            {showPassword ? (
              <EyeOff size={20} color='#CC6E13' />
            ) : (
              <Eye size={20} color='#CC6E13' />
            )}
          </button>
        </div>
        <div className='mt-1 text-sm' style={{ color: 'black' }}>
          <ErrorMessage name='password' />
        </div>

        <div className='relative flex items-center'>
          <Field
            name='confirmPassword'
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder='confirm your password'
            className='w-full px-4 pr-12 transition-all duration-150 ease-in-out border rounded h-11 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 hover:shadow-sm'
            style={{
              color: 'black',
              backgroundColor: 'white',
              borderColor: '#e0e0e0',
            }}
          />
          <button
            type='button'
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center hover:shadow-sm'
            style={{ height: '44px' }}
          >
            {showConfirmPassword ? (
              <EyeOff size={20} color='#CC6E13' />
            ) : (
              <Eye size={20} color='#CC6E13' />
            )}
          </button>
        </div>
        <div className='mt-1 text-sm' style={{ color: 'black' }}>
          <ErrorMessage name='confirmPassword' />
        </div>

        <div>
          <Field
            name='phone'
            placeholder='phone number (optional)'
            className='w-full px-4 transition-all duration-150 ease-in-out border rounded h-11 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 hover:shadow-sm'
            style={{
              color: 'black',
              backgroundColor: 'white',
              borderColor: '#e0e0e0',
            }}
          />
          <div className='mt-1 text-sm' style={{ color: 'black' }}>
            <ErrorMessage name='phone' />
          </div>
        </div>

        <div className='flex items-start space-x-3'>
          <Field
            name='acceptTerms'
            type='checkbox'
            className='w-4 h-4 mt-1 border-gray-300 rounded focus:ring-zatobox-500'
            style={{ color: 'black' }}
          />
          <label
            htmlFor='acceptTerms'
            className='text-sm'
            style={{ color: 'black' }}
          >
            I agree to the{' '}
            <button
              type='button'
              className='font-medium transition-colors'
              style={{ color: 'black' }}
            >
              Terms and Conditions
            </button>{' '}
            and{' '}
            <button
              type='button'
              className='font-medium transition-colors'
              style={{ color: 'black' }}
            >
              Privacy Policy
            </button>
          </label>
        </div>

        {error && (
          <div
            className='p-3 text-sm border rounded-lg bg-red-50 border-red-200'
            style={{ color: 'black' }}
          >
            {error}
          </div>
        )}

        <button
          type='submit'
          disabled={isLoading}
          className='w-full font-medium text-white transition-all duration-150 ease-in-out rounded-lg h-11 bg-zatobox-500 hover:bg-zatobox-600 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
        <div className='mt-4 text-center'>
          <p className='text-[#888888]'>
            ¿Ya tienes cuenta?{' '}
            <button
              type='button'
              onClick={() => router.push('/login')}
              className='font-medium transition-colors text-black hover:text-zatobox-600'
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </Form>
    </Formik>
  );
};

export default RegisterForm;
