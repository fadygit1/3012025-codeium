import { analyzeHexRange } from "./hexAnalyzer"

self.addEventListener("message", (event) => {
  const { start, end, maxRepetition } = event.data
  const results = analyzeHexRange(start, end, maxRepetition)
  self.postMessage(results)
})

