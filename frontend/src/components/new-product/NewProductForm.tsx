'use client';

import React, { useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';

type Values = {
  productType: string;
  name: string;
  description: string;
  location: string;
  unit: string;
  weight: string;
  price: string;
  inventoryQuantity: string;
  lowStockAlert: string;
  sku: string;
  category: string;
};

type Option = { label: string; value: string };

type Props = {
  initialValues?: Partial<Values>;
  existingCategories: string[];
  unitOptions: Option[];
  productTypeOptions: Option[];
  onSubmit: (values: Values) => void;
  submitSignal: number;
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  unit: Yup.string().required('Unit is required'),
  price: Yup.number()
    .typeError('Price must be a number')
    .positive('Price must be greater than 0')
    .required('Price is required'),
  inventoryQuantity: Yup.number()
    .typeError('Inventory must be a number')
    .integer('Inventory must be an integer')
    .min(0, 'Inventory must be 0 or more')
    .required('Inventory is required'),
  category: Yup.string().required('Category is required'),
});

const NewProductForm: React.FC<Props> = ({
  initialValues,
  existingCategories,
  unitOptions,
  productTypeOptions,
  onSubmit,
  submitSignal,
}) => {
  const formikSubmitRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    if (submitSignal && formikSubmitRef.current) formikSubmitRef.current();
  }, [submitSignal]);

  const defaults: Values = {
    productType:
      (initialValues && initialValues.productType) || 'Physical Product',
    name: (initialValues && initialValues.name) || '',
    description: (initialValues && initialValues.description) || '',
    location: (initialValues && initialValues.location) || '',
    unit: (initialValues && initialValues.unit) || 'Per item',
    weight: (initialValues && initialValues.weight) || '',
    price: (initialValues && initialValues.price) || '',
    inventoryQuantity: (initialValues && initialValues.inventoryQuantity) || '',
    lowStockAlert: (initialValues && initialValues.lowStockAlert) || '',
    sku: (initialValues && initialValues.sku) || '',
    category: (initialValues && initialValues.category) || '',
  };

  return (
    <Formik
      initialValues={defaults}
      validationSchema={validationSchema}
      onSubmit={(values: Values, helpers: FormikHelpers<Values>) => {
        onSubmit(values);
        helpers.setSubmitting(false);
      }}
    >
      {(formik) => {
        formikSubmitRef.current = formik.submitForm;
        return (
          <Form>
            <div className='p-6 space-y-4 border rounded-lg shadow-sm bg-zatobox-50 border-zatobox-200'>
              <div>
                <label className='block mb-2 text-sm font-medium text-zatobox-900'>
                  Product Name *
                </label>
                <Field
                  name='name'
                  className='w-full p-3 border rounded-lg border-zatobox-200 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 text-zatobox-900'
                />
                <div className='mt-1 text-xs text-red-500'>
                  <ErrorMessage name='name' />
                </div>
              </div>

              <div>
                <label className='block mb-2 text-sm font-medium text-zatobox-900'>
                  Description
                </label>
                <Field
                  as='textarea'
                  name='description'
                  rows={3}
                  className='w-full p-3 border rounded-lg resize-none border-zatobox-200 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 text-zatobox-900'
                />
              </div>
            </div>

            <div className='p-6 border rounded-lg shadow-sm bg-zatobox-50 border-zatobox-200'>
              <label className='block mb-2 text-sm font-medium text-zatobox-900'>
                Locations
              </label>
              <Field
                name='location'
                className='w-full p-3 border rounded-lg border-zatobox-200 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 text-zatobox-900'
              />
            </div>

            <div className='p-6 border rounded-lg shadow-sm bg-zatobox-50 border-zatobox-200'>
              <h3 className='mb-4 text-lg font-medium text-zatobox-900'>
                Categorization
              </h3>
              <div className='space-y-2'>
                {existingCategories.map((category) => (
                  <div key={category} className='flex items-center space-x-2'>
                    <input
                      type='radio'
                      name='category'
                      value={category}
                      checked={formik.values.category === category}
                      onChange={() =>
                        formik.setFieldValue('category', category)
                      }
                      className='w-4 h-4 border-gray-300 rounded text-complement focus:ring-complement'
                    />
                    <label className='text-sm text-zatobox-900'>
                      {category}
                    </label>
                  </div>
                ))}
                <div className='mt-1 text-xs text-red-500'>
                  <ErrorMessage name='category' />
                </div>
              </div>
            </div>

            <div className='p-6 border rounded-lg shadow-sm bg-zatobox-50 border-zatobox-200'>
              <h3 className='mb-4 text-lg font-medium text-zatobox-900'>
                Units
              </h3>
              <div className='space-y-4'>
                <div>
                  <label className='block mb-2 text-sm font-medium text-zatobox-900'>
                    Unit *
                  </label>
                  <Field
                    as='select'
                    name='unit'
                    className='w-full p-3 border rounded-lg border-zatobox-200 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 text-zatobox-900'
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
                  <label className='block mb-2 text-sm font-medium text-text-primary'>
                    Product Type
                  </label>
                  <Field
                    as='select'
                    name='productType'
                    className='w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                  >
                    {productTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Field>
                </div>

                <div>
                  <label className='block mb-2 text-sm font-medium text-text-primary'>
                    Weight (kg)
                  </label>
                  <Field
                    name='weight'
                    type='number'
                    step='0.01'
                    className='w-full p-3 border rounded-lg border-zatobox-200 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 text-zatobox-900'
                  />
                </div>

                <div>
                  <label className='block mb-2 text-sm font-medium text-text-primary'>
                    Price (required)
                  </label>
                  <div className='relative'>
                    <span className='absolute transform -translate-y-1/2 left-3 top-1/2 text-text-secondary'>
                      $
                    </span>
                    <Field
                      name='price'
                      type='number'
                      step='0.01'
                      className='w-full py-3 pl-8 pr-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                    />
                  </div>
                  <div className='mt-1 text-xs text-red-500'>
                    <ErrorMessage name='price' />
                  </div>
                </div>
              </div>
            </div>

            <div className='p-6 border rounded-lg shadow-sm bg-zatobox-50 border-zatobox-200'>
              <h3 className='mb-4 text-lg font-medium text-zatobox-900'>
                Inventory
              </h3>
              <div className='space-y-4'>
                <div>
                  <label className='block mb-2 text-sm font-medium text-text-primary'>
                    Inventory quantity *
                  </label>
                  <Field
                    name='inventoryQuantity'
                    type='number'
                    className='w-full p-3 border rounded-lg border-zatobox-200 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 text-zatobox-900'
                  />
                  <div className='mt-1 text-xs text-red-500'>
                    <ErrorMessage name='inventoryQuantity' />
                  </div>
                </div>

                <div>
                  <label className='block mb-2 text-sm font-medium text-text-primary'>
                    Low stock alert
                  </label>
                  <Field
                    name='lowStockAlert'
                    type='number'
                    className='w-full p-3 border rounded-lg border-zatobox-200 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 text-zatobox-900'
                  />
                </div>

                <div>
                  <label className='block mb-2 text-sm font-medium text-text-primary'>
                    SKU
                  </label>
                  <Field
                    name='sku'
                    className='w-full p-3 border rounded-lg border-zatobox-200 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 text-zatobox-900'
                  />
                </div>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default NewProductForm;
