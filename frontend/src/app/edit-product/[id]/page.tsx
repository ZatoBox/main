'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { productsAPI } from '@/services/api.service';
import { Product } from '@/types/index';
import { useAuth } from '@/context/auth-store';
import EditHeader from '@/components/edit-product/EditHeader';
import ProductForm from '@/components/edit-product/ProductForm';
import ImagesUploader from '@/components/edit-product/ImagesUploader';
import Categorization from '@/components/edit-product/Categorization';
import InventoryPanel from '@/components/edit-product/InventoryPanel';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const MAX_FILES = 4;
const MAX_SIZE = 5 * 1024 * 1024;

const EditProductPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const id = (params as any)?.id as string | undefined;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    productType: '',
    name: '',
    description: '',
    location: '',
    weight: '',
    price: '',
    inventoryQuantity: '',
    lowStockAlert: '',
    sku: '',
  });
  const [originalProduct, setOriginalProduct] = useState<Product | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const [status, setStatus] = useState<'active' | 'inactive' | ''>('');
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const existingCategories = [
    'Furniture',
    'Textiles',
    'Lighting',
    'Electronics',
    'Decoration',
    'Office',
    'Gaming',
  ];

  useEffect(() => {
    if (!id || typeof id !== 'string') {
      setError('Invalid product id');
      setLoading(false);
      return;
    }
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productsAPI.getById(id!);
      const prod = (res as any).product as Product;
      if (!prod) {
        setError('Product not found');
        setLoading(false);
        return;
      }
      setOriginalProduct(prod);
      setStatus((prod.status as 'active' | 'inactive') ?? '');
      setFormData({
        productType: prod.product_type ?? '',
        name: prod.name ?? '',
        description: prod.description ?? '',
        location: prod.localization ?? '',
        weight: prod.weight != null ? String(prod.weight) : '',
        price: prod.price != null ? String(prod.price) : '',
        inventoryQuantity: prod.stock != null ? String(prod.stock) : '',
        lowStockAlert: prod.min_stock != null ? String(prod.min_stock) : '',
        sku: prod.sku ?? '',
      });
      setSelectedCategories(prod.category_id ? [prod.category_id] : []);
      setExistingImages((prod.images || []).slice(0, MAX_FILES));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading product');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    setError(null);
    if (!isAuthenticated) {
      setError('You must be logged in to update products');
      setSaving(false);
      return;
    }

    if (!formData.name || !formData.price) {
      setError('Name and price are required');
      setSaving(false);
      return;
    }

    const priceNum = Number(formData.price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      setError('Price must be greater than 0');
      setSaving(false);
      return;
    }

    const stockNum = parseInt(formData.inventoryQuantity || '0', 10);
    if (!Number.isFinite(stockNum) || Number.isNaN(stockNum) || stockNum < 0) {
      setError('Inventory quantity must be 0 or more');
      setSaving(false);
      return;
    }
    try {
      const payload: Record<string, unknown> = {
        name: formData.name,
        description: formData.description || null,
        price: priceNum,
        stock: stockNum,
        product_type: formData.productType || undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        sku: formData.sku || undefined,
        min_stock: formData.lowStockAlert
          ? Number(formData.lowStockAlert)
          : undefined,
        category_id: selectedCategories[0] ?? undefined,
      };

      // eliminar claves undefined para no provocar 422
      Object.keys(payload).forEach((k) => {
        if (payload[k] === undefined) delete payload[k];
      });

      await productsAPI.update(id, payload as any);
      if (newFiles.length > 0) {
        await uploadNewImages();
      }
      router.push('/inventory');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating product');
    } finally {
      setSaving(false);
    }
  };

  const uploadNewImages = async () => {
    if (!id || newFiles.length === 0) return;
    setUploadingImages(true);
    try {
      await productsAPI.addImages(id, newFiles);
      setNewFiles([]);
      await fetchProduct();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error uploading images');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this product?'))
      return;
    try {
      setSaving(true);
      await productsAPI.delete(id);
      router.push('/inventory');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting product');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!id) return;
    setTogglingStatus(true);
    try {
      const newStatus = status === 'active' ? 'inactive' : 'active';
      await productsAPI.update(id, { status: newStatus } as any);
      setStatus(newStatus as 'active' | 'inactive');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error toggling status');
    } finally {
      setTogglingStatus(false);
    }
  };

  const handleAddFiles = (files: FileList | null) => {
    if (!files) return;
    let current = [...newFiles];
    for (const f of Array.from(files)) {
      const total = existingImages.length + current.length;
      if (total >= MAX_FILES) break;
      if (!ALLOWED_TYPES.includes(f.type)) continue;
      if (f.size > MAX_SIZE) continue;
      current.push(f);
    }
    setNewFiles(current.slice(0, MAX_FILES - existingImages.length));
  };
  const handleRemoveExisting = async (index: number) => {
    if (!id) return;
    try {
      await productsAPI.deleteImage(id, index);
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error deleting image');
    }
  };
  const handleRemoveNew = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };
  const handleReplaceAll = async (files: FileList | null) => {
    if (!id || !files) return;
    try {
      const valid = Array.from(files)
        .filter((f) => ALLOWED_TYPES.includes(f.type) && f.size <= MAX_SIZE)
        .slice(0, MAX_FILES);
      if (valid.length === 0) return;
      await productsAPI.updateImages(id, valid as any);
      setNewFiles([]);
      await fetchProduct();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error replacing images');
    }
  };

  if (loading)
    return <div className='min-h-screen  bg-bg-main'>Loading product...</div>;

  return (
    <div className='min-h-screen  bg-bg-main'>
      <EditHeader
        onBack={() => router.push('/inventory')}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        onSave={handleSave}
        status={status}
        saving={saving || uploadingImages}
        togglingStatus={togglingStatus}
      />

      <div className='px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        {error && (
          <div className='p-2 mb-4 text-sm text-white bg-red-600 rounded'>
            {error}
          </div>
        )}
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
          <div className='space-y-6'>
            <ImagesUploader
              existingImages={existingImages}
              newFiles={newFiles}
              onAddFiles={handleAddFiles}
              onRemoveExisting={handleRemoveExisting}
              onRemoveNew={handleRemoveNew}
              onReplaceAll={handleReplaceAll}
            />
            <ProductForm
              formData={formData as any}
              onChange={handleInputChange}
            />
            <Categorization
              existingCategories={existingCategories}
              selectedCategories={selectedCategories}
              onToggle={handleCategoryToggle}
            />
          </div>

          <div className='space-y-6'>
            <InventoryPanel
              formData={formData as any}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
