import type React from "react"
import type { Range } from "../types"

interface RangeVisualizerProps {
  valid: Range[]
  invalid: Range[]
}

const RangeVisualizer: React.FC<RangeVisualizerProps> = ({ valid, invalid }) => {
  const allRanges = [...valid, ...invalid].sort((a, b) => BigInt(a.start) - BigInt(b.start))
  const totalRange = BigInt(allRanges[allRanges.length - 1].end) - BigInt(allRanges[0].start)

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-2">تمثيل بصري للنطاقات</h3>
      <div className="h-20 bg-gray-200 rounded-md overflow-hidden flex">
        {allRanges.map((range, index) => {
          const start = BigInt(range.start) - BigInt(allRanges[0].start)
          const width = BigInt(range.end) - BigInt(range.start)
          const isValid = valid.some((v) => v.start === range.start && v.end === range.end)

          return (
            <div
              key={index}
              style={{
                width: `${Number((width * 100n) / totalRange)}%`,
                marginLeft: `${Number((start * 100n) / totalRange)}%`,
              }}
              className={`h-full ${isValid ? "bg-green-500" : "bg-red-500"}`}
              title={`${range.start} - ${range.end}`}
            />
          )
        })}
      </div>
      <div className="mt-2 flex justify-between text-sm">
        <span>{allRanges[0].start}</span>
        <span>{allRanges[allRanges.length - 1].end}</span>
      </div>
    </div>
  )
}

export default RangeVisualizer

