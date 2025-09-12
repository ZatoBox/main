import React from 'react';
import PluginCard from './PluginCard';

interface PluginGridProps {
  plugins: any[];
  onToggle: (id: string) => void;
  getStatusBadge: (status: string) => React.ReactNode;
  getPriceBadge: (price: string) => React.ReactNode;
}

const PluginGrid: React.FC<PluginGridProps> = ({
  plugins,
  onToggle,
  getStatusBadge,
  getPriceBadge,
}) => {
  return (
    <div className='grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full min-w-0'>
      {plugins.map((plugin) => (
        <PluginCard
          key={plugin.id}
          plugin={plugin}
          onToggle={onToggle}
          getStatusBadge={getStatusBadge}
          getPriceBadge={getPriceBadge}
        />
      ))}
    </div>
  );
};

export default PluginGrid;
