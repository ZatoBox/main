import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const { provider, fullName, email, password, phone, address } =
      await request.json();
    const supabase = createClient(cookies());

    if (provider) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${new URL(request.url).origin}/auth/callback`,
        },
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ data }, { status: 200 });
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            fullName,
            phone,
            address,
          },
        },
      });

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status || 400 }
        );
      }

      return NextResponse.json({ user: data.user }, { status: 201 });
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
