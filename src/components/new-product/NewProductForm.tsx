'use client';

import React from 'react';
import { Field, ErrorMessage } from 'formik';

type Props = {
  formik: any;
  unitOptions: { label: string; value: string }[];
  productTypeOptions: { label: string; value: string }[];
};

const NewProductForm: React.FC<Props> = ({
  formik,
  unitOptions,
  productTypeOptions,
}) => {
  return (
    <div className='space-y-6'>
      <div className='p-6 border rounded-lg shadow-sm bg-white border-[#CBD5E1]'>
        <h3 className='mb-4 text-lg font-medium text-black'>Units</h3>
        <div className='space-y-4'>
          <div>
            <label className='block mb-2 text-sm font-medium text-black'>
              Precio *
            </label>
            <Field
              name='price'
              type='number'
              step='0.01'
              className='w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent'
            />
            <div className='mt-1 text-xs text-red-500'>
              <ErrorMessage name='price' />
            </div>
          </div>
          <div>
            <label className='block mb-2 text-sm font-medium text-black'>
              Unidad *
            </label>
            <Field
              as='select'
              name='unit'
              className='w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent'
            >
              {unitOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Field>
            <div className='mt-1 text-xs text-red-500'>
              <ErrorMessage name='unit' />
            </div>
          </div>

          <div>
            <label className='block mb-2 text-sm font-medium text-black'>
              Tipo de Producto
            </label>
            <Field
              as='select'
              name='productType'
              className='w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent'
            >
              {productTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Field>
          </div>

          <div>
            <label className='block mb-2 text-sm font-medium text-black'>
              Peso (kg)
            </label>
            <Field
              name='weight'
              type='number'
              step='0.01'
              className='w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent'
            />
          </div>
        </div>
      </div>

      <div className='p-6 border rounded-lg shadow-sm bg-white border-[#CBD5E1]'>
        <h3 className='mb-4 text-lg font-medium text-black'>Inventory</h3>
        <div className='space-y-4'>
          <div>
            <label className='block mb-2 text-sm font-medium text-black'>
              Cantidad en inventario *
            </label>
            <Field
              name='inventoryQuantity'
              type='number'
              className='w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent'
            />
            <div className='mt-1 text-xs text-red-500'>
              <ErrorMessage name='inventoryQuantity' />
            </div>
          </div>

          <div>
            <label className='block mb-2 text-sm font-medium text-black'>
              Alerta de bajo stock
            </label>
            <Field
              name='lowStockAlert'
              type='number'
              className='w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent'
            />
          </div>

          <div>
            <label className='block mb-2 text-sm font-medium text-black'>
              SKU
            </label>
            <Field
              name='sku'
              className='w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent'
            />
          </div>
        </div>
      </div>

      <div className='p-6 border rounded-lg shadow-sm bg-white border-[#CBD5E1]'>
        <label className='block mb-2 text-sm font-medium text-black'>
          Ubicación
        </label>
        <Field
          name='location'
          className='w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent'
        />
      </div>
    </div>
  );
};

export default NewProductForm;
