import React from 'react';
import { useTranslation } from '@/hooks/use-translation';

interface FormDataShape {
  productType: string;
  name: string;
  description: string;
  location: string;
  unit: string;
  weight: string;
  price: string;
  inventoryQuantity: string;
  lowStockAlert: string;
  sku: string;
}

interface Props {
  formData: FormDataShape;
  onChange: (field: keyof FormDataShape, value: string) => void;
}

const ProductForm: React.FC<Props> = ({ formData, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="p-6 space-y-4 border rounded-lg shadow-sm bg-[#FFFFFF] border-[#CBD5E1]">
        <div>
          <label className="block mb-2 text-sm font-medium text-[#000000]">
            {t('editProduct.form.productName')}
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent bg-[#FFFFFF] text-[#000000]"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-[#000000]">
            {t('editProduct.form.description')}
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onChange('description', e.target.value)}
            rows={3}
            className="w-full p-3 border rounded-lg resize-none border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent bg-[#FFFFFF] text-[#000000]"
          />
        </div>
      </div>

      <div className="p-6 border rounded-lg shadow-sm bg-[#FFFFFF] border-[#CBD5E1]">
        <label className="block mb-2 text-sm font-medium text-[#000000]">
          {t('editProduct.form.locations')}
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => onChange('location', e.target.value)}
          className="w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent bg-[#FFFFFF] text-[#000000]"
          placeholder={t('editProduct.form.locationPlaceholder')}
        />
      </div>
    </div>
  );
};

export default ProductForm;
