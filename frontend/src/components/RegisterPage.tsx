import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

const RegisterPage: React.FC = () => {
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
    const frontend =
      import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';
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
            <div className='flex items-center justify-center pt-2 space-x-3'>
              <button
                type='button'
                onClick={() => handleSocialLogin('google')}
                className='flex-1 h-10 bg-white border rounded border-divider text-text-primary hover:shadow-sm'
              >
                Continue with Google
              </button>
              <button
                type='button'
                onClick={() => handleSocialLogin('github')}
                className='flex-1 h-10 bg-white border rounded border-divider text-text-primary hover:shadow-sm'
              >
                Continue with GitHub
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
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center space-x-2'>
            <div className='flex items-center justify-center w-8 h-8 rounded-lg bg-primary'>
              <span className='text-sm font-bold text-black'>F</span>
            </div>
            <span className='text-xl font-bold text-text-primary'>
              FrontPOSw
            </span>
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
              <div className='flex items-center justify-center pt-2 space-x-3'>
                <button
                  type='button'
                  onClick={() => handleSocialLogin('google')}
                  className='flex-1 h-10 bg-white border rounded border-divider text-text-primary hover:shadow-sm'
                >
                  Continue with Google
                </button>
                <button
                  type='button'
                  onClick={() => handleSocialLogin('github')}
                  className='flex-1 h-10 bg-white border rounded border-divider text-text-primary hover:shadow-sm'
                >
                  Continue with GitHub
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
};

export default RegisterPage;
