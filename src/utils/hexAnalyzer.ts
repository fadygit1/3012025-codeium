import type { Range } from "../types"
import fs from "fs"
import path from "path"

export function analyzeHexRange(
  start: string,
  end: string,
  maxRepetition: number,
): { valid: Range[]; invalid: Range[] } {
  const startBigInt = BigInt(start)
  const endBigInt = BigInt(end)
  const prefix = findPrefix(start.slice(2), end.slice(2)) // Skip "0x" prefix
  const prefixLength = prefix.length + 2 // Add 2 to account for "0x" prefix

  let current = startBigInt
  const validRanges: Range[] = []
  const invalidRanges: Range[] = []

  while (current <= endBigInt) {
    const currentHex = formatHex(current)
    const { hasRepeating, position } = findFirstRepeatingSequence(currentHex.slice(prefixLength), maxRepetition)

    if (hasRepeating) {
      // Found an invalid sequence - this is the start of an invalid range
      const invalidStart = current

      // Find the end of the invalid range
      let invalidEnd = current
      while (invalidEnd < endBigInt) {
        const nextHex = formatHex(invalidEnd + 1n)
        const nextCheck = findFirstRepeatingSequence(nextHex.slice(prefixLength), maxRepetition)
        if (!nextCheck.hasRepeating) break
        invalidEnd = invalidEnd + 1n
      }

      // Create the invalid range
      const invalidRange: Range = {
        start: "0x" + formatHex(invalidStart),
        end: "0x" + formatHex(invalidEnd),
      }
      invalidRanges.push(invalidRange)
      writeRangesToFile(invalidRange, "invalid_ranges.txt")

      current = invalidEnd + 1n
    } else {
      // This is a valid number - find the end of the valid range
      const validStart = current
      let validEnd = current
      while (validEnd < endBigInt) {
        const nextHex = formatHex(validEnd + 1n)
        const nextCheck = findFirstRepeatingSequence(nextHex.slice(prefixLength), maxRepetition)
        if (nextCheck.hasRepeating) break
        validEnd = validEnd + 1n
      }

      const validRange: Range = {
        start: "0x" + formatHex(validStart),
        end: "0x" + formatHex(validEnd),
      }
      validRanges.push(validRange)
      writeRangesToFile(validRange, "valid_ranges.txt")

      current = validEnd + 1n
    }
  }

  return { valid: validRanges, invalid: invalidRanges }
}

function findPrefix(start: string, end: string): string {
  let prefix = ""
  const length = Math.min(start.length, end.length)

  for (let i = 0; i < length; i++) {
    if (start[i] === end[i]) {
      prefix += start[i]
    } else {
      break
    }
  }
  return prefix
}

function findFirstRepeatingSequence(hex: string, maxRepetition: number): { hasRepeating: boolean; position: number } {
  const checkLength = maxRepetition + 1

  for (let i = 0; i <= hex.length - checkLength; i++) {
    const segment = hex.slice(i, i + checkLength)
    if (new Set(segment).size === 1) {
      return { hasRepeating: true, position: i }
    }
  }

  return { hasRepeating: false, position: -1 }
}

function formatHex(bigInt: bigint): string {
  return bigInt.toString(16).padStart(64, "0")
}

function writeRangesToFile(range: Range, filename: string) {
  const content = `${range.start} - ${range.end}\n`
  const filePath = path.join(process.cwd(), "results", filename)
  fs.appendFileSync(filePath, content)
}

