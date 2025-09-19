'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/new-product/Header';
import ImagesUploader from '@/components/new-product/ImagesUploader';
import { productsAPI } from '@/services/api.service';
import { useAuth } from '@/context/auth-store';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const MAX_FILES = 4;
const MAX_SIZE = 5 * 1024 * 1024;

const NewProductPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const billingOptions = [
    { label: 'One-time', value: 'once' },
    { label: 'Monthly', value: 'month' },
    { label: 'Yearly', value: 'year' },
  ];

  const handleAddFiles = (f: FileList | null) => {
    if (!f) return;
    let current = [...files];
    for (const file of Array.from(f)) {
      if (current.length >= MAX_FILES) break;
      if (!ALLOWED_TYPES.includes(file.type)) continue;
      if (file.size > MAX_SIZE) continue;
      current.push(file);
    }
    setFiles(current.slice(0, MAX_FILES));
  };

  const handleRemoveFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  const onSubmit = async (values: any) => {
    setSaving(true);
    setError(null);
    if (!isAuthenticated) {
      setError('You must log in to create products');
      setSaving(false);
      return;
    }

    try {
      if (!user?.polar_organization_id) {
        setError('Polar organization ID is required in profile');
        setSaving(false);
        return;
      }

      const organizationId = user.polar_organization_id;
      const prices = [
        {
          amount_type: 'fixed',
          price_currency: 'usd',
          price_amount: Math.round(Number(values.price) * 100),
          type: values.billingInterval === 'once' ? 'one_time' : 'recurring',
          recurring_interval:
            values.billingInterval === 'once'
              ? undefined
              : values.billingInterval,
          legacy: false,
          is_archived: false,
        },
      ];

      const metadata: any = { quantity: Number(values.stock || 0) };
      if (values.category && String(values.category).trim() !== '')
        metadata.category = String(values.category).trim();
      if (values.subcategory && String(values.subcategory).trim() !== '')
        metadata.subcategory = String(values.subcategory).trim();
      if (values.tags && String(values.tags).trim() !== '') {
        const arr = String(values.tags)
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t.length > 0);
        if (arr.length > 0) metadata.tags = arr.join(',');
      }

      const payload: Record<string, unknown> = {
        name: values.name,
        description:
          values.description && values.description.trim() !== ''
            ? values.description
            : undefined,
        organization_id: organizationId,
        recurring_interval:
          values.billingInterval === 'once' ? null : values.billingInterval,
        prices,
        metadata,
      };

      const body: any = { ...payload };
      if (files.length > 0) {
        body.images = files.slice(0, 1);
      }

      await productsAPI.create(body as any, organizationId);
      router.push('/inventory');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error creating product');
    } finally {
      setSaving(false);
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    price: Yup.number()
      .typeError('Price must be a number')
      .positive('Price must be greater than 0')
      .required('Price is required'),
    stock: Yup.number()
      .typeError('Stock must be a number')
      .integer('Stock must be an integer')
      .min(0, 'Stock must be 0 or more')
      .required('Stock is required'),
    billingInterval: Yup.string()
      .oneOf(['once', 'month', 'year'])
      .required('Billing interval is required'),
  });

  const initialValues = {
    name: '',
    description: '',
    price: '',
    stock: '',
    billingInterval: 'once',
    category: '',
    subcategory: '',
    tags: '',
  } as any;

  return (
    <div className='min-h-screen bg-bg-main'>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <>
            <Header
              onBack={() => router.push('/inventory')}
              onSave={formik.handleSubmit}
              saving={saving}
              error={error}
            />
            <div className='px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8'>
              <Form>
                <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
                  <div className='space-y-6'>
                    <ImagesUploader
                      files={files}
                      onAddFiles={handleAddFiles}
                      onRemove={handleRemoveFile}
                    />
                    <div className='p-6 border rounded-lg shadow-sm bg-white border-[#CBD5E1]'>
                      <div className='space-y-4'>
                        <div>
                          <label className='block mb-2 text-sm font-medium text-black'>
                            Description
                          </label>
                          <textarea
                            name='description'
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            className='w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent'
                          />
                        </div>
                        <div>
                          <label className='block mb-2 text-sm font-medium text-black'>
                            Category
                          </label>
                          <input
                            name='category'
                            value={formik.values.category}
                            onChange={formik.handleChange}
                            className='w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent'
                          />
                        </div>
                        <div>
                          <label className='block mb-2 text-sm font-medium text-black'>
                            Subcategory
                          </label>
                          <input
                            name='subcategory'
                            value={formik.values.subcategory}
                            onChange={formik.handleChange}
                            className='w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent'
                          />
                        </div>
                        <div>
                          <label className='block mb-2 text-sm font-medium text-black'>
                            Tags (comma separated)
                          </label>
                          <input
                            name='tags'
                            value={formik.values.tags}
                            onChange={formik.handleChange}
                            className='w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='space-y-6'>
                    <div className='p-6 border rounded-lg shadow-sm bg-white border-[#CBD5E1]'>
                      <div className='space-y-4'>
                        <div>
                          <label className='block mb-2 text-sm font-medium text-black'>
                            Name *
                          </label>
                          <input
                            name='name'
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            className='w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent'
                          />
                          <div className='mt-1 text-xs text-red-500'>
                            {formik.errors.name as any}
                          </div>
                        </div>
                        <div>
                          <label className='block mb-2 text-sm font-medium text-black'>
                            Billing *
                          </label>
                          <select
                            name='billingInterval'
                            value={formik.values.billingInterval}
                            onChange={formik.handleChange}
                            className='w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent'
                          >
                            {billingOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <div className='mt-1 text-xs text-red-500'>
                            {formik.errors.billingInterval as any}
                          </div>
                        </div>
                        <div>
                          <label className='block mb-2 text-sm font-medium text-black'>
                            Price *
                          </label>
                          <input
                            name='price'
                            type='number'
                            step='0.01'
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            className='w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent'
                          />
                          <div className='mt-1 text-xs text-red-500'>
                            {formik.errors.price as any}
                          </div>
                        </div>
                        <div>
                          <label className='block mb-2 text-sm font-medium text-black'>
                            Initial Stock *
                          </label>
                          <input
                            name='stock'
                            type='number'
                            value={formik.values.stock}
                            onChange={formik.handleChange}
                            className='w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent'
                          />
                          <div className='mt-1 text-xs text-red-500'>
                            {formik.errors.stock as any}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </>
        )}
      </Formik>
    </div>
  );
};

export default NewProductPage;
