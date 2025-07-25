import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, User as APIUser } from '../services/api';
import { icpAuthService, ICPUser } from '../services/icpAuth';

interface AuthContextType {
  user: APIUser | null;
  icpUser: ICPUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isICPAuthenticated: boolean;
  isLoading: boolean;
  authType: 'traditional' | 'icp' | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<APIUser>) => void;
  setICPUser: (user: ICPUser, token: string) => void;
  icpLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<APIUser | null>(null);
  const [icpUser, setICPUserState] = useState<ICPUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authType, setAuthType] = useState<'traditional' | 'icp' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token && !!user && authType === 'traditional';
  const isICPAuthenticated = !!token && !!icpUser && authType === 'icp';

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedAuthType = localStorage.getItem('authType') as 'traditional' | 'icp' | null;
      
      console.log('Auth check - storedToken:', !!storedToken, 'storedAuthType:', storedAuthType);
      
      if (storedToken && storedAuthType) {
        setToken(storedToken);
        setAuthType(storedAuthType);
        try {
          if (storedAuthType === 'traditional') {
            const response = await authAPI.getCurrentUser();
            setUser(response.user);
          } else if (storedAuthType === 'icp') {
            // Initialize ICP auth service and check authentication
            await icpAuthService.init();
            if (await icpAuthService.isAuthenticated()) {
              const currentUser = await icpAuthService.getCurrentUser();
              if (currentUser) {
                setICPUserState(currentUser);
              } else {
                // ICP session expired, clear it
                clearICPAuth();
              }
            } else {
              clearICPAuth();
            }
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          // Clear authentication state on error
          if (storedAuthType === 'traditional') {
            clearTraditionalAuth();
          } else {
            clearICPAuth();
          }
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const clearTraditionalAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authType');
    setToken(null);
    setUser(null);
    setAuthType(null);
  };

  const clearICPAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authType');
    setToken(null);
    setICPUserState(null);
    setAuthType(null);
  };

  // Debug function to clear all auth data
  const clearAllAuthData = () => {
    console.log('Clearing all authentication data...');
    localStorage.clear();
    setToken(null);
    setUser(null);
    setICPUserState(null);
    setAuthType(null);
  };

  // Add to window for debugging (remove in production)
  if (typeof window !== 'undefined') {
    (window as any).clearAuth = clearAllAuthData;
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token: newToken, user: userData } = response;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('authType', 'traditional');
      setToken(newToken);
      setUser(userData);
      setAuthType('traditional');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await authAPI.register(userData);
      const { token: newToken, user: newUser } = response;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('authType', 'traditional');
      setToken(newToken);
      setUser(newUser);
      setAuthType('traditional');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const setICPUser = (user: ICPUser, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('authType', 'icp');
    setToken(token);
    setICPUserState(user);
    setAuthType('icp');
  };

  const logout = () => {
    if (authType === 'traditional') {
      clearTraditionalAuth();
      // Call logout API (optional, for server-side session cleanup)
      authAPI.logout().catch(console.error);
    } else if (authType === 'icp') {
      icpLogout();
    }
  };

  const icpLogout = async () => {
    try {
      await icpAuthService.logout();
    } catch (error) {
      console.error('ICP logout failed:', error);
    } finally {
      clearICPAuth();
    }
  };

  const updateUser = (userData: Partial<APIUser>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextType = {
    user,
    icpUser,
    token,
    isAuthenticated: !isLoading && (isAuthenticated || isICPAuthenticated),
    isICPAuthenticated,
    isLoading,
    authType,
    login,
    register,
    logout,
    updateUser,
    setICPUser,
    icpLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 