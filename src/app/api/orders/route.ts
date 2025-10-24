import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { jwtDecode } from 'jwt-decode';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cookieHeader = req.headers.get('cookie');

    let userId: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      try {
        const decoded = jwtDecode<{
          sub?: string;
          id?: string;
          user_id?: string;
        }>(token);
        userId = decoded.sub || decoded.id || decoded.user_id || null;
      } catch (e) {
        console.error('Failed to decode Bearer token:', e);
        userId = null;
      }
    }

    if (!userId && cookieHeader) {
      const cookies = Object.fromEntries(
        cookieHeader.split('; ').map((c) => {
          const [key, ...val] = c.split('=');
          return [decodeURIComponent(key), decodeURIComponent(val.join('='))];
        })
      );

      const token = cookies['zatobox_token'];
      if (token) {
        try {
          const decoded = jwtDecode<{
            sub?: string;
            id?: string;
            user_id?: string;
          }>(token);
          userId = decoded.sub || decoded.id || decoded.user_id || null;
        } catch (e) {
          console.error('JWT decode error:', e);
          userId = null;
        }
      }
    }

    if (!userId) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        userId = user.id;
      }
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    const { data: orders, error } = await supabase
      .from('cash_orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Error al cargar órdenes',
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        orders: orders || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/orders:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
