import { NextRequest } from 'next/server';
import { AuthService } from '@/backend/auth/service';

type ProductUserContext = {
  userId: string;
  userEmail: string;
};

export async function resolveCurrentProductUser(
  req: NextRequest
): Promise<ProductUserContext> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing authentication token');
  }
  const token = authHeader.split(' ')[1];
  const authService = new AuthService();
  const user = await authService.verifyToken(token);
  return {
    userId: user.id,
    userEmail: user.email,
  };
}
