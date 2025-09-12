'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/new-product/Header';
import ImagesUploader from '@/components/new-product/ImagesUploader';
import NewProductForm from '@/components/new-product/NewProductForm';
import { useAuth } from '@/context/auth-store';
import { productsAPI } from '@/services/api.service';
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
  const [submitSignal, setSubmitSignal] = useState(0);

  const existingCategories = [
    'Furniture',
    'Textiles',
    'Lighting',
    'Electronics',
    'Decoration',
    'Office',
    'Gaming',
  ];

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
        description: values.description || null,
        price: Number(values.price),
        stock: Number(values.inventoryQuantity),
        unit: values.unit,
        category_id: values.category || undefined,
        sku: values.sku || undefined,
        product_type: values.productType || undefined,
        weight: values.weight ? Number(values.weight) : undefined,
        min_stock: values.lowStockAlert
          ? Number(values.lowStockAlert)
          : undefined,
      };

      Object.keys(payload).forEach((k) => {
        if (payload[k] === undefined) delete payload[k];
      });

      const res = await productsAPI.create(payload as any);
      const newId = (res as any).product?.id;
      if (newId && files.length > 0) {
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
    category: Yup.string().required('Category is required'),
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
    category: '',
  };

  return (
    <div className='min-h-screen bg-bg-main'>
      <Header
        onBack={() => router.push('/inventory')}
        onSave={() => setSubmitSignal((s) => s + 1)}
        saving={saving}
        error={error}
      />

      <div className='px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(formik) => (
            <Form>
              <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
                <div className='space-y-6'>
                  <ImagesUploader
                    files={files}
                    onAddFiles={handleAddFiles}
                    onRemove={handleRemoveFile}
                  />

                  <ProductInfoForm
                    formik={formik}
                    existingCategories={existingCategories}
                  />
                </div>

                <NewProductForm
                  formik={formik}
                  unitOptions={unitOptions}
                  productTypeOptions={productTypeOptions}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default NewProductPage;
