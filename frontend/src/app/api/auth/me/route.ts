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
