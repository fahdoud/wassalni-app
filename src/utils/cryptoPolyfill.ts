
// Polyfill for crypto.randomUUID() in older browsers
export function ensureCryptoPolyfill() {
  if (typeof crypto !== 'undefined' && !crypto.randomUUID) {
    crypto.randomUUID = function() {
      // Simple UUID v4 implementation
      return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: string) => {
        const val = parseInt(c, 10);
        return (val ^ window.crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> val / 4).toString(16);
      });
    };
    
    console.log("Added crypto.randomUUID polyfill");
  }
}
