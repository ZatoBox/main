'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import {
  X,
  FileJson,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  Loader2,
  Code,
} from 'lucide-react';
import { productsAPI } from '@/services/api.service';
import { toast } from '@/hooks/use-toast';

interface JsonImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ParsedProduct {
  name: string;
  price: number;
  stock: number;
  description?: string;
  sku?: string;
  categories?: string[];
}

const EXAMPLE_JSON = [
  {
    name: 'Classic T-Shirt',
    price: 25.0,
    stock: 100,
    description: 'High quality cotton t-shirt',
    sku: 'TSH-001',
    categories: ['Clothing', 'T-Shirts'],
  },
  {
    name: 'Denim Jeans',
    price: 59.99,
    stock: 50,
    sku: 'JNS-002',
    categories: ['Clothing', 'Pants'],
  },
];

const JsonImporterModal: React.FC<JsonImporterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [jsonContent, setJsonContent] = useState('');
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[] | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopyExample = () => {
    navigator.clipboard.writeText(JSON.stringify(EXAMPLE_JSON, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validateJson = () => {
    setIsValidating(true);
    setError(null);
    setParsedProducts(null);

    setTimeout(() => {
      try {
        const parsed = JSON.parse(jsonContent);
        if (!Array.isArray(parsed)) {
          throw new Error(t('inventory.jsonImporter.structureError'));
        }

        const validProducts: ParsedProduct[] = [];
        parsed.forEach((item: any, index: number) => {
          if (
            !item.name ||
            typeof item.price !== 'number' ||
            typeof item.stock !== 'number'
          ) {
            throw new Error(
              `${t('inventory.jsonImporter.structureError')} (Item ${
                index + 1
              })`
            );
          }
          validProducts.push({
            name: item.name,
            price: item.price,
            stock: item.stock,
            description: item.description,
            sku: item.sku,
            categories: item.categories,
          });
        });

        if (validProducts.length === 0) {
          throw new Error(t('inventory.jsonImporter.validationError'));
        }

        setParsedProducts(validProducts);
      } catch (err: any) {
        setError(err.message || t('inventory.jsonImporter.validationError'));
      } finally {
        setIsValidating(false);
      }
    }, 600);
  };

  const handleCreate = async () => {
    if (!parsedProducts) return;

    setIsCreating(true);
    setProgress(0);
    let successCount = 0;

    for (let i = 0; i < parsedProducts.length; i++) {
      try {
        await productsAPI.create(parsedProducts[i]);
        successCount++;
        setProgress(Math.round(((i + 1) / parsedProducts.length) * 100));
      } catch (error) {
        console.error('Error creating product:', error);
      }
    }

    setIsCreating(false);
    onSuccess();
    onClose();
    toast({
      title: t('inventory.jsonImporter.success'),
      description: `${successCount} products created.`,
      variant: 'default',
    });
    setJsonContent('');
    setParsedProducts(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white border border-gray-200 w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#F88612]/10 rounded-lg">
              <FileJson className="w-5 h-5 text-[#F88612]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {t('inventory.jsonImporter.title')}
              </h2>
              <p className="text-xs text-gray-500">
                {t('inventory.jsonImporter.description')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          <div
            className={`flex-1 flex flex-col border-b md:border-b-0 md:border-r border-gray-200 transition-all duration-300 ${
              parsedProducts ? 'md:w-1/2' : 'w-full'
            }`}
          >
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                <Code size={14} />
                <span>JSON Input</span>
              </div>
              <button
                onClick={handleCopyExample}
                className="flex items-center gap-1.5 text-xs text-[#F88612] hover:text-[#d17110] transition-colors"
                disabled={isCreating}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>
                  {copied
                    ? t('inventory.jsonImporter.exampleCopied')
                    : t('inventory.jsonImporter.copyExample')}
                </span>
              </button>
            </div>
            <div className="flex-1 relative bg-white">
              <textarea
                value={jsonContent}
                onChange={(e) => setJsonContent(e.target.value)}
                placeholder={t('inventory.jsonImporter.placeholder')}
                className="w-full h-full bg-white text-gray-800 font-mono text-sm p-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#F88612]/20 selection:bg-[#F88612]/20"
                spellCheck={false}
                disabled={isCreating}
              />
            </div>
          </div>

          {parsedProducts && (
            <div className="flex-1 flex flex-col bg-gray-50 animate-in slide-in-from-right-4 duration-300">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-600" />
                  {t('inventory.jsonImporter.previewTitle')}
                </h3>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full border border-green-200">
                  {parsedProducts.length}{' '}
                  {t('inventory.jsonImporter.detectedItems')}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {parsedProducts.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-lg border border-gray-200 hover:border-[#F88612]/50 hover:shadow-sm transition-all group"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-gray-900 text-sm">
                        {item.name}
                      </span>
                      <span className="font-mono text-[#F88612] text-xs font-medium">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>
                        Stock:{' '}
                        <span className="text-gray-700 font-medium">
                          {item.stock}
                        </span>
                      </span>
                      {item.sku && (
                        <span>
                          SKU:{' '}
                          <span className="text-gray-700 font-medium">
                            {item.sku}
                          </span>
                        </span>
                      )}
                    </div>
                    {item.categories && item.categories.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.categories.map((cat, cIdx) => (
                          <span
                            key={cIdx}
                            className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600 font-medium"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col gap-4">
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200 animate-in slide-in-from-bottom-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {isCreating && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
              <div
                className="bg-[#F88612] h-full transition-all duration-300 ease-out flex items-center justify-end"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isCreating}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800 transition-colors disabled:opacity-50 font-medium"
            >
              {t('inventory.jsonImporter.cancel')}
            </button>

            {!parsedProducts ? (
              <button
                onClick={validateJson}
                disabled={!jsonContent.trim() || isValidating}
                className="px-6 py-2 bg-[#F88612] text-white text-sm font-bold rounded-lg hover:bg-[#E67300] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                {isValidating && <Loader2 size={16} className="animate-spin" />}
                {t('inventory.jsonImporter.validate')}
              </button>
            ) : (
              <button
                onClick={handleCreate}
                disabled={isCreating}
                className="px-6 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                {isCreating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>
                      {t('inventory.jsonImporter.creating')} {progress}%
                    </span>
                  </>
                ) : (
                  <>
                    <span>{t('inventory.jsonImporter.create')}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonImporterModal;
