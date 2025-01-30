import React, { useState } from "react"
import InputForm from "./components/InputForm"
import ResultsDisplay from "./components/ResultsDisplay"
import type { Range } from "./types"

function App() {
  const [startRange, setStartRange] = useState("")
  const [endRange, setEndRange] = useState("")
  const [maxRepetition, setMaxRepetition] = useState(4)
  const [results, setResults] = useState<{ valid: Range[]; invalid: Range[] } | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalysis = () => {
    setIsAnalyzing(true)
    const worker = new Worker(new URL("./utils/hexAnalyzerWorker.ts", import.meta.url))

    worker.onmessage = (event) => {
      setResults(event.data)
      setIsAnalyzing(false)
      worker.terminate()
    }

    worker.postMessage({ start: startRange, end: endRange, maxRepetition })
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12" dir="rtl">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-2xl font-semibold mb-5 text-center">محلل النطاقات السداسية عشرية</h1>
          <InputForm
            startRange={startRange}
            endRange={endRange}
            maxRepetition={maxRepetition}
            setStartRange={setStartRange}
            setEndRange={setEndRange}
            setMaxRepetition={setMaxRepetition}
            onAnalyze={handleAnalysis}
          />
          {isAnalyzing && <p className="mt-4 text-center">جاري التحليل...</p>}
          {results && <ResultsDisplay results={results} />}
        </div>
      </div>
    </div>
  )
}

export default App

