export function formatHex(bigInt: bigint): string {
  return bigInt.toString(16).padStart(64, '0');
}

export function isValidHex(hex: string): boolean {
  return /^[0-9a-f]+$/i.test(hex);
}

