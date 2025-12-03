export interface PrintableItem {
  productName?: string;
  quantity?: number;
  price?: number;
  total?: number;
}

export interface PrintableReceiptData {
  receiptNumber: string;
  date: string;
  status: string;
  total: number;
  items: PrintableItem[];
}

export function buildReceiptHtml(data: PrintableReceiptData): string {
  const rows = (data.items || [])
    .map((it) => {
      const q = Number(it.quantity || 0);
      const p = Number(it.price || 0);
      const t = Number(it.total ?? q * p);
      return `
        <tr>
          <td>${escapeHtml(it.productName || 'Producto')}</td>
          <td class="text-center">${q}</td>
          <td class="text-right">$${p.toFixed(2)}</td>
          <td class="text-right strong">$${t.toFixed(2)}</td>
        </tr>
      `;
    })
    .join('');

  const statusLabel =
    data.status === 'completed'
      ? 'Completado'
      : data.status === 'pending'
      ? 'Pendiente'
      : 'Cancelado';

  return `<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Recibo ${escapeHtml(data.receiptNumber)}</title>
    <style>
      :root { color-scheme: light; }
      * { box-sizing: border-box; }
      body { margin: 0; padding: 24px; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #111827; }
      .card { max-width: 720px; margin: 0 auto; background: #fff; border: 1px solid #E5E7EB; border-radius: 12px; padding: 24px; }
      .header { text-align: center; padding-bottom: 16px; border-bottom: 2px solid #E5E7EB; margin-bottom: 16px; }
      .brand { font-weight: 800; font-size: 24px; color: #F88612; margin: 0 0 4px; }
      .muted { color: #6B7280; font-size: 12px; margin: 0; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0 24px; }
      .right { text-align: right; }
      table { width: 100%; border-collapse: collapse; margin-top: 8px; }
      th, td { padding: 10px 8px; font-size: 14px; border-bottom: 1px solid #E5E7EB; }
      th { color: #6B7280; font-weight: 600; text-align: left; }
      .text-center { text-align: center; }
      .text-right { text-align: right; }
      .strong { font-weight: 700; color: #F88612; }
      .total { display: flex; justify-content: space-between; align-items: center; border-top: 2px solid #E5E7EB; padding-top: 12px; margin-top: 16px; }
      .total .label { font-size: 18px; font-weight: 700; }
      .total .value { font-size: 22px; font-weight: 800; color: #F88612; }
      .footer { text-align: center; color: #6B7280; font-size: 12px; margin-top: 16px; padding-top: 12px; border-top: 1px solid #E5E7EB; }
      @media print {
        body { padding: 0; }
        .card { border: none; border-radius: 0; max-width: none; width: 100%; }
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <h1 class="brand">ZatoBox</h1>
        <p class="muted">RECIBO DE COMPRA</p>
        <p class="muted">#${escapeHtml(data.receiptNumber)}</p>
      </div>
      <div class="grid">
        <div>
          <div class="muted">Fecha</div>
          <div>${escapeHtml(data.date)}</div>
        </div>
        <div class="right">
          <div class="muted">Estado</div>
          <div>${statusLabel}</div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th class="text-center">Cantidad</th>
            <th class="text-right">Precio Unit.</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${rows || `<tr><td colspan="4" class="text-center muted">No hay artículos</td></tr>`}
        </tbody>
      </table>
      <div class="total">
        <div class="label">TOTAL</div>
        <div class="value">$${Number(data.total || 0).toFixed(2)}</div>
      </div>
      <div class="footer">
        <div>Gracias por tu compra</div>
        <div>www.zatobox.io</div>
      </div>
    </div>
  </body>
  </html>`;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


