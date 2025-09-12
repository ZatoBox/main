import React from 'react';

interface FeaturedSectionProps {
  plugins: any[];
  getStatusBadge: (status: string) => React.ReactNode;
  getPriceBadge: (price: string) => React.ReactNode;
  onToggle: (id: string) => void;
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  plugins,
  getStatusBadge,
  getPriceBadge,
  onToggle,
}) => {
  return (
    <div className='mb-8'>
      <h2 className='mb-4 text-xl font-bold text-black'>
        🔥 MOST INSTALLS By popular demand
      </h2>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {plugins.slice(0, 3).map((plugin) => {
          return (
            <div
              key={plugin.id}
              className='overflow-hidden transition-shadow bg-white rounded-lg shadow-lg hover:shadow-xl'
            >
              {plugin.screenshot && (
                <div className='h-48 overflow-hidden bg-white'>
                  <img
                    src={plugin.screenshot}
                    alt={plugin.name}
                    className='object-cover w-full h-full'
                  />
                </div>
              )}
              <div className='p-6'>
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex items-center space-x-3'>
                    <span className='text-3xl'>{plugin.icon}</span>
                    <div>
                      <h3 className='text-lg font-semibold text-black'>
                        {plugin.name}
                      </h3>
                      <p className='text-sm text-[#a8a8a8]'>
                        {plugin.description}
                      </p>
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
                    <span className='text-sm text-zatobox-600'>
                      {plugin.rating}
                    </span>
                    <span className='text-sm text-zatobox-600'>
                      ({plugin.installs})
                    </span>
                  </div>
                </div>
                {plugin.status === 'active' ? (
                  <button
                    onClick={() => onToggle(plugin.id)}
                    className='w-full px-4 py-2 font-medium text-red-800 transition-colors bg-red-100 rounded-lg hover:bg-red-200'
                  >
                    Deactivate
                  </button>
                ) : plugin.status === 'inactive' ? (
                  <button
                    onClick={() => onToggle(plugin.id)}
                    className='w-full px-4 py-2 font-medium text-green-800 transition-colors bg-green-100 rounded-lg hover:bg-green-200'
                  >
                    Activate
                  </button>
                ) : plugin.status === 'coming-soon' ? (
                  <button
                    disabled
                    className='w-full px-4 py-2 font-medium text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed'
                  >
                    Coming Soon
                  </button>
                ) : (
                  <button
                    disabled
                    className='w-full px-4 py-2 font-medium text-yellow-800 bg-yellow-100 rounded-lg cursor-not-allowed'
                  >
                    Maintenance
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedSection;
