import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Archive, ArrowRight } from 'lucide-react';

const SmartInventoryPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className='max-w-4xl p-6 mx-auto'>
      <div className='p-8 bg-white rounded-lg shadow-lg'>
        <div className='flex items-center mb-6'>
          <Brain className='w-8 h-8 mr-3 text-complement' />
          <h1 className='text-3xl font-bold text-text-primary'>
            Smart Inventory
          </h1>
        </div>

        <div className='p-6 mb-8 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50'>
          <h2 className='mb-4 text-xl font-semibold text-text-primary'>
            🚀 Feature in Development
          </h2>
          <p className='mb-4 text-text-secondary'>
            Smart Inventory with AI is being developed. This feature will
            include:
          </p>
          <ul className='mb-6 space-y-2 text-text-secondary'>
            <li className='flex items-center'>
              <span className='w-2 h-2 mr-3 rounded-full bg-complement'></span>
              Predictive inventory analysis
            </li>
            <li className='flex items-center'>
              <span className='w-2 h-2 mr-3 rounded-full bg-complement'></span>
              Automatic detection of low stock products
            </li>
            <li className='flex items-center'>
              <span className='w-2 h-2 mr-3 rounded-full bg-complement'></span>
              Restocking recommendations
            </li>
            <li className='flex items-center'>
              <span className='w-2 h-2 mr-3 rounded-full bg-complement'></span>
              Sales trend analysis
            </li>
          </ul>
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          <div className='p-6 transition-shadow bg-white border rounded-lg border-divider hover:shadow-md'>
            <div className='flex items-center mb-4'>
              <Archive className='w-6 h-6 mr-3 text-complement' />
              <h3 className='text-lg font-semibold text-text-primary'>
                Current Inventory
              </h3>
            </div>
            <p className='mb-4 text-text-secondary'>
              Access the traditional inventory with all available features.
            </p>
            <button
              onClick={() => navigate('/inventory')}
              className='flex items-center font-medium text-complement hover:text-complement-700'
            >
              Go to Inventory
              <ArrowRight className='w-4 h-4 ml-2' />
            </button>
          </div>

          <div className='p-6 transition-shadow bg-white border rounded-lg border-divider hover:shadow-md'>
            <div className='flex items-center mb-4'>
              <Brain className='w-6 h-6 mr-3 text-purple-600' />
              <h3 className='text-lg font-semibold text-text-primary'>
                OCR Documents
              </h3>
            </div>
            <p className='mb-4 text-text-secondary'>
              Process documents with OCR to extract information automatically.
            </p>
            <button
              onClick={() => navigate('/ocr-result')}
              className='flex items-center font-medium text-purple-600 hover:text-purple-700'
            >
              Process Documents
              <ArrowRight className='w-4 h-4 ml-2' />
            </button>
          </div>
        </div>

        <div className='p-4 mt-8 border border-yellow-200 rounded-lg bg-yellow-50'>
          <h4 className='mb-2 font-semibold text-yellow-800'>💡 Coming Soon</h4>
          <p className='text-sm text-yellow-700'>
            We are working on integrating artificial intelligence to make your
            inventory smarter. Meanwhile, you can use all the features of the
            traditional inventory.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmartInventoryPage;
