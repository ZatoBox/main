'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { productsAPI } from '@/services/api.service';
import { useAuth } from '@/context/auth-store';
import { uploadMultipleImages } from '@/services/upload.service';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ImagesUploader from '@/components/new-product/ImagesUploader';
import EditHeader from '@/components/edit-product/EditHeader';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const MAX_FILES = 4;
const MAX_SIZE = 5 * 1024 * 1024;

const EditProductPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const id = (params as any)?.id as string | undefined;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [productData, setProductData] = useState<any>(null);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const [unlimitedStock, setUnlimitedStock] = useState(false);

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
        setExistingImages(product.images || []);
        setUnlimitedStock(product.unlimited_stock || false);
      } else {
        setError('Producto no encontrado');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar producto');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFiles = (f: FileList | null) => {
    if (!f) return;
    const totalImages = existingImages.length + files.length;
    let current = [...files];
    for (const file of Array.from(f)) {
      if (totalImages + current.length >= MAX_FILES) break;
      if (!ALLOWED_TYPES.includes(file.type)) continue;
      if (file.size > MAX_SIZE) continue;
      current.push(file);
    }
    setFiles(current);
  };

  const handleRemoveFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  const handleRemoveExistingImage = (index: number) =>
    setExistingImages((prev) => prev.filter((_, i) => i !== index));

  const onSubmit = async (values: any) => {
    setSaving(true);
    setError(null);
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para actualizar productos');
      setSaving(false);
      return;
    }

    try {
      const newImageUrls: string[] = [];

      if (files.length > 0) {
        try {
          const urls = await uploadMultipleImages(files);
          newImageUrls.push(...urls);
        } catch (uploadError) {
          console.error('Error uploading images:', uploadError);
          setError('Error al subir las imágenes');
          setSaving(false);
          return;
        }
      }

      const allImages = [...existingImages, ...newImageUrls].slice(
        0,
        MAX_FILES
      );

      const categories: string[] = [];
      if (values.category && String(values.category).trim() !== '') {
        categories.push(String(values.category).trim());
      }

      const payload: any = {
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
        images: allImages,
      };

      await productsAPI.update(id!, payload);
      router.push('/inventory');
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Error al actualizar producto'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!id || !productData) return;
    setTogglingStatus(true);
    setError(null);
    const nextActive = !productData.active;
    try {
      const response = await productsAPI.update(id, { active: nextActive });
      if (response?.success && response.product) {
        setProductData(response.product);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al actualizar estado del producto'
      );
    } finally {
      setTogglingStatus(false);
    }
  };

  const handleArchiveProduct = async () => {
    if (!id || !productData || !productData.active) return;
    setTogglingStatus(true);
    setError(null);
    try {
      const response = await productsAPI.update(id, { active: false });
      if (response?.success && response.product) {
        setProductData(response.product);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al archivar producto'
      );
    } finally {
      setTogglingStatus(false);
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es requerido'),
    price: Yup.number()
      .typeError('El precio debe ser un número')
      .min(0, 'El precio debe ser 0 o mayor')
      .required('El precio es requerido'),
    stock: Yup.number()
      .typeError('El stock debe ser un número')
      .integer('El stock debe ser un número entero')
      .min(0, 'El stock debe ser 0 o mayor')
      .when([], {
        is: () => !unlimitedStock,
        then: (schema) => schema.required('El stock es requerido'),
        otherwise: (schema) => schema.notRequired(),
      }),
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-main">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-primary"></div>
          <p className="text-text-secondary">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-main">
        <div className="text-center">
          <p className="text-text-secondary">
            {error || 'Producto no encontrado'}
          </p>
        </div>
      </div>
    );
  }

  const initialValues = {
    name: productData.name || '',
    description: productData.description || '',
    price: String(productData.price || 0),
    stock: String(productData.stock || 0),
    category: productData.categories?.[0] || '',
    sku: productData.sku || '',
  } as any;

  return (
    <div className="min-h-screen bg-bg-main">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
        validateOnChange={false}
        validateOnBlur={false}
      >
        {(formik) => (
          <>
            <EditHeader
              onBack={() => router.push('/inventory')}
              onSave={() => formik.handleSubmit()}
              onArchive={handleArchiveProduct}
              onToggleStatus={handleToggleStatus}
              status={productData?.active ? 'active' : 'inactive'}
              saving={saving}
              togglingStatus={togglingStatus}
            />
            <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <Form>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  <div className="space-y-6">
                    {existingImages.length > 0 && (
                      <div className="p-6 border rounded-lg shadow-sm bg-white border-[#CBD5E1]">
                        <h3 className="mb-3 text-sm font-medium text-black">
                          Imágenes actuales
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {existingImages.map((img, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={img}
                                alt={`Imagen ${idx + 1}`}
                                className="object-cover w-full h-32 rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveExistingImage(idx)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
                            Descripción
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
                            Categoría
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
                            SKU
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
                            Nombre *
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
                            Precio *
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
                              Stock Ilimitado
                            </span>
                          </label>
                          {!unlimitedStock && (
                            <>
                              <label className="block mb-2 text-sm font-medium text-black">
                                Stock *
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

export default EditProductPage;
