'use client';

import React, { useRef } from 'react';
import { X, Printer, Download } from 'lucide-react';
import type { ReceiptItem } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  receiptNumber: string;
  date: string;
  total: number;
  items: ReceiptItem[];
  paymentMethod: string;
  status: string;
}

const PrintableReceiptModal: React.FC<Props> = ({
  open,
  onClose,
  receiptNumber,
  date,
  total,
  items,
  paymentMethod,
  status,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '', 'height=600,width=800');
      if (printWindow) {
        printWindow.document.write(printRef.current.innerHTML);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleDownloadPDF = () => {
    // Esta es una función placeholder.
    console.log('Descargando PDF...');
    handlePrint();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB] bg-white">
          <h2 className="text-xl font-bold text-[#000000]">
            Vista Previa del Recibo
          </h2>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-lg hover:bg-[#F3F4F6]"
          >
            <X size={20} className="text-[#F88612]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div
            ref={printRef}
            className="bg-white p-8 border border-[#E5E7EB] rounded-lg"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            {/* Receipt Header */}
            <div className="text-center mb-8 pb-6 border-b-2 border-[#E5E7EB]">
              <h1 className="text-3xl font-bold text-[#F88612] mb-2">
                ZatoBox
              </h1>
              <p className="text-sm text-[#9CA3AF]">RECIBO DE COMPRA</p>
              <p className="text-sm text-[#9CA3AF]">#{receiptNumber}</p>
            </div>

            {/* Receipt Details */}
            <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
              <div>
                <p className="text-[#9CA3AF]">Fecha</p>
                <p className="font-semibold text-[#000000]">{date}</p>
              </div>
              <div className="text-right">
                <p className="text-[#9CA3AF]">Estado</p>
                <p className="font-semibold text-[#000000]">
                  {status === 'completed'
                    ? 'Completado'
                    : status === 'pending'
                    ? 'Pendiente'
                    : 'Cancelado'}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-[#E5E7EB]">
                    <th className="text-left py-2 text-[#9CA3AF]">Producto</th>
                    <th className="text-center py-2 text-[#9CA3AF]">
                      Cantidad
                    </th>
                    <th className="text-right py-2 text-[#9CA3AF]">
                      Precio Unit.
                    </th>
                    <th className="text-right py-2 text-[#9CA3AF]">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items && items.length > 0 ? (
                    items.map((item, idx) => {
                      const price = Number(item.price) || 0;
                      const quantity = Number(item.quantity) || 0;
                      const itemTotal = Number(item.total) || price * quantity;

                      return (
                        <tr key={idx} className="border-b border-[#E5E7EB]">
                          <td className="py-3 text-[#000000]">
                            {item.productName || 'Producto'}
                          </td>
                          <td className="py-3 text-center text-[#000000]">
                            {quantity}
                          </td>
                          <td className="py-3 text-right text-[#000000]">
                            ${price.toFixed(2)}
                          </td>
                          <td className="py-3 text-right font-semibold text-[#F88612]">
                            ${itemTotal.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-3 text-center text-[#9CA3AF]"
                      >
                        No hay artículos
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="mb-8 pt-4 border-t-2 border-[#E5E7EB]">
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-[#000000]">TOTAL</p>
                <p className="text-2xl font-bold text-[#F88612]">
                  ${total.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-6 border-t border-[#E5E7EB] text-xs text-[#9CA3AF]">
              <p>Gracias por tu compra</p>
              <p>www.zatobox.io</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 p-6 border-t border-[#E5E7EB] bg-white">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB]"
          >
            Cerrar
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB]"
          >
            <Download size={16} />
            <span>Descargar</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 bg-[#F88612] text-white hover:bg-[#E07A0A] shadow-sm hover:shadow-md"
          >
            <Printer size={16} />
            <span>Imprimir</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintableReceiptModal;
