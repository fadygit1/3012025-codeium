import type React from "react"
import { useEffect, useState } from "react"
import type { Range } from "../types"
import RangeVisualizer from "./RangeVisualizer"

interface ResultsDisplayProps {
  results: {
    valid: Range[]
    invalid: Range[]
  }
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const [validFileContent, setValidFileContent] = useState<string>("")
  const [invalidFileContent, setInvalidFileContent] = useState<string>("")

  useEffect(() => {
    const fetchFileContents = async () => {
      try {
        const validResponse = await fetch("/src/results/valid_ranges.txt")
        const validContent = await validResponse.text()
        setValidFileContent(validContent)

        const invalidResponse = await fetch("/src/results/invalid_ranges.txt")
        const invalidContent = await invalidResponse.text()
        setInvalidFileContent(invalidContent)
      } catch (error) {
        console.error("Error fetching file contents:", error)
      }
    }

    fetchFileContents()
  }, [results])

  const exportResults = () => {
    const content = `النطاقات الصالحة:\n${validFileContent}\n\nالنطاقات غير الصالحة:\n${invalidFileContent}`
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "hex_range_analysis_results.txt"
    link.click()
    URL.revokeObjectURL(url)
  }

  const renderRanges = (content: string) => {
    const sections = content.split("#")
    return sections.map((section, index) => {
      if (section.trim()) {
        const [title, ...ranges] = section.trim().split("\n")
        return (
          <div key={index} className="mb-4">
            <h4 className="text-md font-medium mb-2">{title}</h4>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">{ranges.join("\n")}</pre>
          </div>
        )
      }
      return null
    })
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">نتائج التحليل</h2>
      <RangeVisualizer valid={results.valid} invalid={results.invalid} />
      <div className="space-y-4 mt-4">
        <div>
          <h3 className="text-lg font-medium text-green-600">النطاقات الصالحة</h3>
          {renderRanges(validFileContent)}
        </div>
        <div>
          <h3 className="text-lg font-medium text-red-600">النطاقات غير الصالحة</h3>
          {renderRanges(invalidFileContent)}
        </div>
      </div>
      <button
        onClick={exportResults}
        className="mt-4 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors"
      >
        تصدير النتائج
      </button>
    </div>
  )
}

export default ResultsDisplay

