'use client';

import React, { useState } from 'react';
import {
  Download,
  Eye,
  FileText,
  Package,
  Banknote,
  Bitcoin,
  Zap,
  RotateCcw,
} from 'lucide-react';
import PrintableReceiptModal from './PrintableReceiptModal';
import { buildReceiptHtml } from '@/utils/print-receipt';
import type { ReceiptItem } from '@/types';

interface Props {
  id: string;
  receiptNumber: string;
  date: string;
  total: number;
  itemCount: number;
  paymentMethod: string;
  status: string;
  items: ReceiptItem[];
  onStatusChange?: (newStatus: string) => void;
}

const ReceiptCard: React.FC<Props> = ({
  id,
  receiptNumber,
  date,
  total,
  itemCount,
  paymentMethod,
  status,
  items,
  onStatusChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleImageError = (idx: number) => {
    setImageErrors((prev) => ({ ...prev, [idx]: true }));
  };

  const handleRefund = async () => {
    setIsLoading(true);
    try {
      const endpoint =
        paymentMethod === 'cash'
          ? `/api/checkout/cash/${id}`
          : `/api/checkout/crypto/${id}`;
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update order');
      }

      setCurrentStatus('cancelled');
      onStatusChange?.('cancelled');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error al actualizar el pedido: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const formattedDate = new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-[#D1FAE5] text-[#065F46] rounded-[20px]';
      case 'pending':
        return 'bg-[#FEF3C7] text-[#92400E] rounded-[20px]';
      case 'cancelled':
        return 'bg-[#FEE2E2] text-[#991B1B] rounded-[20px]';
      default:
        return 'bg-[#F3F4F6] text-[#374151] rounded-[20px]';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      completed: 'Completado',
      pending: 'Pendiente',
      cancelled: 'Cancelado',
    };
    return labels[status] || status;
  };

  return (
    <div className="border rounded-lg shadow-sm transition-all duration-300 bg-white border-[#E5E7EB] hover:shadow-md hover:border-[#D1D5DB] hover:-translate-y-1">
      {/* Main Content */}
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex items-center justify-center w-10 h-10 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
                <FileText size={20} className="text-[#F88612]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#000000]">
                  Recibo #{receiptNumber}
                </h3>
                <p className="text-xs text-[#9CA3AF]">{formattedDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4 sm:grid-cols-4">
              <div>
                <p className="text-xs text-[#9CA3AF] mb-1">Artículos</p>
                <p className="font-semibold text-[#000000]">{itemCount}</p>
              </div>
              <div>
                <p className="text-xs text-[#9CA3AF] mb-1">Total</p>
                <p className="font-semibold text-[#F88612]">
                  ${total.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#9CA3AF] mb-1">Método</p>
                {paymentMethod === 'cash' && (
                  <div className="flex items-center gap-2 text-sm font-semibold uppercase text-[#10B981]">
                    <Banknote size={14} />
                    <span>EFECTIVO</span>
                  </div>
                )}
                {paymentMethod === 'bitcoin' && (
                  <div className="flex items-center gap-2 text-sm font-semibold uppercase text-[#F88612]">
                    <Bitcoin size={14} />
                    <span>BITCOIN</span>
                  </div>
                )}
                {paymentMethod === 'lightning' && (
                  <div className="flex items-center gap-2 text-sm font-semibold uppercase text-[#FFBD00]">
                    <Zap size={14} />
                    <span>LIGHTNING</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-[#9CA3AF]">Estado</p>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    currentStatus,
                  )}`}
                >
                  {getStatusLabel(currentStatus)}
                </span>
              </div>
            </div>
          </div>

          {/* Expand Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 transition-colors rounded-lg hover:bg-[#F3F4F6] ml-4"
          >
            <svg
              className={`w-5 h-5 text-[#F88612] transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
            {/* Receipt Header */}
            <div className="mb-6 p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-[#000000]">
                    Recibo de Compra
                  </h4>
                  <p className="text-xs text-[#9CA3AF]">
                    #{receiptNumber} • {formattedDate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#9CA3AF]">Total</p>
                  <p className="text-2xl font-bold text-[#F88612]">
                    ${total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Items Details */}
            <div className="mb-4">
              <h4 className="font-semibold text-[#000000] mb-3">
                Detalles del pedido
              </h4>
              <div className="space-y-2">
                {items && items.length > 0 ? (
                  <>
                    {items.map((item, idx) => {
                      const price = Number(item.price) || 0;
                      const quantity = Number(item.quantity) || 0;
                      const itemTotal = Number(item.total) || price * quantity;

                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors relative"
                        >
                          <div className="flex-shrink-0 w-16 h-16 bg-[#F9FAFB] rounded border border-[#E5E7EB] flex items-center justify-center overflow-hidden">
                            {item.image && !imageErrors[idx] ? (
                              <img
                                src={item.image}
                                alt={item.productName}
                                className="w-full h-full object-cover"
                                onError={() => handleImageError(idx)}
                              />
                            ) : (
                              <Package size={24} className="text-[#D1D5DB]" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[#000000] truncate">
                              {item.productName || 'Producto'}
                            </p>
                            <p className="text-xs text-[#9CA3AF]">
                              {quantity} x ${price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <p className="font-semibold text-[#F88612]">
                              ${itemTotal.toFixed(2)}
                            </p>
                            {item.productId && (
                              <p className="text-[10px] text-[#9CA3AF] mt-1 font-mono max-w-[150px] truncate">
                                {item.productId}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Summary Line */}
                    <div className="mt-4 pt-3 border-t border-[#E5E7EB]">
                      <div className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg">
                        <p className="font-bold text-[#000000]">Subtotal</p>
                        <p className="font-bold text-[#F88612]">
                          ${total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-[#9CA3AF]">
                    No hay detalles disponibles
                  </p>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
              <div>
                <p className="text-xs text-[#9CA3AF]">Método de Pago</p>
                <p className="text-sm font-semibold text-[#000000]">
                  {paymentMethod === 'cash'
                    ? 'Efectivo'
                    : paymentMethod === 'crypto'
                      ? 'Criptomoneda'
                      : paymentMethod}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#9CA3AF]">Estado</p>
                <p
                  className={`text-sm font-semibold ${
                    currentStatus === 'completed'
                      ? 'text-[#A94D14]'
                      : currentStatus === 'pending'
                        ? 'text-[#92400E]'
                        : 'text-[#991B1B]'
                  }`}
                >
                  {currentStatus === 'completed'
                    ? 'Completado'
                    : currentStatus === 'pending'
                      ? 'Pendiente'
                      : 'Cancelado'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-[#E5E7EB]">
              <button
                onClick={() => {
                  const html = buildReceiptHtml({
                    receiptNumber,
                    date: formattedDate,
                    total,
                    items,
                    status: currentStatus,
                  });
                  const iframe = document.createElement('iframe');
                  iframe.style.position = 'fixed';
                  iframe.style.right = '0';
                  iframe.style.bottom = '0';
                  iframe.style.width = '0';
                  iframe.style.height = '0';
                  iframe.style.border = 'none';
                  document.body.appendChild(iframe);
                  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                  if (iframeDoc) {
                    iframeDoc.open();
                    iframeDoc.write(html);
                    iframeDoc.close();
                    setTimeout(() => {
                      iframe.contentWindow?.print();
                      setTimeout(() => document.body.removeChild(iframe), 500);
                    }, 250);
                  }
                }}
                className="flex items-center justify-center space-x-2 flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB]"
              >
                <Eye size={16} />
                <span className="hidden sm:inline">Ver</span>
              </button>
              <button
                onClick={async () => {
                  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
                    import('jspdf'),
                    import('html2canvas'),
                  ]);
                  const html = buildReceiptHtml({
                    receiptNumber,
                    date: formattedDate,
                    total,
                    items,
                    status: currentStatus,
                  });
                  const iframe = document.createElement('iframe');
                  iframe.style.position = 'fixed';
                  iframe.style.right = '0';
                  iframe.style.bottom = '0';
                  iframe.style.width = '800px';
                  iframe.style.height = '600px';
                  iframe.style.border = 'none';
                  iframe.style.opacity = '0';
                  iframe.style.pointerEvents = 'none';
                  document.body.appendChild(iframe);
                  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                  if (iframeDoc) {
                    iframeDoc.open();
                    iframeDoc.write(html);
                    iframeDoc.close();
                    await new Promise((resolve) => setTimeout(resolve, 800));
                    const element = iframeDoc.querySelector('.card') as HTMLElement;
                    if (element) {
                      const canvas = await html2canvas(element, {
                        scale: 2,
                        useCORS: true,
                        logging: false,
                        backgroundColor: '#ffffff',
                        windowWidth: element.scrollWidth,
                        windowHeight: element.scrollHeight,
                      });
                      const imgData = canvas.toDataURL('image/jpeg', 0.95);
                      const pdf = new jsPDF('p', 'mm', 'a4');
                      const imgWidth = 210;
                      const pageHeight = 297;
                      const imgHeight = (canvas.height * imgWidth) / canvas.width;
                      let heightLeft = imgHeight;
                      let position = 0;
                      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                      heightLeft -= pageHeight;
                      while (heightLeft >= 0) {
                        position = heightLeft - imgHeight;
                        pdf.addPage();
                        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                        heightLeft -= pageHeight;
                      }
                      pdf.save(`recibo-${receiptNumber}.pdf`);
                    }
                    document.body.removeChild(iframe);
                  }
                }}
                className="flex items-center justify-center space-x-2 flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 bg-[#F88612] text-white hover:bg-[#E07A0A] shadow-sm hover:shadow-md"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Descargar</span>
              </button>
              {currentStatus !== 'cancelled' && (
                <button
                  onClick={handleRefund}
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-2 flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RotateCcw size={16} />
                  <span className="hidden sm:inline">Reembolsar</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Printable Receipt Modal */}
      <PrintableReceiptModal
        open={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        receiptNumber={receiptNumber}
        date={formattedDate}
        total={total}
        items={items}
        paymentMethod={paymentMethod}
        status={status}
      />
    </div>
  );
};

export default ReceiptCard;
