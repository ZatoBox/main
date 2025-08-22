'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/new-product/Header';
import ImagesUploader from '@/components/new-product/ImagesUploader';
import NewProductForm from '@/components/new-product/NewProductForm';
import { useAuth } from '@/context/AuthContext';
import { productsAPI } from '@/services/api.service';

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
    const arr = Array.from(f).filter(
      (file) => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    );
    setFiles((prev) => [...prev, ...arr]);
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
        unit_name: values.unit,
        category: values.category || undefined,
        sku: values.sku || undefined,
        product_type: values.productType || undefined,
        weight: values.weight ? Number(values.weight) : undefined,
        min_stock: values.lowStockAlert
          ? Number(values.lowStockAlert)
          : undefined,
      };

      const res = await productsAPI.create(payload as any);
      const newId = (res as any).product?.id;
      if (newId && files.length > 0) {
        const form = new FormData();
        files.forEach((f) => form.append('images', f));
        await productsAPI.uploadImages(newId, form);
      }

      router.push('/inventory');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error creating product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='min-h-screen pt-16 bg-bg-main'>
      <Header
        onBack={() => router.push('/inventory')}
        onSave={() => setSubmitSignal((s) => s + 1)}
        saving={saving}
        error={error}
      />

      <div className='px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
          <div className='space-y-6'>
            <NewProductForm
              existingCategories={existingCategories}
              unitOptions={unitOptions}
              productTypeOptions={productTypeOptions}
              onSubmit={onSubmit}
              submitSignal={submitSignal}
            />
            <ImagesUploader
              files={files}
              onAddFiles={handleAddFiles}
              onRemove={handleRemoveFile}
            />
          </div>

          <div className='space-y-6'>
            <div className='p-6 border rounded-lg shadow-sm bg-bg-surface border-divider'>
              <label className='block mb-2 text-sm font-medium text-text-primary'>
                Locations
              </label>
              <div className='text-sm text-text-secondary'>
                Set location in the form on the left.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProductPage;
