import { analyzeHexRange } from "./hexAnalyzer"
import fs from "fs"
import path from "path"

export function generateExtendedValidRanges() {
  const start = "0x0000000000100000000000000000000000000000000100000a23455556000000"
  const end = "0x0000000000100000000000000000000000000000000100000a2345555fffffff"
  const maxRepetition = 4

  // Clear existing files
  const validFilePath = path.join(process.cwd(), "src", "results", "valid_ranges.txt")
  const invalidFilePath = path.join(process.cwd(), "src", "results", "invalid_ranges.txt")
  fs.writeFileSync(validFilePath, "")
  fs.writeFileSync(invalidFilePath, "")

  console.log("Starting analysis...")
  const result = analyzeHexRange(start, end, maxRepetition)

  console.log(`Generated ${result.valid.length} valid ranges and ${result.invalid.length} invalid ranges.`)
  console.log("Results have been written to valid_ranges.txt and invalid_ranges.txt")
}

