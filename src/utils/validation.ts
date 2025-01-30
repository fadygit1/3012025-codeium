export function validateHexInput(input: string): boolean {
  const hexRegex = /^0x[0-9A-Fa-f]{64}$/
  return hexRegex.test(input)
}

export function validateMaxRepetition(input: number): boolean {
  return Number.isInteger(input) && input > 0 && input <= 32
}

