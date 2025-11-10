function detectPublicKeyFormat(key: string): 'xpub' | 'zpub' | 'ypub' | 'unknown' {
  const trimmed = key.trim();
  if (trimmed.startsWith('xpub')) return 'xpub';
  if (trimmed.startsWith('zpub')) return 'zpub';
  if (trimmed.startsWith('ypub')) return 'ypub';
  return 'unknown';
}

export function convertToXpub(key: string): string {
  const format = detectPublicKeyFormat(key);
  
  if (format === 'xpub') {
    return key.trim();
  }
  
  if (format === 'zpub') {
    try {
      const { fromZPub } = require('bip84');
      const root = fromZPub(key.trim());
      const xpub = root.xpub();
      if (!xpub) {
        throw new Error('Failed to extract xpub from zpub');
      }
      return xpub;
    } catch (error) {
      throw new Error(`Failed to convert ZPUB to XPUB: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  if (format === 'ypub') {
    try {
      const HDKey = require('hdkey');
      const bitcoin = require('bitcoinjs-lib');
      const networks = require('bitcoinjs-lib').networks;
      
      const hdkey = HDKey.fromExtendedKey(key.trim());
      const network = networks.bitcoin;
      const xpub = bitcoin.bip32.fromPublicKey(
        hdkey.publicKey,
        hdkey.chainCode,
        network
      ).toBase58();
      
      return xpub;
    } catch (error) {
      throw new Error(`Failed to convert YPUB to XPUB: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  throw new Error(`Unsupported public key format. Expected xpub, zpub, or ypub.`);
}

