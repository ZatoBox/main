import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/utils/supabase/server';
import crypto from 'crypto';
import { getCurrentTimeWithTimezone } from '@/utils/timezone';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, code } = body;
    if (!userId || !code) {
      return NextResponse.json(
        { success: false, message: 'Missing userId or code' },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('email_verifications')
      .select('*')
      .eq('user_id', userId)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, message: 'Code not found' },
        { status: 404 },
      );
    }

    const now = new Date();
    if (new Date(data.expires_at) < now) {
      return NextResponse.json(
        { success: false, message: 'Expired' },
        { status: 400 },
      );
    }

    const secret = process.env.EMAIL_VERIFICATION_SECRET || '';
    const hmac = crypto
      .createHmac('sha256', secret)
      .update(String(code))
      .digest('hex');
    const a = Buffer.from(hmac, 'hex');
    const b = Buffer.from(data.code_hash, 'hex');
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return NextResponse.json(
        { success: false, message: 'Invalid code' },
        { status: 400 },
      );
    }

    if (!data.metadata) {
      return NextResponse.json(
        { success: false, message: 'Invalid verification data' },
        { status: 400 },
      );
    }

    let registrationData;
    try {
      const parts = data.metadata.split(':');
      const iv = Buffer.from(parts[0], 'hex');
      const encryptedText = parts[1];
      const key = crypto.scryptSync(secret, 'salt', 32);
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      registrationData = JSON.parse(decrypted);
    } catch (e) {
      return NextResponse.json(
        { success: false, message: 'Invalid verification data' },
        { status: 400 },
      );
    }

    const { full_name, email, password, phone } = registrationData;

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 409 },
      );
    }

    const adminSupabase = createAdminClient();
    const { data: authData, error: authError } =
      await adminSupabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name,
          phone: phone || undefined,
        },
      });

    if (authError) {
      const msg = authError.message || '';
      if (/exists/i.test(msg) || /registered/i.test(msg)) {
        return NextResponse.json(
          { success: false, message: 'Email already exists' },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { success: false, message: msg || 'Failed to create auth user' },
        { status: 500 },
      );
    }

    const authUserId = authData?.user?.id;
    if (!authUserId) {
      return NextResponse.json(
        { success: false, message: 'Failed to retrieve auth user ID' },
        { status: 500 },
      );
    }

    const nowTimestamp = getCurrentTimeWithTimezone('UTC');
    try {
      await supabase.from('users').insert({
        id: authUserId,
        full_name,
        email,
        phone: phone || null,
        role: 'user',
        email_verified: true,
        email_verified_at: nowTimestamp,
        created_at: nowTimestamp,
        last_updated: nowTimestamp,
      });
    } catch (e: any) {
      await adminSupabase.auth.admin
        .deleteUser(authUserId)
        .catch(() => undefined);
      return NextResponse.json(
        { success: false, message: 'Failed to persist user profile' },
        { status: 500 },
      );
    }

    await supabase
      .from('email_verifications')
      .update({ used: true })
      .eq('id', data.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed' },
      { status: 500 },
    );
  }
}
