'use client';

import React, { useRef } from 'react';
import { X, Printer, Download } from 'lucide-react';
import { buildReceiptHtml } from '@/utils/print-receipt';
import type { ReceiptItem } from '@/types';
import { useTranslation } from '@/hooks/use-translation';

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
  const { t } = useTranslation();

  const handlePrint = () => {
    const html = buildReceiptHtml({
      receiptNumber,
      date,
      total,
      items,
      status,
    });
    const w = window.open('', '', 'height=800,width=700');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.onload = () => w.print();
  };

  const handleDownloadPDF = () => {
    const html = buildReceiptHtml({
      receiptNumber,
      date,
      total,
      items,
      status,
    });
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recibo-${receiptNumber}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return t('receipts.detail.completed');
      case 'pending':
        return t('receipts.detail.pending');
      case 'cancelled':
        return t('receipts.detail.cancelled');
      default:
        return status;
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB] bg-white">
          <h2 className="text-xl font-bold text-[#000000]">
            {t('receipts.printModal.title')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-lg hover:bg-[#F3F4F6]"
          >
            <X size={20} className="text-[#F88612]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div
            ref={printRef}
            className="bg-white p-8 border border-[#E5E7EB] rounded-lg"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            <div className="text-center mb-8 pb-6 border-b-2 border-[#E5E7EB]">
              <h1 className="text-3xl font-bold text-[#F88612] mb-2">
                ZatoBox
              </h1>
              <p className="text-sm text-[#9CA3AF]">
                {t('receipts.printModal.purchaseReceipt')}
              </p>
              <p className="text-sm text-[#9CA3AF]">#{receiptNumber}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
              <div>
                <p className="text-[#9CA3AF]">
                  {t('receipts.printModal.date')}
                </p>
                <p className="font-semibold text-[#000000]">{date}</p>
              </div>
              <div className="text-right">
                <p className="text-[#9CA3AF]">
                  {t('receipts.printModal.status')}
                </p>
                <p className="font-semibold text-[#000000]">
                  {getStatusLabel(status)}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-[#E5E7EB]">
                    <th className="text-left py-2 text-[#9CA3AF]">
                      {t('receipts.printModal.product')}
                    </th>
                    <th className="text-center py-2 text-[#9CA3AF]">
                      {t('receipts.printModal.quantity')}
                    </th>
                    <th className="text-right py-2 text-[#9CA3AF]">
                      {t('receipts.printModal.unitPrice')}
                    </th>
                    <th className="text-right py-2 text-[#9CA3AF]">
                      {t('receipts.printModal.total')}
                    </th>
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
                            {item.productName || t('receipts.detail.product')}
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
                        {t('receipts.printModal.noItems')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mb-8 pt-4 border-t-2 border-[#E5E7EB]">
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-[#000000]">TOTAL</p>
                <p className="text-2xl font-bold text-[#F88612]">
                  ${total.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="text-center pt-6 border-t border-[#E5E7EB] text-xs text-[#9CA3AF]">
              <p>{t('receipts.printModal.thanks')}</p>
              <p>www.zatobox.io</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-[#E5E7EB] bg-white">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB]"
          >
            {t('receipts.printModal.close')}
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB]"
          >
            <Download size={16} />
            <span>{t('receipts.printModal.download')}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 bg-[#F88612] text-white hover:bg-[#E07A0A] shadow-sm hover:shadow-md"
          >
            <Printer size={16} />
            <span>{t('receipts.printModal.print')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintableReceiptModal;
