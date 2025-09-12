'use client';

import React, { useState, useMemo } from 'react';
import { Field, ErrorMessage } from 'formik';

type Category = { id: string; name: string };
type Props = { formik: any; categories: Category[] };

const ProductInfoForm: React.FC<Props> = ({ formik, categories }) => {
  const [query, setQuery] = useState('');
  const selected: string[] = formik.values.category_ids || [];
  const filtered = useMemo(
    () =>
      categories.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase())
      ),
    [categories, query]
  );
  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((v) => v !== id)
      : [...selected, id];
    formik.setFieldValue('category_ids', next);
  };
  return (
    <div className='space-y-6'>
      <div className='p-6 space-y-4 border rounded-lg shadow-sm  bg-white border-[#CBD5E1]'>
        <div>
          <label className='block mb-2 text-sm font-medium text-black'>
            Product Name *
          </label>
          <Field
            name='name'
            className='w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent'
          />
          <div className='mt-1 text-xs text-red-500'>
            <ErrorMessage name='name' />
          </div>
        </div>

        <div>
          <label className='block mb-2 text-sm font-medium text-black'>
            Description
          </label>
          <Field
            as='textarea'
            name='description'
            rows={3}
            className='w-full p-3 border rounded-lg resize-none border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent'
          />
        </div>
      </div>

      <div className='p-6 border rounded-lg shadow-sm bg-white border-[#CBD5E1] space-y-4'>
        <h3 className='text-lg font-medium text-black'>Categories</h3>
        <input
          type='text'
          placeholder='Search categories...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className='w-full p-2 text-sm border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent'
        />
        <div className='max-h-48 overflow-auto pr-1 space-y-1 custom-scrollbar'>
          {filtered.map((c) => {
            const isSelected = selected.includes(c.id);
            return (
              <button
                type='button'
                key={c.id}
                onClick={() => toggle(c.id)}
                className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-md text-sm border transition-colors ${
                  isSelected
                    ? 'bg-primary/10 border-primary text-black'
                    : 'border-[#CBD5E1] hover:border-primary hover:bg-primary/5 text-gray-600'
                }`}
              >
                <span className='truncate'>{c.name}</span>
                {isSelected && (
                  <span className='ml-2 text-xs font-medium text-primary'>
                    ✓
                  </span>
                )}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className='px-2 py-4 text-xs text-center text-gray-400'>
              No matches
            </div>
          )}
        </div>
        <div className='flex flex-wrap gap-2'>
          {selected.map((id) => {
            const cat = categories.find((c) => c.id === id);
            if (!cat) return null;
            return (
              <span
                key={id}
                className='inline-flex items-center px-2 py-1 text-xs bg-primary/10 text-primary rounded-md border border-primary'
              >
                {cat.name}
                <button
                  type='button'
                  className='ml-1 text-primary/70 hover:text-primary'
                  onClick={() => toggle(id)}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
        <div className='mt-1 text-xs text-red-500'>
          <ErrorMessage name='category_ids' />
        </div>
      </div>
    </div>
  );
};

export default ProductInfoForm;
