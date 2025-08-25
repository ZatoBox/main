import React from 'react';

type Section = { id: string; name: string };

type Props = {
  sections: Section[];
  active: string;
  onSelect: (id: string) => void;
};

const Sidebar: React.FC<Props> = ({ sections, active, onSelect }) => {
  return (
    <div className='sticky p-4 border rounded-lg shadow-sm bg-bg-surface border-divider top-24'>
      <nav className='space-y-2'>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
              active === s.id
                ? 'bg-complement-50 text-complement-700 border border-complement-200'
                : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
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
