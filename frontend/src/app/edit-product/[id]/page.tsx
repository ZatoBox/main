'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { productsAPI, categoriesAPI } from '@/services/api.service';
import { useAuth } from '@/context/auth-store';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FaRegFolder } from 'react-icons/fa6';
import { IoMdArrowRoundBack } from 'react-icons/io';
import ImagesUploader from '@/components/new-product/ImagesUploader';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const MAX_FILES = 4;
const MAX_SIZE = 5 * 1024 * 1024;

const EditProductPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, user } = useAuth();
  const id = (params as any)?.id as string | undefined;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [productData, setProductData] = useState<any>(null);

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoadingCategories(true);
      try {
        const res = await categoriesAPI.list();
        if (active && res.success) setCategories(res.categories);
      } catch {
      } finally {
        if (active) setLoadingCategories(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!id) {
      setError('Product ID is required');
      setLoading(false);
      return;
    }
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productsAPI.getById(id!);
      if (res && res.success && res.product) {
        const product = res.product;
        setProductData(product);
        setExistingImages(
          product.medias
            ?.filter(
              (m: any) => m.public_url && m.mime_type?.startsWith('image/')
            )
            .map((m: any) => m.public_url) || []
        );
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading product');
    } finally {
      setLoading(false);
    }
  };

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
      setError('You must log in to update products');
      setSaving(false);
      return;
    }

    try {
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
        recurring_interval:
          values.billingInterval === 'once' ? null : values.billingInterval,
        prices,
        metadata,
      };

      await productsAPI.update(id!, payload as any);
      router.push('/inventory');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error updating product');
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

  if (loading) {
    return <div className='min-h-screen bg-bg-main'>Loading product...</div>;
  }

  if (!productData) {
    return <div className='min-h-screen bg-bg-main'>Product not found</div>;
  }

  const primaryPrice = productData.prices?.[0];
  const currentPrice = primaryPrice ? primaryPrice.price_amount / 100 : 0;
  const currentInterval = productData.recurring_interval || 'once';
  const currentStock = productData.metadata?.quantity || 0;
  const currentCategory = productData.metadata?.category || '';
  const currentSubcategory = productData.metadata?.subcategory || '';
  const currentTags = productData.metadata?.tags || '';

  const initialValues = {
    name: productData.name || '',
    description: productData.description || '',
    price: String(currentPrice),
    stock: String(currentStock),
    billingInterval: currentInterval,
    category: currentCategory,
    subcategory: currentSubcategory,
    tags: currentTags,
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
            <div className='flex flex-col sm:flex-row items-center justify-between h-auto sm:h-16 px-4 sm:px-6 py-4 sm:py-0 border-b border-[#CBD5E1] bg-white gap-4 sm:gap-0'>
              <div className='flex items-center w-full sm:w-auto gap-2'>
                <button
                  onClick={() => router.push('/inventory')}
                  className='p-2 transition-colors rounded-full hover:bg-gray-50 flex-shrink-0'
                >
                  <IoMdArrowRoundBack className='w-6 h-6 text-[#F88612]' />
                </button>
                <h1 className='text-xl font-semibold text-[#F88612] ml-2 sm:ml-4 md:ml-0'>
                  Edit Product
                </h1>
              </div>
              <div className='flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto'>
                <div className='w-full sm:w-[158px] h-[40px] flex items-center justify-center bg-white rounded-lg border border-[#CBD5E1] gap-2'>
                  <span className='text-black font-medium'>Status:</span>
                  <span className='text-[#F88612] font-medium'>Active</span>
                </div>
                {error && <div className='text-sm text-red-500'>{error}</div>}
                <button
                  type='button'
                  onClick={() => formik.handleSubmit()}
                  disabled={saving}
                  className={`bg-[#F88612] hover:bg-[#D9740F] text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-1 w-full sm:w-[82px] h-[40px] ${
                    saving ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {saving ? (
                    <div className='w-4 h-4 border-b-2 border-white rounded-full animate-spin'></div>
                  ) : (
                    <>
                      <FaRegFolder className='w-4 h-4 self-center' />
                      <span>Save</span>
                    </>
                  )}
                </button>
              </div>
            </div>
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
                            Stock *
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

export default EditProductPage;
