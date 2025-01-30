import { Range, Results } from '../types';
import { formatHex, isValidHex } from './formatter';
import { findRepeatingPattern } from './patternFinder';

export function findSubRanges(
  start: bigint,
  end: bigint,
  maxResults: number,
  progressCallback: (progress: number) => void
): Results {
  const results: Range[] = [];
  let current = start;
  const startTime = Date.now();
  let processedCount = 0n;
  const totalRange = end - start;
  
  while (current <= end && results.length < maxResults) {
    const hex = formatHex(current);
    const pattern = findRepeatingPattern(hex);
    
    processedCount += 1n;
    if (processedCount % 1000000n === 0n) {
      const progress = Number((processedCount * 100n) / totalRange);
      progressCallback(progress);
    }
    
    if (pattern) {
      const { position } = pattern;
      const prefix = hex.slice(0, position);
      const suffix = 'f'.repeat(hex.length - (position + pattern.pattern.length));
      const endHex = prefix + pattern.pattern + suffix;
      
      if (isValidHex(endHex)) {
        const endValue = BigInt(`0x${endHex}`);
        if (endValue > current && endValue <= end) {
          results.push({
            start: current,
            end: endValue,
            pattern: pattern.pattern
          });
          current = endValue + 1n;
          continue;
        }
      }
    }
    
    current = calculateNextStart(hex);
  }
  
  return {
    ranges: results,
    timeElapsed: (Date.now() - startTime) / 1000
  };
}

function calculateNextStart(hex: string): bigint {
  const nextHex = (BigInt(`0x${hex}`) + 1n).toString(16).padStart(64, '0');
  return BigInt(`0x${nextHex}`);
}

