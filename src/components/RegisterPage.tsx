import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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
    acceptTerms: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (!formData.acceptTerms) {
      setError('Debes aceptar los Términos y Condiciones');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      });
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Error al registrar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main">
      {/* Desktop Layout (≥1024px) */}
      <div className="hidden lg:flex lg:items-center lg:justify-center lg:min-h-screen lg:p-6">
        <div className="w-full max-w-md bg-bg-surface rounded-lg shadow-sm border border-divider p-6">
          {/* Title and Description */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-text-primary mb-4">
              Crear cuenta
            </h1>
            <p className="text-sm text-text-secondary">
              Regístrate para empezar a gestionar tu inventario
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Tu nombre completo"
                className="w-full h-11 px-4 border border-divider rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150 ease-in-out bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm"
                required
              />
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="ejemplo@mail.com"
                className="w-full h-11 px-4 border border-divider rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150 ease-in-out bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Al menos 8 caracteres"
                className="w-full h-11 px-4 pr-12 border border-divider rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150 ease-in-out bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Repite tu contraseña"
                className="w-full h-11 px-4 pr-12 border border-divider rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150 ease-in-out bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Phone (Optional) */}
            <div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+12 345 678 9012"
                className="w-full h-11 px-4 border border-divider rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150 ease-in-out bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm"
              />
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={formData.acceptTerms}
                onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mt-0.5"
                required
              />
              <label htmlFor="acceptTerms" className="text-sm text-text-primary">
                Acepto los{' '}
                <button
                  type="button"
                  className="text-complement hover:text-complement-600 underline transition-colors"
                >
                  Términos y Condiciones
                </button>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4">
                {error}
              </div>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary hover:bg-primary-600 text-black font-medium rounded transition-all duration-150 ease-in-out hover:shadow-md transform hover:scale-[1.02] mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-4">
            <p className="text-sm text-text-secondary">
              ¿Ya tienes una cuenta?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-complement hover:text-complement-600 font-medium transition-colors underline"
              >
                Inicia sesión
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Tablet Layout (≥768px and <1024px) */}
      <div className="hidden md:block lg:hidden">
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-bg-surface rounded-lg shadow-sm border border-divider p-6">
            {/* Title and Description */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-text-primary mb-4">
                Crear cuenta
              </h1>
              <p className="text-sm text-text-secondary">
                Regístrate para empezar a gestionar tu inventario
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Tu nombre completo"
                  className="w-full h-11 px-4 border border-divider rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150 ease-in-out bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="ejemplo@mail.com"
                  className="w-full h-11 px-4 border border-divider rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150 ease-in-out bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Al menos 8 caracteres"
                  className="w-full h-11 px-4 pr-12 border border-divider rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150 ease-in-out bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Repite tu contraseña"
                  className="w-full h-11 px-4 pr-12 border border-divider rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150 ease-in-out bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Phone (Optional) */}
              <div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+12 345 678 9012"
                  className="w-full h-11 px-4 border border-divider rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150 ease-in-out bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm"
                />
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="acceptTermsTablet"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mt-0.5"
                  required
                />
                <label htmlFor="acceptTermsTablet" className="text-sm text-text-primary">
                  Acepto los{' '}
                  <button
                    type="button"
                    className="text-complement hover:text-complement-600 underline transition-colors"
                  >
                    Términos y Condiciones
                  </button>
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary-600 text-black font-medium rounded transition-all duration-150 ease-in-out hover:shadow-md transform hover:scale-[1.02] mt-6"
              >
                Registrarse
              </button>
            </form>

            {/* Sign In Link */}
            <div className="text-center mt-4">
              <p className="text-sm text-text-secondary">
                ¿Ya tienes una cuenta?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-complement hover:text-complement-600 font-medium transition-colors underline"
                >
                  Inicia sesión
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout (<768px) */}
      <div className="md:hidden min-h-screen p-4">
        <div className="w-full bg-bg-surface rounded-lg shadow-sm border border-divider p-6 mt-8">
          {/* Title and Description */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-text-primary mb-4">
              Crear cuenta
            </h1>
            <p className="text-sm text-text-secondary">
              Regístrate para empezar a gestionar tu inventario
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Tu nombre completo"
                className="w-full h-11 px-4 border border-divider rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150 ease-in-out bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm"
                required
              />
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="ejemplo@mail.com"
                className="w-full h-11 px-4 border border-divider rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150 ease-in-out bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Al menos 8 caracteres"
                className="w-full h-11 px-4 pr-12 border border-divider rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150 ease-in-out bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Repite tu contraseña"
                className="w-full h-11 px-4 pr-12 border border-divider rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150 ease-in-out bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Phone (Optional) */}
            <div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+12 345 678 9012"
                className="w-full h-11 px-4 border border-divider rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150 ease-in-out bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm"
              />
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="acceptTermsMobile"
                checked={formData.acceptTerms}
                onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mt-0.5"
                required
              />
              <label htmlFor="acceptTermsMobile" className="text-sm text-text-primary">
                Acepto los{' '}
                <button
                  type="button"
                  className="text-complement hover:text-complement-600 underline transition-colors"
                >
                  Términos y Condiciones
                </button>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary-600 text-black font-medium rounded transition-all duration-150 ease-in-out hover:shadow-md mt-6"
            >
              Registrarse
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-4">
            <p className="text-sm text-text-secondary">
              ¿Ya tienes una cuenta?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-complement hover:text-complement-600 font-medium transition-colors underline"
              >
                Inicia sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;