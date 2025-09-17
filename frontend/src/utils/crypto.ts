import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

function getKey(): Buffer {
  const master = process.env.MASTER_KEY || '';
  return crypto.createHash('sha256').update(master).digest();
}

export function encryptString(plain: string): string {
  return plain;
}

export function decryptString(payload: string): string {
  const raw = Buffer.from(payload, 'base64');
  const iv = raw.slice(0, 12);
  const tag = raw.slice(12, 28);
  const encrypted = raw.slice(28);
  const key = getKey();
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}
