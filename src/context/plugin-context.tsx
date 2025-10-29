'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth-store';
import { profileAPI, authAPI } from '@/services/api.service';

interface PluginContextType {
  activePlugins: string[];
  togglePlugin: (pluginId: string) => Promise<void>;
  isPluginActive: (pluginId: string) => boolean;
}

const PluginContext = createContext<PluginContextType | undefined>(undefined);

export const usePlugins = () => {
  const context = useContext(PluginContext);
  if (context === undefined) {
    throw new Error('usePlugins must be used within a PluginProvider');
  }
  return context;
};

interface PluginProviderProps {
  children: React.ReactNode;
}

export const PluginProvider: React.FC<PluginProviderProps> = ({ children }) => {
  const { user, token, setUser } = useAuth();
  const [activePlugins, setActivePlugins] = useState<string[]>([]);

  useEffect(() => {
    if (user && (user as any).modules) {
      const mods = (user as any).modules as Record<string, boolean>;
      const actives = Object.keys(mods).filter((k) => mods[k]);
      if (actives.length === 0) {
        setActivePlugins(['ocr-module']);
      } else {
        setActivePlugins(actives);
      }
      return;
    }

    const defaultActive = ['ocr-module'];
    setActivePlugins(defaultActive);
  }, [user]);

  const togglePlugin = async (pluginId: string) => {
    if (user && token) {
      const freshUser = await authAPI.getCurrentUser();
      setUser(freshUser);
      const currentModules = {
        ...(((freshUser as any).modules as Record<string, boolean>) || {}),
      };

      if (currentModules[pluginId]) {
        delete currentModules[pluginId];
      } else {
        currentModules[pluginId] = true;
      }

      const newModules = currentModules;

      try {
        const res = await profileAPI.update({ modules: newModules });
        const actives = Object.keys(newModules).filter((k) => newModules[k]);
        setActivePlugins(actives);
        if (res && (res as any).user) {
          setUser((res as any).user);
        }
      } catch (err) {
        setActivePlugins((prev) => {
          const next = prev.includes(pluginId)
            ? prev.filter((p) => p !== pluginId)
            : [...prev, pluginId];
          return next;
        });
      }

      return;
    }

    setActivePlugins((prev) => {
      const newActivePlugins = prev.includes(pluginId)
        ? prev.filter((id) => id !== pluginId)
        : [...prev, pluginId];
      return newActivePlugins;
    });
  };

  const isPluginActive = (pluginId: string) => {
    return activePlugins.includes(pluginId);
  };

  return (
    <PluginContext.Provider
      value={{
        activePlugins,
        togglePlugin,
        isPluginActive,
      }}
    >
      {children}
    </PluginContext.Provider>
  );
};
