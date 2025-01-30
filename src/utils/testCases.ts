import { analyzeHexRange } from "./hexAnalyzer"
import fs from "fs"
import path from "path"

const testCases = [
  {
    name: "Extended Range Test",
    start: "0x0000000000100000000000000000000000000000000100000a23455556000000",
    end: "0x0000000000100000000000000000000000000000000100000a2345555fffffff",
    maxRepetition: 4,
  },
]

export function runTests() {
  testCases.forEach((testCase) => {
    console.log(`Running test: ${testCase.name}`)
    const result = analyzeHexRange(testCase.start, testCase.end, testCase.maxRepetition)

    console.log("First 150 Valid ranges:")
    console.log(readFileContent("valid_ranges.txt"))

    console.log("\nFirst 150 Invalid ranges:")
    console.log(readFileContent("invalid_ranges.txt"))

    console.log("\nTotal valid ranges:", result.valid.length)
    console.log("Total invalid ranges:", result.invalid.length)
    console.log("\n")
  })
}

function readFileContent(filename: string): string {
  const filePath = path.join(process.cwd(), "src", "results", filename)
  return fs.readFileSync(filePath, "utf-8")
}

