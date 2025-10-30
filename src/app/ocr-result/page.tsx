'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-store';
import { useOCR } from '@/context/ocr-context';
import { productsAPI, ocrAPI } from '@/services/api.service';
import { OCRResponse, OCRLineItem, CreateProductRequest } from '@/types/index';
import Header from '@/components/ocr-result/Header';
import FileUploader from '@/components/ocr-result/FileUploader';
import ResultOverview from '@/components/ocr-result/ResultOverview';
import ItemsTable from '@/components/ocr-result/ItemsTable';
import ActionsBar from '@/components/ocr-result/ActionsBar';

const OCRResultPage: React.FC = () => {
  const router = useRouter();
  const { token } = useAuth();
  const { isOnCooldown, remainingTime, setCooldown } = useOCR();
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

  const processAnotherDisabled = isOnCooldown;
  const remainingLabel = isOnCooldown
    ? `Process Another (${remainingTime})`
    : 'Process Another';

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
      const sourceItems =
        (result as any).products && (result as any).products.length > 0
          ? (result as any).products
          : ((result.line_items && result.line_items.length > 0
              ? result.line_items
              : []) as any[]);

      const extractStock = (item: any): number => {
        const possibleStockFields = [
          'stock',
          'quantity',
          'qty',
          'unidad',
          'unidades',
          'unit',
          'units',
          'cantidad',
          'amount',
        ];

        for (const field of possibleStockFields) {
          const value = item[field];
          if (value !== null && value !== undefined && value !== '') {
            const num = parseInt(String(value).replace(/[^\d]/g, ''), 10);
            if (Number.isFinite(num) && num > 0) {
              return num;
            }
          }
        }

        return 0;
      };

      const products = sourceItems
        .map((item: any) => {
          const name =
            (item.name || '').trim().substring(0, 80) || 'Unnamed Product';
          const description = (item.description || '').substring(0, 500) || '';
          const priceStr = String(item.price || '0').replace(/[^\d.-]/g, '');
          const price = parseFloat(priceStr) || 0;
          const stock = extractStock(item);

          if (!name.trim() || price < 0) {
            return null;
          }

          const productCategories = Array.isArray(item.categories)
            ? item.categories.filter(
                (c: any) => typeof c === 'string' && c.trim(),
              )
            : item.category
              ? [item.category]
              : ['Otros'];

          return {
            name,
            description,
            price,
            stock,
            sku:
              item.sku ||
              `OCR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            categories: productCategories,
            images: [],
          };
        })
        .filter(Boolean);

      if (products.length === 0) {
        setError('No valid products to create');
        setIsAddingToInventory(false);
        return;
      }

      for (const product of products) {
        await productsAPI.create(product);
      }

      router.push('/inventory');
    } catch (err: any) {
      setError(err.message || 'Error adding products to inventory');
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
      const pickArray = (value: unknown) => (Array.isArray(value) ? value : []);
      const sanitizeText = (value: unknown, fallback: string) => {
        if (value === null || value === undefined) return fallback;
        const asString = typeof value === 'string' ? value : String(value);
        return asString.trim() || fallback;
      };
      const sanitizeNumber = (value: unknown, fallback: string) => {
        const raw = sanitizeText(value, fallback)
          .replace(/[^0-9.,-\s]/g, '')
          .trim();
        if (!raw) return fallback;
        let s = raw.replace(/\s+/g, '');
        const hasDot = s.includes('.');
        const hasComma = s.includes(',');
        if (hasDot && hasComma) {
          if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
            s = s.replace(/\./g, '').replace(/,/g, '.');
          } else {
            s = s.replace(/,/g, '');
          }
        } else if (hasComma) {
          s = s.replace(/,/g, '.');
        }
        const parsed = parseFloat(s);
        return Number.isFinite(parsed) ? parsed.toFixed(2) : fallback;
      };
      const sanitizeQuantity = (value: unknown) => {
        if (value === null || value === undefined) return '1';
        if (typeof value === 'number') {
          const n = Math.floor(value);
          return Number.isFinite(n) && n > 0 ? String(n) : '1';
        }
        const raw = sanitizeText(value, '')
          .replace(/[^0-9.,-\s]/g, '')
          .trim();
        if (!raw) return '1';
        let s = raw.replace(/\s+/g, '');
        const hasDot = s.includes('.');
        const hasComma = s.includes(',');
        if (hasDot && hasComma) {
          if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
            s = s.replace(/\./g, '').replace(/,/g, '.');
          } else {
            s = s.replace(/,/g, '');
          }
        } else if (hasComma) {
          s = s.replace(/,/g, '.');
        }
        const parsed = parseFloat(s);
        if (Number.isFinite(parsed) && parsed > 0) {
          return String(Math.floor(parsed));
        }
        const digits = s.replace(/[^0-9]/g, '');
        const num = parseInt(digits, 10);
        return Number.isFinite(num) && num > 0 ? String(num) : '1';
      };

      const buildAutoDescription = (
        name: string,
        quantity: string,
        unitPrice: string,
      ) => {
        const safeName = sanitizeText(name, 'Producto');
        const qtyNum = parseInt(quantity, 10);
        const qtyText = Number.isFinite(qtyNum)
          ? `${qtyNum} unidad${qtyNum === 1 ? '' : 'es'}`
          : `Cantidad ${quantity}`;
        const priceText = unitPrice
          ? `${unitPrice} por unidad`
          : 'precio no especificado';
        return `${safeName} - ${qtyText}, ${priceText}`;
      };

      const candidateLineItems = [
        pickArray((ocrResult as any).products),
        pickArray((ocrResult as any).line_items),
        pickArray((ocrResult as any).productos),
        pickArray((ocrResult as any).items),
      ].find((arr) => arr.length > 0) as Array<any> | undefined;

      const isNewFormat =
        (ocrResult as any).products && (ocrResult as any).products.length > 0;

      const processedItems: OCRLineItem[] = (candidateLineItems || []).map(
        (item: any) => {
          const name = sanitizeText(item?.name, 'Unnamed Product');
          let description = sanitizeText(
            item?.description || item?.descripcion || item?.detalles,
            '',
          );

          let unitPrice: string;
          let quantityStr: string;

          if (isNewFormat) {
            unitPrice = sanitizeNumber(item?.price ?? '0.00', '0.00');
            quantityStr = sanitizeQuantity(item?.stock ?? '0');
          } else {
            unitPrice = sanitizeNumber(item?.unit_price ?? item?.price, '0.00');
            quantityStr = sanitizeQuantity(item?.quantity ?? item?.qty ?? '1');
          }

          const quantityNum = parseInt(quantityStr, 10);
          const unitPriceNum = parseFloat(unitPrice);
          const providedTotal = sanitizeNumber(
            item?.total_price ?? item?.total ?? item?.price,
            '',
          );
          const computedTotal =
            Number.isFinite(unitPriceNum) && Number.isFinite(quantityNum)
              ? (unitPriceNum * quantityNum).toFixed(2)
              : '0.00';
          let finalTotal = computedTotal;
          if (providedTotal) {
            const providedNum = parseFloat(providedTotal);
            const computedNum = parseFloat(computedTotal);
            if (
              Number.isFinite(providedNum) &&
              Number.isFinite(computedNum) &&
              Math.abs(providedNum - computedNum) <= 0.02
            ) {
              finalTotal = providedNum.toFixed(2);
            } else if (
              Number.isFinite(providedNum) &&
              !Number.isFinite(computedNum)
            ) {
              finalTotal = providedNum.toFixed(2);
            }
          }
          if (!description || description === name) {
            description = buildAutoDescription(name, quantityStr, unitPrice);
          }

          return {
            name,
            description,
            unit_price: unitPrice,
            quantity: quantityStr,
            total_price: finalTotal,
            category: sanitizeText(
              item?.category ?? item?.categories?.[0],
              'General',
            ),
          } as OCRLineItem;
        },
      );

      const metadataSource = (() => {
        if (ocrResult.metadata && typeof ocrResult.metadata === 'object') {
          return ocrResult.metadata as Record<string, unknown>;
        }
        const topLevelKeys = [
          'company_name',
          'ruc',
          'date',
          'invoice_number',
          'subtotal',
          'iva',
          'tax',
          'total',
        ];
        const collected = topLevelKeys.reduce<Record<string, unknown>>(
          (acc, key) => {
            if (key in (ocrResult as any)) acc[key] = (ocrResult as any)[key];
            return acc;
          },
          {},
        );
        return collected;
      })();

      const subtotalFromItems = processedItems.reduce((acc, current) => {
        const value = parseFloat(
          typeof current.total_price === 'number'
            ? String(current.total_price)
            : current.total_price || '0',
        );
        return acc + (Number.isFinite(value) ? value : 0);
      }, 0);
      const subtotalFromModel = sanitizeNumber(metadataSource?.subtotal, '');
      const ivaFromModel = sanitizeNumber(
        metadataSource?.iva ?? metadataSource?.tax,
        '',
      );
      const totalFromModel = sanitizeNumber(metadataSource?.total, '');
      const subtotal = subtotalFromModel || subtotalFromItems.toFixed(2);
      const iva = ivaFromModel;
      let total = totalFromModel;
      if (!total) {
        const subtotalNum = parseFloat(subtotal);
        const ivaNum = iva ? parseFloat(iva) : 0;
        if (Number.isFinite(subtotalNum)) {
          const sum = subtotalNum + (Number.isFinite(ivaNum) ? ivaNum : 0);
          total = sum.toFixed(2);
        } else {
          total = '';
        }
      }

      const processedMetadata = {
        company_name: sanitizeText(metadataSource?.company_name, ''),
        ruc: sanitizeText(metadataSource?.ruc, ''),
        date: sanitizeText(metadataSource?.date, ''),
        invoice_number: sanitizeText(metadataSource?.invoice_number, ''),
        subtotal,
        iva,
        total,
      };

      const normalized: OCRResponse = {
        success: true,
        message: 'Documento procesado exitosamente',
        metadata: processedMetadata,
        line_items: processedItems,
        detections: ocrResult.detections || [],
        processed_image: ocrResult.processed_image || null,
        processing_time: ocrResult.processing_time || 3,
        statistics: ocrResult.statistics || {},
        summary: ocrResult.summary || {},
      };

      setResult(normalized);
      if (normalized.success) {
        setCooldown(Date.now() + 5 * 60 * 1000);
      }
    } catch (err: any) {
      const errorMessage = err.message || '';
      if (
        errorMessage.includes('429') ||
        errorMessage.includes('Too Many Requests')
      ) {
        setCooldown(Date.now() + 5 * 60 * 1000);
        setError('');
      } else {
        setError(
          `Error procesando documento: ${errorMessage}. Por favor intenta de nuevo.`,
        );
      }
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
        }) as OCRResponse,
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
      'file-upload',
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
    <div className="flex items-start justify-center min-h-screen p-6  md:mt-32 mt-24">
      <div className="w-full max-w-5xl">
        {!result ? (
          <div className="p-8 bg-white border rounded-lg shadow-sm md:p-10 animate-fadeIn border-[#EFEFEF]">
            <Header />
            <FileUploader
              fileName={file?.name ?? null}
              onChange={(f) => {
                setFile(f);
                setResult(null);
                setError('');
              }}
            />

            <div className="text-center">
              {isOnCooldown && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg pointer-events-none">
                  <div className="flex items-center justify-center">
                    <span className="text-yellow-700">
                      ⏳ Espera {remainingTime} antes de procesar otro documento
                    </span>
                  </div>
                </div>
              )}
              <button
                onClick={handleUpload}
                disabled={!file || loading || isOnCooldown}
                className="flex items-center px-8 py-4 mx-auto font-medium text-white transition-colors rounded-md bg-[#F88612] md:px-10 md:py-5 hover:bg-[#A94D14] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin md:h-5 md:w-5 md:mr-3"></div>
                    Procesando documento...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🔍</span> Upload and process
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="p-4 mt-4 border rounded-lg bg-error-50 border-error-200 text-error-700 animate-shake">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 bg-white border rounded-lg shadow-sm md:p-10 animate-fadeIn border-[#EFEFEF]">
            <ResultOverview result={result} fileName={file?.name ?? null} />

            <ItemsTable
              items={
                (isEditing
                  ? (editedResult?.line_items ?? [])
                  : (result?.line_items ?? [])) as OCRLineItem[]
              }
              isEditing={isEditing}
              onChange={handleTableChange}
            />

            {result.processed_image && (
              <div className="mb-6 md:mb-8">
                <h3 className="mb-3 text-base font-semibold md:text-lg text-text-primary md:mb-4">
                  🖼️ Imagen procesada con detecciones
                </h3>
                <div className="p-4 overflow-hidden rounded-lg bg-bg-surface">
                  <img
                    src={`data:image/jpeg;base64,${result.processed_image}`}
                    alt="Processed document with AI detections"
                    className="w-full h-auto rounded-lg shadow-md"
                    style={{ maxHeight: '500px', objectFit: 'contain' }}
                  />
                  <p className="mt-2 text-xs text-center text-gray-500">
                    Imagen que muestra las detecciones de YOLO (cuadrículas
                    verdes) y las regiones de la tabla (cuadrículas azules)
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 mb-6 border rounded-lg md:mb-8 bg-error-50 border-error-200 text-error-700 animate-shake">
                <div className="flex items-center">
                  <span className="mr-2 text-error-600">⚠️</span>
                  <span className="text-sm">{error}</span>
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
