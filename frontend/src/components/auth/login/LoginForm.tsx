import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
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
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    setError('');
    try {
      await login(values.email, values.password);
      navigate('/products');
    } catch (err: any) {
      setError(err?.message || 'Error logging in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className='space-y-4'>
          <div>
            <Field
              name='email'
              type='email'
              placeholder='Example@email.com'
              className='w-full h-12 px-4 transition-all duration-150 ease-in-out border rounded border-divider focus:ring-2 focus:ring-primary focus:border-transparent bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm'
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
              className='w-full h-12 px-4 pr-12 transition-all duration-150 ease-in-out border rounded border-divider focus:ring-2 focus:ring-primary focus:border-transparent bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm'
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

          <div className='text-right'>
            <button
              type='button'
              className='text-sm transition-colors text-complement hover:text-complement-600'
            >
              Forgot password?
            </button>
          </div>

          {error && (
            <div className='p-3 text-sm border rounded-lg bg-error-50 border-error-200 text-error-700'>
              {error}
            </div>
          )}

          <button
            type='submit'
            disabled={isLoading}
            className='w-full h-12 font-medium text-black transition-all duration-150 ease-in-out rounded-lg bg-primary hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm'
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </Form>
      </Formik>

      <div className='relative mt-4'>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t border-divider'></div>
        </div>
        <div className='relative flex justify-center text-sm'>
          <span className='px-2 bg-bg-main text-text-secondary'>
            Or continue with
          </span>
        </div>
      </div>

      <SocialButtons />

      <div className='mt-4 text-center'>
        <p className='text-text-secondary'>
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className='font-medium transition-colors text-complement hover:text-complement-600'
          >
            Sign up
          </button>
        </p>
      </div>
    </>
  );
};

export default LoginForm;
