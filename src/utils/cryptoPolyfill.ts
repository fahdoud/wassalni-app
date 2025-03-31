
// This file polyfills crypto.randomUUID for older browsers and platforms
// that don't support it natively

export function ensureCryptoPolyfill() {
  if (typeof crypto !== 'undefined' && !crypto.randomUUID) {
    // Add randomUUID to crypto object if it doesn't exist
    crypto.randomUUID = function randomUUID(): `${string}-${string}-${string}-${string}-${string}` {
      // Create a UUID v4 implementation
      return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: any) => {
        const num = Number(c);
        return (
          num ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (num / 4)))
        ).toString(16);
      }) as `${string}-${string}-${string}-${string}-${string}`;
    };
  }
}
