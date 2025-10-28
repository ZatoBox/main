import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { render } from '@react-email/render';
import VerificationEmail from '@/emails/VerificationEmail';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'userId required' },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const { data: verification } = await supabase
      .from('email_verifications')
      .select('metadata, created_at')
      .eq('user_id', userId)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!verification || !verification.metadata) {
      return NextResponse.json(
        { success: false, message: 'Verification session not found' },
        { status: 404 },
      );
    }

    const lastTime = new Date(verification.created_at).getTime();
    const now = Date.now();
    const diff = Math.floor((now - lastTime) / 1000);
    const limitSeconds = 60;
    if (diff < limitSeconds) {
      const retryAfter = limitSeconds - diff;
      return NextResponse.json(
        { success: false, message: 'Too many requests', retryAfter },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } },
      );
    }

    const secret = process.env.EMAIL_VERIFICATION_SECRET;
    if (!secret) {
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 },
      );
    }

    let registrationData;
    try {
      const parts = verification.metadata.split(':');
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

    const targetEmail = registrationData.email;
    if (!targetEmail) {
      return NextResponse.json(
        { success: false, message: 'Email not found' },
        { status: 400 },
      );
    }

    const code = String(100000 + crypto.randomInt(900000));
    const codeHash = crypto
      .createHmac('sha256', secret)
      .update(code)
      .digest('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15).toISOString();

    await supabase
      .from('email_verifications')
      .update({ used: true })
      .eq('user_id', userId)
      .eq('used', false);

    await supabase.from('email_verifications').insert({
      user_id: userId,
      code_hash: codeHash,
      expires_at: expiresAt,
      used: false,
      metadata: verification.metadata,
    });

    const siteUrl = process.env.SITE_URL || '';
    const html = await render(VerificationEmail({ code, siteUrl }));

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const from = process.env.EMAIL_FROM || 'no-reply@example.com';

    if (!host || !smtpUser || !smtpPass) {
      return NextResponse.json(
        { success: false, message: 'SMTP not configured' },
        { status: 500 },
      );
    }

    const ehloName = (() => {
      try {
        return new URL(siteUrl).hostname || 'localhost';
      } catch (e) {
        return 'localhost';
      }
    })();

    const fromAddress =
      process.env.EMAIL_FROM || smtpUser || 'no-reply@example.com';

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: true,
      name: ehloName,
      authMethod: 'LOGIN',
      auth: { user: smtpUser, pass: smtpPass },
      tls: { rejectUnauthorized: true, minVersion: 'TLSv1.2' },
      greetingTimeout: 30000,
      connectionTimeout: 30000,
      socketTimeout: 30000,
    });

    const mailOptions = {
      from: fromAddress,
      to: targetEmail,
      subject: 'Verifica tu correo',
      html,
    } as any;

    try {
      await transporter.sendMail(mailOptions);
    } catch (err: any) {
      const msg = String(err?.message || err || '');
      if (
        /Greeting never received|ECONNECTION|ETIMEDOUT|ENOTFOUND/i.test(msg)
      ) {
        try {
          const fbTransporter = nodemailer.createTransport({
            host,
            port: 587,
            secure: false,
            requireTLS: true,
            name: ehloName,
            authMethod: 'PLAIN',
            auth: { user: smtpUser, pass: smtpPass },
            tls: { rejectUnauthorized: false, minVersion: 'TLSv1.2' },
            greetingTimeout: 30000,
            connectionTimeout: 30000,
            socketTimeout: 30000,
          });
          await fbTransporter.sendMail(mailOptions);
        } catch (err2: any) {
          throw err2;
        }
      } else {
        throw err;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed' },
      { status: 500 },
    );
  }
}
