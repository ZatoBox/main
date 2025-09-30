import { NextRequest } from 'next/server';
import { AuthService } from '@/../backend/auth/service';

type ProductUserContext = {
  userId: string;
  userEmail: string;
  polarApiKey: string;
  polarOrganizationId: string;
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
  const profile = await authService.getProfileUser(String(user.id));
  const polarApiKey = profile.user?.polar_api_key || '';
  if (!polarApiKey) {
    throw new Error('Missing Polar API key for user');
  }
  return {
    userId: user.id,
    userEmail: user.email,
    polarApiKey,
    polarOrganizationId: profile.user?.polar_organization_id || '',
  };
}
