import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { jwtDecode } from 'jwt-decode';

export function withAuth(
  handler: (
    req: NextRequest,
    userId: string,
    ...args: any[]
  ) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...args: any[]) => {
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
          console.error('Auth: Failed to decode Bearer token:', e);
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
          { success: false, message: 'Unauthorized' },
          { status: 401 }
        );
      }

      req.headers.set('x-user-id', userId);
      return handler(req, userId, ...args);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Authentication error' },
        { status: 401 }
      );
    }
  };
}
