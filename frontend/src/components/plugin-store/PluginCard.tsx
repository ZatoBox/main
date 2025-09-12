import React from 'react';

interface PluginCardProps {
  plugin: any;
  onToggle: (id: string) => void;
  getStatusBadge: (status: string) => React.ReactNode;
  getPriceBadge: (price: string) => React.ReactNode;
}

const PluginCard: React.FC<PluginCardProps> = ({
  plugin,
  onToggle,
  getStatusBadge,
  getPriceBadge,
}) => {
  return (
    <div className='overflow-hidden transition-shadow bg-white rounded-lg shadow-lg hover:shadow-xl'>
      <div className='p-6'>
        <div className='flex items-start justify-between mb-3'>
          <div className='flex items-center space-x-3'>
            <span className='text-2xl'>{plugin.icon}</span>
            <div>
              <h3 className='text-lg font-semibold text-black'>
                {plugin.name}
              </h3>
              <p className='text-sm text-[#a8a8a8]'>{plugin.description}</p>
            </div>
          </div>
        </div>

        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center space-x-2'>
            {getStatusBadge(plugin.status)}
            {getPriceBadge(plugin.price)}
          </div>
          <div className='flex items-center space-x-1'>
            <span className='text-yellow-400'>⭐</span>
            <span className='text-sm text-zatobox-600'>{plugin.rating}</span>
            <span className='text-sm text-zatobox-600'>
              ({plugin.installs})
            </span>
          </div>
        </div>

        <div className='mb-4'>
          <div className='flex flex-wrap gap-1'>
            {plugin.features.slice(0, 2).map((f: string, i: number) => (
              <span
                key={i}
                className='px-2 py-1 text-xs text-zatobox-700 bg-zatobox-100 rounded'
              >
                {f}
              </span>
            ))}
            {plugin.features.length > 2 && (
              <span className='px-2 py-1 text-xs text-zatobox-700 bg-zatobox-100 rounded'>
                +{plugin.features.length - 2} more
              </span>
            )}
          </div>
        </div>

        <div>
          {plugin.status === 'coming-soon' ? (
            <button
              disabled
              className='w-full px-4 py-2 font-medium text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed'
            >
              Coming Soon
            </button>
          ) : plugin.status === 'maintenance' ? (
            <button
              disabled
              className='w-full px-4 py-2 font-medium text-yellow-800 bg-yellow-100 rounded-lg cursor-not-allowed'
            >
              Maintenance
            </button>
          ) : (
            <button
              onClick={() => onToggle(plugin.id)}
              className='w-full px-4 py-2 font-medium text-green-800 transition-colors bg-green-100 rounded-lg hover:bg-green-200'
            >
              {plugin.status === 'active' ? 'Deactivate' : 'Activate'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PluginCard;
