import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/products');
    } catch (error: any) {
      setError(error.message || 'Error logging in');
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomHex = (len = 16) => {
    const arr = new Uint8Array(len);
    window.crypto.getRandomValues(arr);
    return Array.from(arr)
      .map((b) => ('0' + b.toString(16)).slice(-2))
      .join('');
  };

  const handleSocialLogin = (provider: string) => {
    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
    const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
    const frontend =
      import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';
    if (!domain || !clientId || !audience) {
      alert(
        'Falta configuración de Auth0 en las variables de entorno (VITE_...).'
      );
      console.error(
        'Missing VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID or VITE_AUTH0_AUDIENCE'
      );
      return;
    }
    const redirectUri = `${frontend.replace(/\/$/, '')}/callback`;
    const responseType = 'token id_token';
    const scope = 'openid profile email';
    const nonce = generateRandomHex(16);
    const state = generateRandomHex(12);
    sessionStorage.setItem('auth0_nonce', nonce);
    sessionStorage.setItem('auth0_state', state);
    const params = new URLSearchParams({
      client_id: clientId,
      response_type: responseType,
      redirect_uri: redirectUri,
      scope,
      audience,
      nonce,
      state,
    });
    const connection = provider === 'google' ? 'google-oauth2' : 'github';
    params.append('connection', connection);
    window.location.href = `https://${domain}/authorize?${params.toString()}`;
  };

  return (
    <div className='min-h-screen bg-bg-main'>
      {/* Desktop Layout */}
      <div className='hidden min-h-screen lg:grid lg:grid-cols-2 lg:gap-6 lg:p-6'>
        {/* Left Column - Form */}
        <div className='flex items-center justify-center'>
          <div className='w-full max-w-md space-y-6'>
            {/* Header */}
            <div className='text-center lg:text-left'>
              <h1 className='mb-4 text-3xl font-bold text-text-primary'>
                Welcome Back 👋
              </h1>
              <p className='leading-relaxed text-text-secondary'>
                Today is a new day. It's your day. You shape it.
                <br />
                Sign in to start managing your projects.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* Email Input */}
              <div>
                <input
                  type='email'
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder='Example@email.com'
                  className='w-full h-12 px-4 transition-all duration-150 ease-in-out border rounded border-divider focus:ring-2 focus:ring-primary focus:border-transparent bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm'
                  required
                />
              </div>

              {/* Password Input */}
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value)
                  }
                  placeholder='at least 8 characters'
                  className='w-full h-12 px-4 pr-12 transition-all duration-150 ease-in-out border rounded border-divider focus:ring-2 focus:ring-primary focus:border-transparent bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm'
                  required
                  minLength={8}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute transition-colors transform -translate-y-1/2 right-3 top-1/2 text-text-secondary hover:text-text-primary'
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Forgot Password */}
              <div className='text-right'>
                <button
                  type='button'
                  className='text-sm transition-colors text-complement hover:text-complement-600'
                >
                  Forgot password?
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className='p-3 text-sm border rounded-lg bg-error-50 border-error-200 text-error-700'>
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type='submit'
                disabled={isLoading}
                className='w-full h-12 font-medium text-black transition-all duration-150 ease-in-out rounded-lg bg-primary hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm'
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

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

            {/* Social Login Buttons */}
            <div className='grid grid-cols-2 gap-3'>
              <button
                onClick={() => handleSocialLogin('google')}
                className='flex items-center justify-center h-12 px-4 transition-colors border rounded-lg border-divider hover:bg-gray-50'
              >
                <svg className='w-5 h-5 mr-2' viewBox='0 0 24 24'>
                  <path
                    fill='#4285F4'
                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  />
                  <path
                    fill='#34A853'
                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  />
                  <path
                    fill='#FBBC05'
                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  />
                  <path
                    fill='#EA4335'
                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  />
                </svg>
                Google
              </button>
              <button
                onClick={() => handleSocialLogin('github')}
                className='flex items-center justify-center h-12 px-4 transition-colors border rounded-lg border-divider hover:bg-gray-50'
              >
                <svg
                  className='w-5 h-5 mr-2'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                </svg>
                GitHub
              </button>
            </div>

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
          </div>
        </div>

        {/* Right Column - Image/Illustration */}
        <div className='hidden lg:flex lg:items-center lg:justify-center lg:bg-gradient-to-br lg:from-primary lg:to-complement lg:p-8'>
          <div className='text-center text-white'>
            <div className='mb-6'>
              <img
                src='/images/logozato.png'
                alt='ZatoBox Logo'
                className='object-contain w-40 mx-auto'
              />
            </div>
            <h2 className='mb-4 text-3xl font-bold'>Welcome to ZatoBox</h2>
            <p className='text-lg leading-relaxed opacity-90'>
              The complete solution for inventory and sales management.
              <br />
              Start managing your business efficiently today.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className='flex flex-col min-h-screen lg:hidden'>
        {/* Header */}
        <div className='flex items-center justify-between p-4'>
          <div className='flex items-center space-x-2'>
            <img
              src='/images/logozato.png'
              alt='ZatoBox Logo'
              className='object-contain w-10'
            />
            <span className='text-xl font-bold text-text-primary'>ZatoBox</span>
          </div>
        </div>

        {/* Content */}
        <div className='flex items-center justify-center flex-1 p-6'>
          <div className='w-full max-w-sm space-y-6'>
            {/* Header */}
            <div className='text-center'>
              <h1 className='mb-2 text-2xl font-bold text-text-primary'>
                Welcome Back 👋
              </h1>
              <p className='text-text-secondary'>
                Sign in to continue managing your inventory
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* Email Input */}
              <div>
                <input
                  type='email'
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder='Email address'
                  className='w-full h-12 px-4 transition-all duration-150 ease-in-out border rounded-lg border-divider focus:ring-2 focus:ring-primary focus:border-transparent bg-bg-surface text-text-primary placeholder-text-secondary'
                  required
                />
              </div>

              {/* Password Input */}
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value)
                  }
                  placeholder='Password'
                  className='w-full h-12 px-4 pr-12 transition-all duration-150 ease-in-out border rounded-lg border-divider focus:ring-2 focus:ring-primary focus:border-transparent bg-bg-surface text-text-primary placeholder-text-secondary'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute transition-colors transform -translate-y-1/2 right-3 top-1/2 text-text-secondary hover:text-text-primary'
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Forgot Password */}
              <div className='text-right'>
                <button
                  type='button'
                  className='text-sm transition-colors text-complement hover:text-complement-600'
                >
                  Forgot password?
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className='p-3 text-sm border rounded-lg bg-error-50 border-error-200 text-error-700'>
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type='submit'
                disabled={isLoading}
                className='w-full h-12 font-medium text-black transition-all duration-150 ease-in-out rounded-lg bg-primary hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

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

            <div className='grid grid-cols-2 gap-3 mt-3'>
              <button
                onClick={() => handleSocialLogin('google')}
                className='flex items-center justify-center h-12 px-4 transition-colors border rounded-lg border-divider hover:bg-gray-50'
              >
                <svg className='w-5 h-5 mr-2' viewBox='0 0 24 24'>
                  <path
                    fill='#4285F4'
                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  />
                  <path
                    fill='#34A853'
                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  />
                  <path
                    fill='#FBBC05'
                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  />
                  <path
                    fill='#EA4335'
                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  />
                </svg>
                Google
              </button>
              <button
                onClick={() => handleSocialLogin('github')}
                className='flex items-center justify-center h-12 px-4 transition-colors border rounded-lg border-divider hover:bg-gray-50'
              >
                <svg
                  className='w-5 h-5 mr-2'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                </svg>
                GitHub
              </button>
            </div>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
