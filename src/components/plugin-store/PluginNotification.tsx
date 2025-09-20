import React from 'react';

interface PluginNotificationProps {
  message: string;
  type: 'success' | 'info';
}

const PluginNotification: React.FC<PluginNotificationProps> = ({
  message,
  type,
}) => {
  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${
        type === 'success'
          ? 'bg-green-500 text-white'
          : 'bg-blue-500 text-white'
      } animate-menu-item-bounce`}
    >
      <div className='flex items-center space-x-2'>
        <div className='w-2 h-2 bg-white rounded-full animate-pulse'></div>
        <span className='font-medium'>{message}</span>
      </div>
    </div>
  );
};

export default PluginNotification;
