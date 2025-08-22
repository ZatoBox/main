import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = createClient(cookies());
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = userData.user.id;
    const { data, error } = await supabase
      .from('users')
      .select('id,email,full_name,phone,address,role,created_at,last_updated')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116' || (error as any)?.status === 404) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(
        { error: error.message || 'Query error' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createClient(cookies());
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let body: any;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const allowedFields = ['full_name', 'phone', 'address'];
    const updatePayload: Record<string, unknown> = {};

    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        const val = body[key];
        if (val === null || val === undefined) {
          updatePayload[key] = null;
        } else if (typeof val === 'string') {
          const trimmed = val.trim();
          if (trimmed.length === 0) {
            updatePayload[key] = null;
          } else {
            updatePayload[key] = trimmed;
          }
        } else {
          return NextResponse.json(
            { error: `Invalid type for field ${key}` },
            { status: 400 }
          );
        }
      }
    }

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json(
        { error: 'No updatable fields provided' },
        { status: 400 }
      );
    }

    updatePayload.last_updated = new Date().toISOString();

    const userId = userData.user.id;
    const { data, error } = await supabase
      .from('users')
      .update(updatePayload)
      .eq('id', userId)
      .select('id,email,full_name,phone,address,role,created_at,last_updated')
      .single();

    if (error) {
      if (error.code === 'PGRST116' || (error as any)?.status === 404) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(
        { error: error.message || 'Update error' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
