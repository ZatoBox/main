import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';

interface Props {
  onBack: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  onSave: () => void;
  status: 'active' | 'inactive' | '';
  saving: boolean;
  togglingStatus: boolean;
}

const EditHeader: React.FC<Props> = ({
  onBack,
  onDelete,
  onToggleStatus,
  onSave,
  status,
  saving,
  togglingStatus,
}) => {
  return (
    <div className='border-b shadow-sm bg-bg-surface border-divider'>
      <div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center space-x-4'>
            <button
              onClick={onBack}
              className='p-2 transition-colors rounded-full hover:bg-gray-50 md:hidden'
            >
              <ArrowLeft size={20} className='text-text-primary' />
            </button>
            <h1 className='text-xl font-semibold text-text-primary md:hidden'>
              Edit Product
            </h1>
          </div>

          <div className='flex items-center space-x-3'>
            <button
              onClick={onBack}
              className='px-4 py-2 font-medium text-black transition-colors bg-gray-100 rounded-lg hover:bg-gray-200'
            >
              Go back
            </button>
            <button
              onClick={onDelete}
              className='px-4 py-2 font-medium text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600'
            >
              Delete
            </button>
            <button
              onClick={onToggleStatus}
              disabled={togglingStatus}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                status === 'active'
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-100 text-text-primary hover:bg-gray-200'
              }`}
            >
              <Check size={16} />
              <span>{status === 'active' ? 'Active' : 'Inactive'}</span>
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className={`bg-primary hover:bg-primary-600 text-black font-medium px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                saving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {saving ? (
                <>
                  <div className='w-4 h-4 border-b-2 border-black rounded-full animate-spin'></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditHeader;
