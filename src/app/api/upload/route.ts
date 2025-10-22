import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToCloudinary } from '@/utils/cloudinary';
import { AuthService } from '@/backend/auth/service';

async function getCurrentUserId(req: NextRequest): Promise<string> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing authentication token');
  }
  const token = authHeader.split(' ')[1];
  const authService = new AuthService();
  const user = await authService.verifyToken(token);
  return user.id;
}

export async function POST(req: NextRequest) {
  try {
    await getCurrentUserId(req);

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    const url = await uploadImageToCloudinary(file);

    return NextResponse.json({ success: true, url }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
