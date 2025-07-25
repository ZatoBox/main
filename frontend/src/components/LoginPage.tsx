import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Key, Globe } from 'lucide-react';
import { icpAuthService } from '../services/icpAuth';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setICPUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInternetIdentityLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const { user, token } = await icpAuthService.login();
      
      // Set the ICP user in auth context
      setICPUser(user, token);
      
      // Navigate to home page
      navigate('/');
    } catch (error: any) {
      console.error('Internet Identity login failed:', error);
      setError(error.message || 'Failed to login with Internet Identity');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main">
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6 lg:p-6 min-h-screen">
        {/* Left Column - Authentication */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-complement rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-text-primary mb-4">
                Welcome to ZatoBox 🔐
              </h1>
              <p className="text-text-secondary leading-relaxed">
                Access your inventory management system using Internet Computer Digital Identity.<br />
                Secure, decentralized authentication without passwords.
              </p>
            </div>

            {/* Internet Identity Features */}
            <div className="space-y-6">
              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Key className="w-3 h-3 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-primary">No Passwords</h3>
                    <p className="text-sm text-text-secondary">Secure authentication using cryptographic keys</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="w-3 h-3 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-primary">Decentralized Security</h3>
                    <p className="text-sm text-text-secondary">Your identity is owned by you, stored on the blockchain</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Globe className="w-3 h-3 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-primary">Universal Access</h3>
                    <p className="text-sm text-text-secondary">Use the same identity across all Internet Computer apps</p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Login Button */}
              <button
                onClick={handleInternetIdentityLogin}
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-primary to-complement hover:from-primary-600 hover:to-complement-600 text-white font-medium rounded-lg transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Connecting to Internet Identity...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Login with Internet Identity</span>
                  </>
                )}
              </button>

              {/* Info */}
              <div className="text-center text-sm text-text-secondary">
                <p>
                  New to Internet Identity?{' '}
                  <a 
                    href="http://ucwa4-rx777-77774-qaada-cai.localhost:4943" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-complement hover:text-complement-600 font-medium transition-colors"
                  >
                    Create your digital identity
                  </a>
                </p>
              </div>

              {/* Registration Info */}
              <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/10">
                <h3 className="font-medium text-text-primary mb-2">First time using ZatoBox?</h3>
                <p className="text-sm text-text-secondary">
                  Your account will be automatically created when you login with Internet Identity.
                  No separate registration required!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Branding */}
        <div className="hidden lg:flex lg:items-center lg:justify-center lg:bg-gradient-to-br lg:from-primary lg:to-complement lg:p-8 lg:rounded-lg">
          <div className="text-center text-white">
            <div className="mb-8">
              <img src="/images/logozato.png" alt="ZatoBox Logo" className="w-40 mx-auto object-contain" />
            </div>
            <h2 className="text-3xl font-bold mb-6">Web3 Inventory Management</h2>
            <div className="space-y-4 text-lg opacity-90 leading-relaxed">
              <p>Experience the future of business management with blockchain-powered authentication.</p>
              <p>Secure, private, and completely owned by you.</p>
            </div>
            <div className="mt-8 p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-3">Why Internet Identity?</h3>
              <ul className="text-sm space-y-2 text-left">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>No password vulnerabilities</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Decentralized and private</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Cross-device synchronization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Built on blockchain technology</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <img src="/images/logozato.png" alt="ZatoBox Logo" className="w-10 object-contain" />
            <span className="text-xl font-bold text-text-primary">ZatoBox</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-sm space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-complement rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                Welcome Back 🔐
              </h1>
              <p className="text-text-secondary text-sm">
                Secure login with Internet Computer Digital Identity
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Login Button */}
            <button
              onClick={handleInternetIdentityLogin}
              disabled={isLoading}
              className="w-full h-14 bg-gradient-to-r from-primary to-complement hover:from-primary-600 hover:to-complement-600 text-white font-medium rounded-lg transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Login with Internet Identity</span>
                </>
              )}
            </button>

            {/* Registration Info */}
            <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-sm text-text-secondary">
                <strong className="text-text-primary">First time here?</strong><br />
                Your account will be created automatically when you login.
              </p>
            </div>

            {/* Create Identity Link */}
            <div className="text-center">
              <a 
                href="http://ucwa4-rx777-77774-qaada-cai.localhost:4943" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-complement hover:text-complement-600 font-medium transition-colors text-sm"
              >
                Create Internet Identity →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;