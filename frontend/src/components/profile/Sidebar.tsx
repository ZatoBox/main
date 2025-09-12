import React from 'react';

type Section = { id: string; name: string };

type Props = {
  sections: Section[];
  active: string;
  onSelect: (id: string) => void;
};

const Sidebar: React.FC<Props> = ({ sections, active, onSelect }) => {
  return (
    <div className='sticky p-4 border rounded-lg shadow-sm bg-[#FFFFFF] border-[#CBD5E1] top-[64px]'>
      <nav className='space-y-2'>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left  ${
              active === s.id
               ? "bg-[#FBEFCA] text-[#000000] border border-[#F6DE91]"
                      : "text-[#888888] hover:bg-[#F6DE91] hover:text-[#000000]"
                  } border-b  border-[#F6DE91] shadow-sm`}
          >
            <span className='text-sm font-medium'>{s.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
