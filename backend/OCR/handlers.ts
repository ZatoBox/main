import { createGeminiClient } from './client';

const RATE_LIMIT_SECONDS = 300;
const userLastRequest: Map<string, number> = new Map();

export type OCRResponse = {
  text: string;
  confidence?: number;
  language?: string;
  products?: Array<Record<string, unknown>>;
  line_items?: Array<Record<string, unknown>>;
  metadata?: Record<string, unknown>;
};

export function parseAuthHeader(authHeader: string | null | undefined) {
  if (!authHeader) return 'anonymous';
  return authHeader.startsWith('Bearer ')
    ? authHeader.replace('Bearer ', '')
    : authHeader;
}

export const ALLOWED_TYPES = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/webp',
  'application/pdf',
];

function cleanString(value: unknown, fallback = ''): string {
  if (value === null || value === undefined) return fallback;
  const str = typeof value === 'string' ? value : String(value);
  const trimmed = str.trim();
  return trimmed || fallback;
}

function normalizeNumberString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const raw = typeof value === 'string' ? value : String(value);
  let cleaned = raw.trim().replace(/[^0-9.,-\s]/g, '');
  if (!cleaned) return null;
  cleaned = cleaned.replace(/\s+/g, '');
  const hasDot = cleaned.includes('.');
  const hasComma = cleaned.includes(',');
  if (hasDot && hasComma) {
    if (cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')) {
      cleaned = cleaned.replace(/\./g, '').replace(/,/g, '.');
    } else {
      cleaned = cleaned.replace(/,/g, '');
    }
  } else if (hasComma) {
    cleaned = cleaned.replace(/,/g, '.');
  }
  const num = parseFloat(cleaned);
  if (!Number.isFinite(num)) return null;
  return num.toFixed(2);
}

function parseQuantity(value: unknown): number {
  if (value === null || value === undefined) return 1;
  if (typeof value === 'number') {
    const n = Math.floor(value);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }
  const normalized = normalizeNumberString(value);
  if (normalized) {
    const floored = Math.floor(parseFloat(normalized));
    if (Number.isFinite(floored) && floored > 0) return floored;
  }
  const digits = String(value).replace(/[^0-9]/g, '');
  const parsed = parseInt(digits, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export async function processImageFile(params: {
  file: File;
  authHeader: string | null | undefined;
  env: any;
}): Promise<OCRResponse> {
  const { file, authHeader, env } = params;
  const userId = parseAuthHeader(authHeader);
  const now = Date.now() / 1000;
  const last = userLastRequest.get(userId) ?? 0;
  if (now - last < RATE_LIMIT_SECONDS)
    throw { status: 429, message: 'rate_limited' };
  userLastRequest.set(userId, now);

  if (!ALLOWED_TYPES.includes(file.type))
    throw { status: 400, message: 'invalid_type' };

  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) throw { status: 500, message: 'GEMINI_API_KEY not configured' };

  const client = createGeminiClient(apiKey);

  const arrayBuffer = await file.arrayBuffer();
  const uint8 = new Uint8Array(arrayBuffer);
  const base64Data = Buffer.from(uint8).toString('base64');

  const prompt = env.OCR_PROMPT || '';

  const parts = [
    { text: prompt },
    { inlineData: { mimeType: file.type, data: base64Data } },
  ];

  const model = client.getGenerativeModel({ model: 'gemini-2.0-flash-001' });
  const result = await model.generateContent(parts);
  const response = result.response;

  let extractedText = response.text();

  extractedText = extractedText.trim();
  if (extractedText.startsWith('```json'))
    extractedText = extractedText.slice(7);
  if (extractedText.endsWith('```')) extractedText = extractedText.slice(0, -3);
  extractedText = extractedText.trim();

  try {
    const parsed = JSON.parse(extractedText);
    let lineItems: Array<Record<string, unknown>> = [];
    let metadata: Record<string, unknown> = {};

    if (Array.isArray(parsed)) {
      lineItems = parsed as Array<Record<string, unknown>>;
    } else if (parsed && typeof parsed === 'object') {
      const obj = parsed as Record<string, unknown>;
      if (Array.isArray(obj.line_items)) {
        lineItems = obj.line_items as Array<Record<string, unknown>>;
      } else if (Array.isArray(obj.items)) {
        lineItems = obj.items as Array<Record<string, unknown>>;
      } else if (Array.isArray(obj.products)) {
        lineItems = obj.products as Array<Record<string, unknown>>;
      } else if (Array.isArray(obj.productos)) {
        lineItems = obj.productos as Array<Record<string, unknown>>;
      } else {
        lineItems = [obj];
      }

      if (obj.metadata && typeof obj.metadata === 'object') {
        metadata = obj.metadata as Record<string, unknown>;
      } else {
        const metadataKeys = [
          'company_name',
          'ruc',
          'date',
          'invoice_number',
          'subtotal',
          'iva',
          'tax',
          'total',
        ];
        metadataKeys.forEach((key) => {
          if (key in obj) metadata[key] = obj[key] as unknown;
        });
      }
    }

    let subtotalAcc = 0;
    const processedItems = (lineItems || []).map((item) => {
      const record = item || {};
      const unitNorm =
        normalizeNumberString(
          (record as any).unit_price ??
            (record as any).price ??
            (record as any).precio ??
            ''
        ) || '0.00';
      const qty = parseQuantity(
        (record as any).quantity ??
          (record as any).qty ??
          (record as any).cantidad ??
          1
      );
      const providedTotal = normalizeNumberString(
        (record as any).total_price ??
          (record as any).total ??
          (record as any).importe ??
          ''
      );
      const unitValue = parseFloat(unitNorm);
      const computedTotal = unitValue * qty;
      let finalTotal = Number.isFinite(computedTotal)
        ? computedTotal.toFixed(2)
        : '0.00';
      if (providedTotal) {
        const providedValue = parseFloat(providedTotal);
        if (Number.isFinite(providedValue)) {
          if (Number.isFinite(computedTotal)) {
            if (Math.abs(providedValue - computedTotal) <= 0.02) {
              finalTotal = providedValue.toFixed(2);
            }
          } else {
            finalTotal = providedValue.toFixed(2);
          }
        }
      }
      const finalTotalValue = parseFloat(finalTotal);
      subtotalAcc += Number.isFinite(finalTotalValue) ? finalTotalValue : 0;

      return {
        ...record,
        name: cleanString(
          (record as any).name ??
            (record as any).nombre ??
            (record as any).product ??
            (record as any).descripcion ??
            'Unnamed Product',
          'Unnamed Product'
        ),
        description: cleanString(
          (record as any).description ??
            (record as any).descripcion ??
            (record as any).name ??
            (record as any).nombre ??
            'No description',
          'No description'
        ),
        category: cleanString(
          (record as any).category ?? (record as any).categoria ?? 'General',
          'General'
        ),
        unit_price: unitNorm,
        quantity: qty,
        total_price: finalTotal,
      } as Record<string, unknown>;
    });

    const metadataSubtotal =
      normalizeNumberString(
        (metadata as any)?.subtotal ??
          (metadata as any)?.Subtotal ??
          (metadata as any)?.sub_total ??
          ''
      ) || subtotalAcc.toFixed(2);
    const metadataIva =
      normalizeNumberString(
        (metadata as any)?.iva ?? (metadata as any)?.tax ?? ''
      ) || '';
    let metadataTotal =
      normalizeNumberString(
        (metadata as any)?.total ?? (metadata as any)?.Total ?? ''
      ) || '';
    const subtotalNumber = parseFloat(metadataSubtotal);
    const ivaNumber = metadataIva ? parseFloat(metadataIva) : 0;
    if (!metadataTotal) {
      if (Number.isFinite(subtotalNumber)) {
        const sum =
          subtotalNumber + (Number.isFinite(ivaNumber) ? ivaNumber : 0);
        metadataTotal = sum.toFixed(2);
      }
    }

    const finalMetadata: Record<string, unknown> = {
      company_name: cleanString(
        (metadata as any)?.company_name ?? (metadata as any)?.company ?? ''
      ),
      ruc: cleanString((metadata as any)?.ruc ?? ''),
      date: cleanString((metadata as any)?.date ?? ''),
      invoice_number: cleanString(
        (metadata as any)?.invoice_number ?? (metadata as any)?.invoice ?? ''
      ),
      subtotal: metadataSubtotal,
      iva: metadataIva,
      total: metadataTotal,
    };

    const products = processedItems.length > 0 ? processedItems : undefined;

    return {
      text: extractedText,
      confidence: 0.95,
      language: 'es',
      products,
      line_items: processedItems,
      metadata: finalMetadata,
    };
  } catch (e) {
    return { text: extractedText, confidence: 0.95, language: 'es' };
  }
}

export async function sendBulk(params: {
  data: any;
  authHeader: string | null | undefined;
  env: any;
}) {
  const { data, authHeader, env } = params;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (authHeader) {
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.replace('Bearer ', '')
      : authHeader;
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`/api/products/bulk`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  const text = await res.text();
  try {
    return { status: res.status, ok: res.ok, body: JSON.parse(text) };
  } catch {
    return { status: res.status, ok: res.ok, body: text };
  }
}
