import { NextRequest, NextResponse } from 'next/server';
import { polarAPI } from '@/utils/polar.utils';
import { resolveCurrentProductUser } from '../auth';

type ArchiveResult = {
  id: string;
  product: any;
};

type ArchiveError = {
  id: string;
  message: string;
};

export async function POST(req: NextRequest) {
  try {
    const { polarApiKey } = await resolveCurrentProductUser(req);
    const body = await req.json();
    const idsInput: unknown[] = Array.isArray(body?.ids) ? body.ids : [];
    const ids = Array.from(
      new Set(
        idsInput.reduce<string[]>((acc, value) => {
          if (typeof value === 'string' && value.trim()) {
            acc.push(value.trim());
            return acc;
          }
          if (typeof value === 'number' && Number.isFinite(value)) {
            acc.push(String(value));
            return acc;
          }
          return acc;
        }, [])
      )
    );
    if (ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'No product IDs provided',
          results: [],
          errors: [],
        },
        { status: 400 }
      );
    }
    const results: ArchiveResult[] = [];
    const errors: ArchiveError[] = [];
    for (const id of ids) {
      try {
        const product: any = await polarAPI.updateProduct(polarApiKey, id, {
          is_archived: true,
        });
        results.push({ id, product });
      } catch (error: any) {
        const message =
          typeof error?.message === 'string'
            ? error.message
            : 'Failed to archive product';
        errors.push({ id, message });
      }
    }
    if (results.length === 0 && errors.length > 0) {
      return NextResponse.json(
        { success: false, results, errors },
        { status: 500 }
      );
    }
    const status = errors.length > 0 ? 207 : 200;
    return NextResponse.json(
      { success: errors.length === 0, results, errors },
      { status }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Failed to archive products',
        results: [],
        errors: [],
      },
      { status: 500 }
    );
  }
}
