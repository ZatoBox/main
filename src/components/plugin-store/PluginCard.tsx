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
    <div className="w-full min-w-0 overflow-hidden transition-shadow bg-white rounded-lg shadow-lg hover:shadow-xl">
      <div className="p-4 sm:p-6">
        <div className="flex items-start gap-2 sm:gap-3 mb-3">
          <span className="text-xl sm:text-2xl flex-shrink-0">
            {plugin.icon}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-black truncate">
              {plugin.name}
            </h3>
            <p className="text-xs sm:text-sm text-[#a8a8a8] line-clamp-2">
              {plugin.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            {getStatusBadge(plugin.status)}
            {getPriceBadge(plugin.price)}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-yellow-400">⭐</span>
            <span className="text-xs sm:text-sm text-zatobox-600">
              {plugin.rating}
            </span>
            <span className="text-xs sm:text-sm text-zatobox-600">
              ({plugin.installs})
            </span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {plugin.features.slice(0, 2).map((f: string, i: number) => (
              <span
                key={i}
                className="px-2 py-1 text-xs text-zatobox-700 bg-zatobox-100 rounded"
              >
                {f}
              </span>
            ))}
            {plugin.features.length > 2 && (
              <span className="px-2 py-1 text-xs text-zatobox-700 bg-zatobox-100 rounded">
                +{plugin.features.length - 2} more
              </span>
            )}
          </div>
        </div>

        <div>
          {plugin.status === 'coming-soon' ? (
            <button
              disabled
              className="w-full px-4 py-2 font-medium text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
            >
              En Desarrollo
            </button>
          ) : plugin.status === 'maintenance' ? (
            <button
              disabled
              className="w-full px-4 py-2 font-medium text-yellow-800 bg-yellow-100 rounded-lg cursor-not-allowed"
            >
              En Mantenimiento
            </button>
          ) : (
            <button
              onClick={() => onToggle(plugin.id)}
              className={`w-full px-4 py-2 font-medium transition-colors rounded-lg ${
                plugin.status === 'active'
                  ? 'text-red-800 bg-red-100 hover:bg-red-200'
                  : 'text-green-800 bg-green-100 hover:bg-green-200'
              }`}
            >
              {plugin.status === 'active' ? 'Desactivar' : 'Activar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PluginCard;
