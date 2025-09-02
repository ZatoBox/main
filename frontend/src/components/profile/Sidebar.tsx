import React from 'react';

type Section = { id: string; name: string };

type Props = {
  sections: Section[];
  active: string;
  onSelect: (id: string) => void;
};

const Sidebar: React.FC<Props> = ({ sections, active, onSelect }) => {
  return (
    <div className='sticky p-4 border rounded-lg shadow-sm bg-zatobox-50 border-zatobox-200 top-24'>
      <nav className='space-y-2'>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
              active === s.id
                ? 'bg-zatobox-100 text-zatobox-900 border border-zatobox-200'
                : 'text-zatobox-600 hover:bg-zatobox-100 hover:text-zatobox-900'
            }`}
          >
            <span className='text-sm font-medium'>{s.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
