import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Instagram } from 'lucide-react';
import { layoutAPI } from '@/services/web-api';
import { Layout } from '@/types';

const WebFooter: React.FC = () => {
  const [layout, setLayout] = useState<Layout | null>(null);

  useEffect(() => {
    layoutAPI
      .getBySlug('main')
      .then((response) => {
        if (response.success) {
          setLayout(response.layout);
        }
      })
      .catch(console.error);
  }, []);

  if (!layout) {
    return null;
  }

  return (
    <footer className='bg-gray-50 text-gray-700 py-8'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          <div>
            <h3 className='text-lg font-semibold mb-4'>{layout.hero_title}</h3>
            <p className='text-sm'>{layout.web_description}</p>
          </div>
          <div>
            <h4 className='text-md font-medium mb-4'>Enlaces</h4>
            <div className='flex space-x-4'>
              {Object.entries(layout.social_links || {}).map(([key, value]) => {
                if (key === 'github') {
                  return (
                    <a
                      key={key}
                      href={value as string}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hover:text-gray-900'
                    >
                      <Github size={24} />
                    </a>
                  );
                }
                if (key === 'linkedin') {
                  return (
                    <a
                      key={key}
                      href={value as string}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hover:text-gray-900'
                    >
                      <Linkedin size={24} />
                    </a>
                  );
                }
                if (key === 'instagram') {
                  return (
                    <a
                      key={key}
                      href={value as string}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hover:text-gray-900'
                    >
                      <Instagram size={24} />
                    </a>
                  );
                }
                return null;
              })}
            </div>
          </div>
          <div>
            <h4 className='text-md font-medium mb-4'>Contacto</h4>
            <p className='text-sm'>
              Última actualización:{' '}
              {new Date(layout.last_updated).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className='border-t border-gray-200 mt-8 pt-4 text-center'>
          <p className='text-sm'>
            &copy; 2025 ZatoBox. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default WebFooter;
