import { xchacha20poly1305 } from '@noble/ciphers/chacha.js';
import { utf8ToBytes, bytesToUtf8 } from '@noble/ciphers/utils.js';
import crypto from 'crypto';

function getEncryptionKey(): Uint8Array {
  const keyEnv = process.env.XPUB_ENCRYPTION_KEY;
  if (!keyEnv) {
    throw new Error('XPUB_ENCRYPTION_KEY environment variable is required');
  }
  if (keyEnv.length !== 64) {
    throw new Error('XPUB_ENCRYPTION_KEY must be 64 characters (32 bytes hex)');
  }
  return Uint8Array.from(Buffer.from(keyEnv, 'hex'));
}

export function encryptXpub(xpub: string): string {
  try {
    const key = getEncryptionKey();
    const nonce = crypto.randomBytes(24);
    const cipher = xchacha20poly1305(key, nonce);
    const plaintext = utf8ToBytes(xpub);
    const ciphertext = cipher.encrypt(plaintext);
    const encrypted = new Uint8Array(nonce.length + ciphertext.length);
    encrypted.set(nonce, 0);
    encrypted.set(ciphertext, nonce.length);
    return Buffer.from(encrypted).toString('base64');
  } catch (error) {
    throw new Error(
      `Failed to encrypt xpub: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

export function decryptXpub(encrypted: string): string {
  try {
    const key = getEncryptionKey();
    const encryptedBytes = Uint8Array.from(Buffer.from(encrypted, 'base64'));
    const nonce = encryptedBytes.slice(0, 24);
    const ciphertext = encryptedBytes.slice(24);
    const cipher = xchacha20poly1305(key, nonce);
    const plaintext = cipher.decrypt(ciphertext);
    return bytesToUtf8(plaintext);
  } catch (error) {
    throw new Error(
      `Failed to decrypt xpub: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}
