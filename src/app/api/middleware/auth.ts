import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function withAuth(
  handler: (req: NextRequest, userId: string) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Unauthorized' },
          { status: 401 }
        );
      }

      req.headers.set('x-user-id', user.id);
      return handler(req, user.id);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Authentication error' },
        { status: 401 }
      );
    }
  };
}
