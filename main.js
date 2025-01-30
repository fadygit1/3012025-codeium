const fs = require("fs")
const path = require("path")

function formatHex(bigInt) {
  return bigInt.toString(16).padStart(64, "0")
}

function findPrefix(start, end) {
  let prefix = ""
  // Skip "0x" prefix when comparing
  for (let i = 2; i < start.length; i++) {
    if (start[i] === end[i]) {
      prefix += start[i]
    } else {
      break
    }
  }
  return prefix
}

function hasRepeatingSequence(hex, startPos, maxRepetition) {
  const checkLength = maxRepetition + 1
  const segment = hex.slice(startPos, startPos + checkLength)
  return new Set(segment).size === 1
}

function findNextInvalidStart(hex, prefixLength, maxRepetition) {
  for (let i = prefixLength; i <= hex.length - (maxRepetition + 1); i++) {
    if (hasRepeatingSequence(hex, i, maxRepetition)) {
      return i
    }
  }
  return -1
}

function incrementHexAtPosition(hex, position) {
  let result = hex.slice(0, position)
  let carry = 1

  for (let i = position; i < hex.length; i++) {
    const digit = Number.parseInt(hex[i], 16)
    const sum = digit + carry
    carry = Math.floor(sum / 16)
    result += (sum % 16).toString(16)
  }

  return result
}

function analyzeHexRange(start, end, maxRepetition) {
  const startBigInt = BigInt(start)
  const endBigInt = BigInt(end)

  let current = startBigInt
  const validRanges = []
  const invalidRanges = []

  const prefix = findPrefix(start.slice(2), end.slice(2)) // Skip "0x" prefix
  const prefixLength = prefix.length + 2 // Add 2 to account for "0x" prefix

  function writeRangesToFile(range, filename) {
    const content = `${range.start} - ${range.end}\n`
    const filePath = path.join(__dirname, "results", filename)
    fs.appendFileSync(filePath, content)
  }

  while (current <= endBigInt) {
    const currentHex = formatHex(current)
    const invalidPos = findNextInvalidStart(currentHex, prefixLength, maxRepetition)

    if (invalidPos === -1) {
      // No invalid sequence found, entire remaining range is valid
      const validRange = {
        start: "0x" + currentHex,
        end: end,
      }
      validRanges.push(validRange)
      writeRangesToFile(validRange, "valid_ranges.txt")
      break
    }

    // Found an invalid sequence
    const nextValidHex = incrementHexAtPosition(currentHex, invalidPos)
    const nextValid = BigInt("0x" + nextValidHex)

    if (current < nextValid - 1n) {
      // Add valid range before invalid sequence
      const validRange = {
        start: "0x" + currentHex,
        end: "0x" + formatHex(nextValid - 1n),
      }
      validRanges.push(validRange)
      writeRangesToFile(validRange, "valid_ranges.txt")
    }

    // Add invalid range
    const invalidRange = {
      start: "0x" + formatHex(nextValid),
      end: "0x" + formatHex(nextValid),
    }
    invalidRanges.push(invalidRange)
    writeRangesToFile(invalidRange, "invalid_ranges.txt")

    current = nextValid + 1n
  }

  return { valid: validRanges, invalid: invalidRanges }
}

// Ensure the results directory exists
const resultsDir = path.join(__dirname, "results")
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir)
}

// Clear existing files
fs.writeFileSync(path.join(resultsDir, "valid_ranges.txt"), "")
fs.writeFileSync(path.join(resultsDir, "invalid_ranges.txt"), "")

// Run the analysis with the example from the specification
const start = "0x0000000000100000000000000000000000000000000100000a23455555abbbbb"
const end = "0x0000000000100000000000000000000000000000000100000f00000000010000"
const maxRepetition = 4

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

