export function findRepeatingPattern(hex: string): { pattern: string; position: number } | null {
  for (let i = 0; i < hex.length; i++) {
    for (let len = 1; len <= (hex.length - i) / 2; len++) {
      const pattern = hex.slice(i, i + len);
      const nextSection = hex.slice(i + len, i + len + pattern.length);
      
      if (pattern === nextSection) {
        return {
          pattern,
          position: i
        };
      }
    }
  }
  return null;
}

