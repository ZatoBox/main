'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-store';
import { productsAPI, ocrAPI } from '@/services/api.service';
import {
  OCRResponse,
  OCRLineItem,
  CreateProductRequest,
  ProductUnity,
  ProductType,
} from '@/types/index';
import Header from '@/components/ocr-result/Header';
import FileUploader from '@/components/ocr-result/FileUploader';
import ResultOverview from '@/components/ocr-result/ResultOverview';
import ItemsTable from '@/components/ocr-result/ItemsTable';
import ActionsBar from '@/components/ocr-result/ActionsBar';

const OCRResultPage: React.FC = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<OCRResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedResult, setEditedResult] = useState<OCRResponse | null>(null);
  const [isAddingToInventory, setIsAddingToInventory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Office Supplies');
  const [processingOptions, setProcessingOptions] = useState({
    enhance_ocr: true,
    rotation_correction: true,
    confidence_threshold: 0.25,
  });
  const [systemStatus, setSystemStatus] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError('');
    }
  };

  const handleConfirmData = async () => {
    if (!result || !token) {
      setError('No data to confirm or not authenticated');
      return;
    }

    setIsAddingToInventory(true);
    setError('');

    try {
      const productsToAdd: CreateProductRequest[] = (
        result.line_items ?? []
      ).map((item: OCRLineItem) => ({
        name: (item.name || item.description || '').substring(0, 50),
        description: item.description || '',
        price:
          parseFloat(String(item.unit_price ?? '0').replace(/[^\d.-]/g, '')) ||
          0,
        stock:
          parseInt(String(item.quantity ?? '1').replace(/[^\d]/g, '')) || 1,
        unit: ProductUnity.PER_ITEM as unknown as ProductUnity,
        product_type: ProductType.PHYSICAL_PRODUCT as unknown as ProductType,
        category_id: undefined,
        sku: '',
        weight: undefined,
        localization: undefined,
        status: 'active' as any,
      }));

      const addedProducts: any[] = [];
      const failedProducts: any[] = [];

      for (const productData of productsToAdd) {
        try {
          const response = await productsAPI.create(productData as any);
          if (response && (response as any).product)
            addedProducts.push((response as any).product);
        } catch (err: any) {
          console.error('Error adding product:', productData.name, err);
          failedProducts.push({
            name: productData.name,
            error: err.message || 'Unknown error',
          });
        }
      }

      if (addedProducts.length > 0) {
        router.push('/inventory');
      }
      if (failedProducts.length > 0) {
        setError(`Failed to add ${failedProducts.length} products`);
      }
    } catch (err: any) {
      setError(err.message || 'Error adding products');
    } finally {
      setIsAddingToInventory(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');

    try {
      // Process the document with OCR directly
      const ocrResult = await ocrAPI.process(file);

      // Normalize and set result
      const normalized: OCRResponse = {
        success: ocrResult.success ?? true,
        message: ocrResult.message ?? 'Documento procesado exitosamente',
        metadata: ocrResult.metadata || {},
        line_items: ocrResult.line_items || (ocrResult as any).products || [],
        detections: ocrResult.detections || [],
        processed_image: ocrResult.processed_image || null,
        processing_time: ocrResult.processing_time || 3,
        statistics: ocrResult.statistics || {},
        summary: ocrResult.summary || {},
      };

      setResult(normalized);
    } catch (err: any) {
      setError(
        `Error procesando documento: ${err.message}. Por favor intenta de nuevo.`
      );
    } finally {
      setLoading(false);
    }
  };

  // Handlers for editing items
  const handleEditResult = () => {
    setIsEditing(true);
    setEditedResult(result);
  };

  const handleItemChange = (items: OCRLineItem[]) => {
    setEditedResult(
      (prev) =>
        ({
          ...(prev || result || { success: true }),
          line_items: items,
        } as OCRResponse)
    );
  };

  // Adapter for ItemsTable which expects (index, field, value)
  const handleTableChange = (index: number, field: string, value: any) => {
    const items = (
      editedResult?.line_items ||
      result?.line_items ||
      []
    ).slice();
    const item = { ...(items[index] || {}) } as any;
    item[field] = value;
    items[index] = item;
    handleItemChange(items as OCRLineItem[]);
  };

  const handleProcessAnother = () => {
    setFile(null);
    setResult(null);
    setError('');
    setIsEditing(false);
    setEditedResult(null);
    const fileInput = document.getElementById(
      'file-upload'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSaveEdit = () => {
    if (editedResult) {
      setResult(editedResult);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedResult(null);
    setIsEditing(false);
  };

  return (
    <div className='flex items-center justify-center min-h-screen p-4'>
      <div className='w-full max-w-4xl'>
        {!result ? (
          <div className='p-6 bg-white rounded-lg shadow-lg md:p-8 animate-fadeIn'>
            <Header />
            <FileUploader
              fileName={file?.name ?? null}
              onChange={(f) => {
                setFile(f);
                setResult(null);
                setError('');
              }}
            />

            <div className='text-center'>
              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className='flex items-center px-6 py-3 mx-auto font-medium text-white transition-all duration-300 transform rounded-lg bg-[#F88612] md:px-8 md:py-4 hover:bg-[#D35400] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105'
              >
                {loading ? (
                  <>
                    <div className='w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin md:h-5 md:w-5 md:mr-3'></div>
                    Processing document...
                  </>
                ) : (
                  <>
                    <span className='mr-2'>🔍</span>
                    Upload and process
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className='p-4 mt-4 border rounded-lg bg-error-50 border-error-200 text-error-700 animate-shake'>
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className='p-6 bg-white rounded-lg shadow-lg md:p-8 animate-fadeIn'>
            <ResultOverview result={result} fileName={file?.name ?? null} />

            <ItemsTable
              items={
                (isEditing
                  ? editedResult?.line_items ?? []
                  : result?.line_items ?? []) as OCRLineItem[]
              }
              isEditing={isEditing}
              onChange={handleTableChange}
            />

            {result?.summary && (
              <div className='p-4 mt-4 border border-green-200 rounded-lg bg-green-50'>
                <div className='grid grid-cols-2 gap-4 text-center md:grid-cols-4'>
                  <div>
                    <div className='text-xs text-gray-600'>Total Products</div>
                    <div className='text-lg font-bold text-green-700'>
                      {String(result.summary.total_productos ?? '')}
                    </div>
                  </div>
                  <div>
                    <div className='text-xs text-gray-600'>Total Quantity</div>
                    <div className='text-lg font-bold text-blue-700'>
                      {String(result.summary.total_cantidad ?? '')}
                    </div>
                  </div>
                  <div>
                    <div className='text-xs text-gray-600'>Average Price</div>
                    <div className='text-lg font-bold text-purple-700'>
                      {String(result.summary.promedio_precio ?? '')}
                    </div>
                  </div>
                  <div>
                    <div className='text-xs text-gray-600'>GRAND TOTAL</div>
                    <div className='text-xl font-bold text-green-800'>
                      {String(result.summary.gran_total ?? '')}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className='p-3 mb-6 border border-blue-200 rounded-lg bg-blue-50 md:p-4 md:mb-8'>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <div className='flex items-center'>
                  <span className='mr-2 text-blue-600 md:mr-3'>📁</span>
                  <span className='text-xs text-blue-800 md:text-sm'>
                    <strong>File:</strong> {file?.name}
                  </span>
                </div>
                <div className='flex items-center gap-4 text-xs text-blue-700'>
                  <span>
                    📊 Tables: {result?.statistics?.table_regions || 0}
                  </span>
                  <span>
                    🎯 YOLO: {result?.statistics?.yolo_detections || 0}
                  </span>
                  <span>⏱️ {result?.processing_time || 0}s</span>
                </div>
              </div>
            </div>

            {result.processed_image && (
              <div className='mb-6 md:mb-8'>
                <h3 className='mb-3 text-base font-semibold md:text-lg text-text-primary md:mb-4'>
                  🖼️ Processed Image with Detections
                </h3>
                <div className='p-4 overflow-hidden rounded-lg bg-bg-surface'>
                  <img
                    src={`data:image/jpeg;base64,${result.processed_image}`}
                    alt='Processed document with AI detections'
                    className='w-full h-auto rounded-lg shadow-md'
                    style={{ maxHeight: '500px', objectFit: 'contain' }}
                  />
                  <p className='mt-2 text-xs text-center text-gray-500'>
                    Image showing YOLO detections (green boxes) and table
                    regions (blue boxes)
                  </p>
                </div>
              </div>
            )}

            <div className='mb-6 md:mb-8'>
              <h3 className='mb-3 text-base font-semibold md:text-lg text-text-primary md:mb-4'>
                📂 Product Category
              </h3>
              <div className='p-4 rounded-lg bg-bg-surface md:p-6'>
                <label className='block mb-2 text-sm font-medium text-text-primary'>
                  Select category for all products:
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className='w-full px-3 py-2 bg-white border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent text-text-primary'
                >
                  <option value='Office Supplies'>Office Supplies</option>
                  <option value='Electronics'>Electronics</option>
                  <option value='Furniture'>Furniture</option>
                  <option value='Clothing'>Clothing</option>
                  <option value='Food & Beverages'>Food & Beverages</option>
                  <option value='Books'>Books</option>
                  <option value='Sports'>Sports</option>
                  <option value='Other'>Other</option>
                </select>
              </div>
            </div>

            {error && (
              <div className='p-4 mb-6 border rounded-lg md:mb-8 bg-error-50 border-error-200 text-error-700 animate-shake'>
                <div className='flex items-center'>
                  <span className='mr-2 text-error-600'>⚠️</span>
                  <span className='text-sm'>{error}</span>
                </div>
              </div>
            )}

            <ActionsBar
              isEditing={isEditing}
              isAdding={isAddingToInventory}
              onConfirm={handleConfirmData}
              onEdit={handleEditResult}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              onProcessAnother={handleProcessAnother}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OCRResultPage;
