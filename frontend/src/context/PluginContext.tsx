import React, { createContext, useContext, useState, useEffect } from 'react';


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

  // Load active plugins from localStorage on mount
  useEffect(() => {
    const savedPlugins = localStorage.getItem('activePlugins');
    if (savedPlugins) {
      setActivePlugins(JSON.parse(savedPlugins));
    } else {
      // Default active plugins
      const defaultActive = ['ocr-module', 'pos-integration'];
      setActivePlugins(defaultActive);
      localStorage.setItem('activePlugins', JSON.stringify(defaultActive));
    }
  }, []);

  const togglePlugin = (pluginId: string) => {
    setActivePlugins(prev => {
      const newActivePlugins = prev.includes(pluginId)
        ? prev.filter(id => id !== pluginId)
        : [...prev, pluginId];

      localStorage.setItem('activePlugins', JSON.stringify(newActivePlugins));
      return newActivePlugins;
    });
  };

  const isPluginActive = (pluginId: string) => {
    return activePlugins.includes(pluginId);
  };

  return (
    <PluginContext.Provider value={{
      activePlugins,
      togglePlugin,
      isPluginActive,
    }}>
      {children}
    </PluginContext.Provider>
  );
};
