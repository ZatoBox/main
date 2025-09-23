import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth-store';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-main">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-primary"></div>
          <p className="text-text-secondary">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role as any;
  const premiumUntil = user?.premium_up_to
    ? Date.parse(user.premium_up_to)
    : NaN;
  const isAdmin = role === 'admin';
  const isGuest = role === 'guest';
  const isActivePremium =
    role === 'premium' && !isNaN(premiumUntil) && premiumUntil > Date.now();
  if (!isAdmin && !isActivePremium && !isGuest) {
    return <Navigate to="/upgrade" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
