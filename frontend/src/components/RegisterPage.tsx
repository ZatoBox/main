import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

function RegisterPage(): JSX.Element {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    acceptTerms: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const generateRandomHex = (len = 16) => {
    const arr = new Uint8Array(len);
    window.crypto.getRandomValues(arr);
    return Array.from(arr)
      .map((b) => ('0' + b.toString(16)).slice(-2))
      .join('');
  };

  const buildAuth0Url = (provider?: string) => {
    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
    const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
    const frontend = import.meta.env.VITE_FRONTEND_URL;
    if (!domain || !clientId || !audience) {
      return null;
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
      audience: audience,
      nonce,
      state,
    });
    if (provider) {
      const conn = provider === 'google' ? 'google-oauth2' : 'github';
      params.append('connection', conn);
    }
    return `https://${domain}/authorize?${params.toString()}`;
  };

  const sendSocialToken = async (accessToken: string) => {
    setIsLoading(true);
    setError('');
    try {
      const domain = import.meta.env.VITE_AUTH0_DOMAIN;
      if (domain) {
        try {
          const userinfoResp = await fetch(`https://${domain}/userinfo`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (userinfoResp.ok) {
            const profile = await userinfoResp.json();
            const email = profile?.email;
            if (email) {
              const check = await authAPI.checkEmail(email);
              if (check.exists) {
                setError(
                  'Email already registered. Please login or use social login.'
                );
                setIsLoading(false);
                return;
              }
            }
          }
        } catch (e) {
          console.error('Could not fetch userinfo from Auth0', e);
        }
      }

      const payload = await authAPI.socialRegister(accessToken);
      const localToken =
        (payload as any).token || (payload as any).access_token;
      const user = (payload as any).user || null;

      if (!localToken) {
        throw new Error('No local token received from backend');
      }

      localStorage.setItem('token', localToken);
      if (user) localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
      window.location.reload();
    } catch (e: any) {
      setError(e.message || 'Error creating user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    const url = buildAuth0Url(provider);
    if (!url) {
      alert(
        'Falta configuración de Auth0 en las variables de entorno (VITE_...).'
      );
      console.error(
        'Missing VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID or VITE_AUTH0_AUDIENCE'
      );
      return;
    }
    window.location.href = url;
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) {
      return;
    }
    const params = new URLSearchParams(hash.replace('#', ''));
    const accessToken = params.get('access_token');
    const state = params.get('state');
    const storedState = sessionStorage.getItem('auth0_state');
    if (accessToken && state && storedState && state === storedState) {
      sessionStorage.removeItem('auth0_state');
      sessionStorage.removeItem('auth0_nonce');
      sendSocialToken(accessToken);
      history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.acceptTerms) {
      setError('You must accept the Terms and Conditions');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const check = await authAPI.checkEmail(formData.email);
      if (check.exists) {
        setError('Email already registered. Please login or use social login.');
        setIsLoading(false);
        return;
      }
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Error registering user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-bg-main'>
      {/* Desktop Layout (≥1024px) */}
      <div className='hidden lg:flex lg:items-center lg:justify-center lg:min-h-screen lg:p-6'>
        <div className='w-full max-w-md p-6 border rounded-lg shadow-sm bg-bg-surface border-divider'>
          {/* Title and Description */}
          <div className='mb-6 text-center'>
            <h1 className='mb-4 text-3xl font-bold text-text-primary'>
              Create Account
            </h1>
            <p className='text-sm text-text-secondary'>
              Sign up to start managing your inventory
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Full Name */}
            <div>
              <input
                type='text'
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder='Your full name'
                className='w-full px-4 transition-all duration-150 ease-in-out border rounded h-11 border-divider focus:ring-2 focus:ring-primary focus:border-transparent bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm'
                required
              />
            </div>

            {/* Email */}
            <div>
              <input
                type='email'
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder='example@email.com'
                className='w-full px-4 transition-all duration-150 ease-in-out border rounded h-11 border-divider focus:ring-2 focus:ring-primary focus:border-transparent bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm'
                required
              />
            </div>

            {/* Password */}
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder='at least 8 characters'
                className='w-full px-4 pr-12 transition-all duration-150 ease-in-out border rounded h-11 border-divider focus:ring-2 focus:ring-primary focus:border-transparent bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm'
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

            {/* Confirm Password */}
            <div className='relative'>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange('confirmPassword', e.target.value)
                }
                placeholder='confirm your password'
                className='w-full px-4 pr-12 transition-all duration-150 ease-in-out border rounded h-11 border-divider focus:ring-2 focus:ring-primary focus:border-transparent bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm'
                required
                minLength={8}
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute transition-colors transform -translate-y-1/2 right-3 top-1/2 text-text-secondary hover:text-text-primary'
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Phone */}
            <div>
              <input
                type='tel'
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder='phone number (optional)'
                className='w-full px-4 transition-all duration-150 ease-in-out border rounded h-11 border-divider focus:ring-2 focus:ring-primary focus:border-transparent bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm'
              />
            </div>

            {/* Terms and Conditions */}
            <div className='flex items-start space-x-3'>
              <input
                type='checkbox'
                id='acceptTerms'
                checked={formData.acceptTerms}
                onChange={(e) =>
                  handleInputChange('acceptTerms', e.target.checked)
                }
                className='w-4 h-4 mt-1 border-gray-300 rounded text-complement focus:ring-complement'
                required
              />
              <label
                htmlFor='acceptTerms'
                className='text-sm text-text-secondary'
              >
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
              className='w-full h-11 bg-primary hover:bg-primary-600 text-black font-medium rounded transition-all duration-150 ease-in-out hover:shadow-md transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>

            {/* Social Login Buttons */}
            <div className='grid grid-cols-2 gap-3'>
              <button
                type='button'
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
                type='button'
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
          </form>

          {/* Sign In Link */}
          <div className='mt-6 text-center'>
            <p className='text-sm text-text-secondary'>
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className='font-medium transition-colors text-complement hover:text-complement-600'
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Layout (<1024px) */}
      <div className='min-h-screen p-4 lg:hidden'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 mb-8'>
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
        <div className='flex items-center justify-center flex-1'>
          <div className='w-full max-w-sm space-y-6'>
            {/* Title and Description */}
            <div className='text-center'>
              <h1 className='mb-2 text-2xl font-bold text-text-primary'>
                Create Account
              </h1>
              <p className='text-sm text-text-secondary'>
                Sign up to start managing your inventory
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* Full Name */}
              <div>
                <input
                  type='text'
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange('fullName', e.target.value)
                  }
                  placeholder='Your full name'
                  className='w-full px-4 transition-all duration-150 ease-in-out border rounded-lg h-11 border-divider focus:ring-2 focus:ring-primary focus:border-transparent bg-bg-surface text-text-primary placeholder-text-secondary'
                  required
                />
              </div>

              {/* Email */}
              <div>
                <input
                  type='email'
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder='example@email.com'
                  className='w-full px-4 transition-all duration-150 ease-in-out border rounded-lg h-11 border-divider focus:ring-2 focus:ring-primary focus:border-transparent bg-bg-surface text-text-primary placeholder-text-secondary'
                  required
                />
              </div>

              {/* Password */}
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value)
                  }
                  placeholder='at least 8 characters'
                  className='w-full px-4 pr-12 transition-all duration-150 ease-in-out border rounded-lg h-11 border-divider focus:ring-2 focus:ring-primary focus:border-transparent bg-bg-surface text-text-primary placeholder-text-secondary'
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

              {/* Confirm Password */}
              <div className='relative'>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange('confirmPassword', e.target.value)
                  }
                  placeholder='confirm your password'
                  className='w-full px-4 pr-12 transition-all duration-150 ease-in-out border rounded-lg h-11 border-divider focus:ring-2 focus:ring-primary focus:border-transparent bg-bg-surface text-text-primary placeholder-text-secondary'
                  required
                  minLength={8}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute transition-colors transform -translate-y-1/2 right-3 top-1/2 text-text-secondary hover:text-text-primary'
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {/* Phone */}
              <div>
                <input
                  type='tel'
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder='phone number (optional)'
                  className='w-full px-4 transition-all duration-150 ease-in-out border rounded-lg h-11 border-divider focus:ring-2 focus:ring-primary focus:border-transparent bg-bg-surface text-text-primary placeholder-text-secondary'
                />
              </div>

              {/* Terms and Conditions */}
              <div className='flex items-start space-x-3'>
                <input
                  type='checkbox'
                  id='acceptTermsMobile'
                  checked={formData.acceptTerms}
                  onChange={(e) =>
                    handleInputChange('acceptTerms', e.target.checked)
                  }
                  className='w-4 h-4 mt-1 border-gray-300 rounded text-complement focus:ring-complement'
                  required
                />
                <label
                  htmlFor='acceptTermsMobile'
                  className='text-sm text-text-secondary'
                >
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
                className='w-full font-medium text-black transition-all duration-150 ease-in-out rounded-lg h-11 bg-primary hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>

              {/* Social Login Buttons */}
              <div className='grid grid-cols-2 gap-3 mt-3'>
                <button
                  type='button'
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
                  type='button'
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
            </form>

            {/* Sign In Link */}
            <div className='text-center'>
              <p className='text-sm text-text-secondary'>
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className='font-medium transition-colors text-complement hover:text-complement-600'
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
