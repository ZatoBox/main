'use client';

import React from 'react';
import ReceiptCard from './ReceiptCard';
import { FileText } from 'lucide-react';
import type { ReceiptItem } from '@/types';

interface Receipt {
  id: string;
  receiptNumber: string;
  date: string;
  total: number;
  itemCount: number;
  paymentMethod: string;
  status: string;
  items: ReceiptItem[];
}

interface Props {
  receipts: Receipt[];
  loading: boolean;
}

const ReceiptsGrid: React.FC<Props> = ({ receipts, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-[#F88612]"></div>
          <p className="text-text-secondary">Cargando recibos...</p>
        </div>
      </div>
    );
  }

  if (receipts.length === 0) {
    return (
      <div className="p-12 text-center border border-[#CBD5E1] rounded-lg shadow-sm bg-[#FFFFFF]">
        <FileText size={48} className="mx-auto mb-4 text-[#CBD5E1]" />
        <h3 className="mb-2 text-lg font-medium text-text-primary">
          No se encontraron recibos
        </h3>
        <p className="text-text-secondary">
          Los recibos de pago aparecerán aquí cuando realices transacciones.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {receipts.map((receipt) => (
        <ReceiptCard
          key={receipt.id}
          id={receipt.id}
          receiptNumber={receipt.receiptNumber}
          date={receipt.date}
          total={receipt.total}
          itemCount={receipt.itemCount}
          paymentMethod={receipt.paymentMethod}
          status={receipt.status}
          items={receipt.items}
        />
      ))}
    </div>
  );
};

export default ReceiptsGrid;
