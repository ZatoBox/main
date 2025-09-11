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
  ProductStatus,
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
  const [processingOptions, setProcessingOptions] = useState({
    enhance_ocr: true,
    rotation_correction: true,
    confidence_threshold: 0.25,
  });
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [nowTs, setNowTs] = useState<number>(Date.now());

  useEffect(() => {
    if (!cooldownUntil) return;
    const id = setInterval(() => setNowTs(Date.now()), 1000);
    return () => clearInterval(id);
  }, [cooldownUntil]);

  const processAnotherDisabled = cooldownUntil ? nowTs < cooldownUntil : false;
  const remainingMs =
    processAnotherDisabled && cooldownUntil ? cooldownUntil - nowTs : 0;
  const remainingLabel = (() => {
    if (!processAnotherDisabled) return 'Process Another';
    const totalSec = Math.max(0, Math.floor(remainingMs / 1000));
    const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    return `Process Another (${m}:${s})`;
  })();

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
      const toCreate: CreateProductRequest[] = (result.line_items || [])
        .map((it) => {
          const name =
            (it.name || it.description || '').trim().substring(0, 50) ||
            'Unnamed';
          const description = (it.description || 'No description').substring(
            0,
            200
          );
          const price =
            parseFloat(String(it.unit_price).replace(/[^\d.-]/g, '')) || 0;
          const stock =
            parseInt(String(it.quantity).replace(/[^\d]/g, '')) || 1;
          const sku =
            (it as any).sku && String((it as any).sku).trim().length >= 3
              ? String((it as any).sku)
                  .trim()
                  .substring(0, 32)
              : Array.from(
                  { length: 8 },
                  () =>
                    'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[
                      Math.floor(Math.random() * 32)
                    ]
                ).join('');
          return {
            name,
            description,
            price,
            stock,
            unit: ProductUnity.PER_ITEM,
            product_type: ProductType.PHYSICAL_PRODUCT,
            category_id: undefined,
            sku,
            weight: undefined,
            localization: undefined,
            status: ProductStatus.ACTIVE,
            min_stock: 0,
          } as CreateProductRequest;
        })
        .filter((p) => p.name && p.price >= 0);

      if (toCreate.length === 0) {
        setError('No valid products to create');
        setIsAddingToInventory(false);
        return;
      }

      await productsAPI.createBulk(toCreate);
      router.push('/inventory');
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
      const ocrResult = await ocrAPI.process(file);
      const rawItems =
        ocrResult.line_items || (ocrResult as any).products || [];
      const lineItems = (rawItems as any[]).map((it) => {
        const unit_price = it.unit_price || it.price || '0';
        const quantity = it.quantity || it.stock || '1';
        let total_price = it.total_price;
        if (!total_price) {
          const nUnit =
            parseFloat(
              String(unit_price)
                .toString()
                .replace(/[^\d.-]/g, '')
            ) || 0;
          const nQty =
            parseFloat(
              String(quantity)
                .toString()
                .replace(/[^\d.-]/g, '')
            ) || 0;
          total_price = (nUnit * nQty).toFixed(2);
        }
        return {
          ...it,
          unit_price:
            typeof unit_price === 'number' ? unit_price.toFixed(2) : unit_price,
          quantity: String(quantity),
          total_price:
            typeof total_price === 'number'
              ? total_price.toFixed(2)
              : String(total_price),
        };
      });

      const normalized: OCRResponse = {
        success: ocrResult.success ?? true,
        message: ocrResult.message ?? 'Documento procesado exitosamente',
        metadata: ocrResult.metadata || {},
        line_items: lineItems,
        detections: ocrResult.detections || [],
        processed_image: ocrResult.processed_image || null,
        processing_time: ocrResult.processing_time || 3,
        statistics: ocrResult.statistics || {},
        summary: ocrResult.summary || {},
      };

      setResult(normalized);
      if (normalized.success) {
        setCooldownUntil(Date.now() + 5 * 60 * 1000);
      }
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
    if (processAnotherDisabled) return;
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
    <div className='flex items-start justify-center min-h-screen p-6 bg-[#F7F7F7]'>
      <div className='w-full max-w-5xl'>
        {!result ? (
          <div className='p-8 bg-white border rounded-lg shadow-sm md:p-10 animate-fadeIn border-[#EFEFEF]'>
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
                className='flex items-center px-8 py-4 mx-auto font-medium text-white transition-colors rounded-md bg-[#F88612] md:px-10 md:py-5 hover:bg-[#A94D14] disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? (
                  <>
                    <div className='w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin md:h-5 md:w-5 md:mr-3'></div>
                    Processing document...
                  </>
                ) : (
                  <>
                    <span className='mr-2'>🔍</span> Upload and process
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
          <div className='p-8 bg-white border rounded-lg shadow-sm md:p-10 animate-fadeIn border-[#EFEFEF]'>
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
              processAnotherDisabled={processAnotherDisabled}
              processAnotherLabel={remainingLabel}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OCRResultPage;
