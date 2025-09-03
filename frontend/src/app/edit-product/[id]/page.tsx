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

const EditProductPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const idParam = (params as any)?.id;
  const id = idParam ? Number(idParam) : NaN;

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
    if (!isNaN(id)) {
      fetchProduct();
    } else {
      setError('Invalid product id');
      setLoading(false);
    }
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productsAPI.getById(id);
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

      await productsAPI.update(id, payload as any);
      router.push('/inventory');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
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

  if (loading)
    return (
      <div className='min-h-screen pt-16 bg-bg-main'>Loading product...</div>
    );

  return (
    <div className='min-h-screen pt-16 bg-bg-main'>
      <EditHeader
        onBack={() => router.push('/inventory')}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        onSave={handleSave}
        status={status}
        saving={saving}
        togglingStatus={togglingStatus}
      />

      <div className='px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
          <div className='space-y-6'>
            <ProductForm
              formData={formData as any}
              onChange={handleInputChange}
            />
            <ImagesUploader onFiles={() => {}} />
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
