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

    const products = lineItems.length > 0 ? lineItems : undefined;

    return {
      text: extractedText,
      confidence: 0.95,
      language: 'es',
      products,
      line_items: lineItems,
      metadata,
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
