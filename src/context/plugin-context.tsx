'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCookie, setCookie } from '@/services/cookies.service';

interface PluginContextType {
  activePlugins: string[];
  togglePlugin: (pluginId: string) => void;
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
  const [activePlugins, setActivePlugins] = useState<string[]>([]);

  useEffect(() => {
    const savedPlugins = getCookie('activePlugins');
    if (savedPlugins) {
      setActivePlugins(JSON.parse(savedPlugins));
    } else {
      const defaultActive = ['ocr-module'];
      setActivePlugins(defaultActive);
      setCookie('activePlugins', JSON.stringify(defaultActive), {
        expires: 365,
      });
    }
  }, []);

  const togglePlugin = (pluginId: string) => {
    setActivePlugins((prev) => {
      const newActivePlugins = prev.includes(pluginId)
        ? prev.filter((id) => id !== pluginId)
        : [...prev, pluginId];

      setCookie('activePlugins', JSON.stringify(newActivePlugins), {
        expires: 365,
      });
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
