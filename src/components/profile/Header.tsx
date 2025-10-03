import React from 'react';

type Props = {
  onBack: () => void;
  title?: string;
};

const Header: React.FC<Props> = ({ onBack, title = 'Mi Perfil' }) => {
  return (
    <div className="border-b shadow-sm bg-[#FFFFFF] border-[#CBD5E1]">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 transition-colors rounded-full hover:bg-zatobox-100 md:hidden"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-zatobox-900"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-[#000000]">{title}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
