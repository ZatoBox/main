import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';

function getKey(): Buffer {
  const mk = process.env.MASTER_KEY || '';
  if (!mk) throw new Error('Missing MASTER_KEY');
  const key = Buffer.from(mk, 'utf8');
  if (key.length !== 32) throw new Error('Invalid MASTER_KEY length');
  return key;
}

export function decryptData(encryptedData: string): string {
  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 2) {
      return encryptedData;
    }

    const [ivHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
    let decrypted = decipher.update(encrypted, undefined, 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Error decrypting data:', error);
    return encryptedData;
  }
}

export function decryptAny(encrypted: string): string {
  if (!encrypted) return '';
  if (encrypted.startsWith('polar_oat_')) return encrypted;
  try {
    const out = decryptData(encrypted);
    if (out && out.startsWith('polar_oat_')) return out;
  } catch {}
  return encrypted;
}

export function encryptData(data: string): string {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Error encrypting data:', error);
    return data;
  }
}
