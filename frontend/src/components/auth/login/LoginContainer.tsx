import React from 'react';

interface Props {
  children: React.ReactNode;
  title?: string;
  description?: string;
  logoSrc?: string;
  logoAlt?: string;
}

const LoginContainer: React.FC<Props> = ({
  children,
  title,
  description,
  logoSrc,
  logoAlt,
}) => {
  return (
    <div className='w-full max-w-md space-y-6'>
      <div className='text-center lg:text-left'>
        {logoSrc && (
          <div className='mb-4'>
            <img
              src={logoSrc}
              alt={logoAlt || 'logo'}
              className='object-contain w-40 mx-auto lg:mx-0'
            />
          </div>
        )}
        {title && (
          <h1 className='mb-4 text-3xl font-bold text-zatobox-900'>{title}</h1>
        )}
        {description && (
          <p className='leading-relaxed text-zatobox-600'>{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};

export default LoginContainer;
