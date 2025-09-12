'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/new-product/Header';
import ImagesUploader from '@/components/new-product/ImagesUploader';
import NewProductForm from '@/components/new-product/NewProductForm';
import { useAuth } from '@/context/auth-store';
import { productsAPI, categoriesAPI } from '@/services/api.service';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ProductInfoForm from '@/components/new-product/ProductInfoForm';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const MAX_FILES = 4;
const MAX_SIZE = 5 * 1024 * 1024;

const NewProductPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);

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

  const unitOptions = [
    { label: 'Per item', value: 'Per item' },
    { label: 'Per kilogram', value: 'Per kilogram' },
    { label: 'Per liter', value: 'Per liter' },
    { label: 'Per meter', value: 'Per meter' },
  ];

  const productTypeOptions = [
    { label: 'Physical Product', value: 'Physical Product' },
    { label: 'Service', value: 'Service' },
    { label: 'Digital', value: 'Digital' },
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
      const payload: Record<string, unknown> = {
        name: values.name,
        description:
          values.description && values.description.trim() !== ''
            ? values.description
            : '',
        price: Number(values.price),
        stock: Number(values.inventoryQuantity),
        unit: values.unit,
        product_type: values.productType || 'Physical Product',
        status: 'active',
        sku:
          values.sku && values.sku.trim() !== ''
            ? values.sku
            : 'SKU-' + Date.now(),
        min_stock: values.lowStockAlert ? Number(values.lowStockAlert) : 0,
        category_ids: Array.isArray(values.category_ids)
          ? values.category_ids
          : [],
        weight: values.weight ? Number(values.weight) : undefined,
        localization:
          values.location && values.location.trim() !== ''
            ? values.location
            : undefined,
      };

      Object.keys(payload).forEach((k) => {
        if (payload[k] === undefined) delete payload[k];
      });

      const res = await productsAPI.create(payload as any);
      const productObj = (res as any).product ? (res as any).product : res;
      const newId = productObj?.id;
      if (!newId) {
        setError('No se pudo obtener el ID del producto');
        setSaving(false);
        return;
      }
      if (files.length > 0) {
        await productsAPI.addImages(newId, files);
      }
      router.push('/inventory');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error creating product');
    } finally {
      setSaving(false);
    }
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
    category_ids: Yup.array()
      .of(Yup.string().uuid('Invalid id'))
      .min(1, 'At least one category')
      .required('At least one category'),
  });

  const initialValues = {
    productType: 'Physical Product',
    name: '',
    description: '',
    location: '',
    unit: 'Per item',
    weight: '',
    price: '',
    inventoryQuantity: '',
    lowStockAlert: '',
    sku: '',
    category_ids: [],
  };

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
                    <ProductInfoForm formik={formik} categories={categories} />
                  </div>
                  <NewProductForm
                    formik={formik}
                    unitOptions={unitOptions}
                    productTypeOptions={productTypeOptions}
                  />
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
