import { analyzeHexRange } from "./utils/hexAnalyzer"
import fs from "fs"
import path from "path"

const start = "0x0000000000100000000000000000000000000000000100000a23455555abbbbb"
const end = "0x0000000000100000000000000000000000000000000100000f00000000010000"
const maxRepetition = 4

// Ensure the results directory exists
const resultsDir = path.join(process.cwd(), "results")
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir)
}

// Clear existing files
fs.writeFileSync(path.join(resultsDir, "valid_ranges.txt"), "")
fs.writeFileSync(path.join(resultsDir, "invalid_ranges.txt"), "")

console.log("Starting Hex Range Analyzer")
console.log(`Analyzing range from ${start} to ${end}`)
console.log(`Max repetition: ${maxRepetition}`)
console.time("Analysis")

const result = analyzeHexRange(start, end, maxRepetition)

console.timeEnd("Analysis")
console.log(
  `Analysis completed. Found ${result.valid.length} valid ranges and ${result.invalid.length} invalid ranges.`,
)
console.log("Results have been written to the 'results' folder.")

// Display first 10 ranges of each type
console.log("\nFirst 10 valid ranges:")
result.valid.slice(0, 10).forEach((range, index) => {
  console.log(`${index + 1}. ${range.start} - ${range.end}`)
})

console.log("\nFirst 10 invalid ranges:")
result.invalid.slice(0, 10).forEach((range, index) => {
  console.log(`${index + 1}. ${range.start} - ${range.end}`)
})

