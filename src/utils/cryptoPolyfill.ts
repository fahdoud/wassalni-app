
// This file polyfills crypto.randomUUID for older browsers and platforms
// that don't support it natively

interface ExtendedCrypto extends Omit<Crypto, 'randomUUID'> {
  randomUUID?: () => string;
}

declare global {
  interface Window {
    crypto: ExtendedCrypto;
  }
}

export function ensureCryptoPolyfill(): void {
  if (typeof crypto !== 'undefined' && !crypto.randomUUID) {
    // Add randomUUID to crypto object if it doesn't exist
    (crypto as ExtendedCrypto).randomUUID = function randomUUID(): string {
      // Create a UUID v4 implementation
      return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: string) => {
        const num = Number(c);
        return (
          num ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (num / 4)))
        ).toString(16);
      });
    };
  }
}
