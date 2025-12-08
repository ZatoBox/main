'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/new-product/Header';
import ImagesUploader from '@/components/new-product/ImagesUploader';
import { productsAPI } from '@/services/api.service';
import { useAuth } from '@/context/auth-store';
import { uploadMultipleImages } from '@/services/upload.service';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from '@/hooks/use-translation';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const MAX_FILES = 4;
const MAX_SIZE = 5 * 1024 * 1024;

const NewProductPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [unlimitedStock, setUnlimitedStock] = useState(false);
  const { t } = useTranslation();

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
      setError(t('newProduct.errors.loginRequired'));
      setSaving(false);
      return;
    }

    try {
      const imageUrls: string[] = [];

      if (files.length > 0) {
        try {
          const urls = await uploadMultipleImages(files);
          imageUrls.push(...urls);
        } catch (uploadError) {
          console.error('Error uploading images:', uploadError);
          setError(t('newProduct.errors.uploadImages'));
          setSaving(false);
          return;
        }
      }

      const categories: string[] = [];
      if (values.category && String(values.category).trim() !== '') {
        categories.push(String(values.category).trim());
      }

      const payload = {
        name: values.name,
        description:
          values.description && values.description.trim() !== ''
            ? values.description
            : null,
        price: Number(values.price),
        stock: unlimitedStock ? 0 : Number(values.stock),
        unlimited_stock: unlimitedStock,
        categories,
        sku: values.sku && values.sku.trim() !== '' ? values.sku : null,
        images: imageUrls,
      };

      await productsAPI.create(payload);
      router.push('/inventory');
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : t('newProduct.errors.createProduct')
      );
    } finally {
      setSaving(false);
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('newProduct.validation.nameRequired')),
    price: Yup.number()
      .typeError(t('newProduct.validation.priceNumber'))
      .min(0, t('newProduct.validation.priceMin'))
      .required(t('newProduct.validation.priceRequired')),
    stock: Yup.number()
      .typeError(t('newProduct.validation.stockNumber'))
      .integer(t('newProduct.validation.stockInteger'))
      .min(0, t('newProduct.validation.stockMin'))
      .when([], {
        is: () => !unlimitedStock,
        then: (schema) =>
          schema.required(t('newProduct.validation.stockRequired')),
        otherwise: (schema) => schema.notRequired(),
      }),
  });

  const initialValues = {
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    sku: '',
  } as any;

  return (
    <div className="min-h-screen bg-bg-main">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {(formik) => (
          <>
            <Header
              onBack={() => router.push('/inventory')}
              onSave={formik.handleSubmit}
              saving={saving}
              error={error}
            />
            <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <Form>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  <div className="space-y-6">
                    <ImagesUploader
                      files={files}
                      onAddFiles={handleAddFiles}
                      onRemove={handleRemoveFile}
                      isUploading={saving}
                    />
                    <div className="p-6 border rounded-lg shadow-sm bg-white border-[#CBD5E1]">
                      <div className="space-y-4">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-black">
                            {t('newProduct.labels.description')}
                          </label>
                          <textarea
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            rows={4}
                            className="w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-black">
                            {t('newProduct.labels.category')}
                          </label>
                          <input
                            name="category"
                            value={formik.values.category}
                            onChange={formik.handleChange}
                            className="w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-black">
                            {t('newProduct.labels.sku')}
                          </label>
                          <input
                            name="sku"
                            value={formik.values.sku}
                            onChange={formik.handleChange}
                            className="w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="p-6 border rounded-lg shadow-sm bg-white border-[#CBD5E1]">
                      <div className="space-y-4">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-black">
                            {t('newProduct.labels.name')}
                          </label>
                          <input
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            className="w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent"
                          />
                          {formik.errors.name && (
                            <div className="mt-1 text-xs text-red-500">
                              {formik.errors.name as any}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-black">
                            {t('newProduct.labels.price')}
                          </label>
                          <input
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            className="w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent"
                          />
                          {formik.errors.price && (
                            <div className="mt-1 text-xs text-red-500">
                              {formik.errors.price as any}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="flex items-center mb-3">
                            <input
                              type="checkbox"
                              checked={unlimitedStock}
                              onChange={(e) => {
                                setUnlimitedStock(e.target.checked);
                                if (e.target.checked) {
                                  formik.setFieldValue('stock', '');
                                }
                              }}
                              className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-black">
                              {t('newProduct.labels.unlimitedStock')}
                            </span>
                          </label>
                          {!unlimitedStock && (
                            <>
                              <label className="block mb-2 text-sm font-medium text-black">
                                {t('newProduct.labels.stock')}
                              </label>
                              <input
                                name="stock"
                                type="number"
                                min="0"
                                value={formik.values.stock}
                                onChange={formik.handleChange}
                                className="w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent"
                              />
                              {formik.errors.stock && (
                                <div className="mt-1 text-xs text-red-500">
                                  {formik.errors.stock as any}
                                </div>
                              )}
                            </>
                          )}
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
