import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const MASTER_KEY = process.env.MASTER_KEY || 'f8d3a9c7b6e4f1d2a5c8e0b9d7f6a3c2';

export function decryptData(encryptedData: string): string {
  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 2) {
      return encryptedData;
    }

    const [ivHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');

    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(MASTER_KEY, 'hex'),
      iv
    );
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
  try {
    const parts = encrypted.split(':');
    if (parts.length === 2) {
      const [ivB64, dataB64] = parts;
      const iv = Buffer.from(ivB64, 'base64');
      const buf = Buffer.from(dataB64, 'base64');
      const decipher = crypto.createDecipheriv(
        ALGORITHM,
        Buffer.from(MASTER_KEY, 'hex'),
        iv
      );
      let dec = decipher.update(buf, undefined, 'utf8');
      dec += decipher.final('utf8');
      if (dec && dec.startsWith('polar_oat_')) return dec;
    }
  } catch {}
  try {
    const json = JSON.parse(encrypted);
    const ivStr = json.iv || json.nonce;
    const dataStr = json.data || json.ciphertext;
    if (ivStr && dataStr) {
      const iv = /^[A-Fa-f0-9]+$/.test(ivStr)
        ? Buffer.from(ivStr, 'hex')
        : Buffer.from(ivStr, 'base64');
      const buf = /^[A-Fa-f0-9]+$/.test(dataStr)
        ? Buffer.from(dataStr, 'hex')
        : Buffer.from(dataStr, 'base64');
      const decipher = crypto.createDecipheriv(
        ALGORITHM,
        Buffer.from(MASTER_KEY, 'hex'),
        iv
      );
      let dec = decipher.update(buf, undefined, 'utf8');
      dec += decipher.final('utf8');
      if (dec && dec.startsWith('polar_oat_')) return dec;
    }
  } catch {}
  try {
    const b = Buffer.from(encrypted, 'base64').toString('utf8');
    if (b && b.startsWith('polar_oat_')) return b;
  } catch {}
  return encrypted;
}

export function encryptData(data: string): string {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      ALGORITHM,
      Buffer.from(MASTER_KEY, 'hex'),
      iv
    );
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Error encrypting data:', error);
    return data;
  }
}
