import type React from "react"
import { useState } from "react"
import { validateHexInput, validateMaxRepetition } from "../utils/validation"

interface InputFormProps {
  startRange: string
  endRange: string
  maxRepetition: number
  setStartRange: (value: string) => void
  setEndRange: (value: string) => void
  setMaxRepetition: (value: number) => void
  onAnalyze: () => void
}

const InputForm: React.FC<InputFormProps> = ({
  startRange,
  endRange,
  maxRepetition,
  setStartRange,
  setEndRange,
  setMaxRepetition,
  onAnalyze,
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {}

    if (!validateHexInput(startRange)) {
      newErrors.startRange = "يجب أن يكون النطاق البدائي عدداً سداسياً عشرياً صالحاً من 64 خانة"
    }

    if (!validateHexInput(endRange)) {
      newErrors.endRange = "يجب أن يكون النطاق النهائي عدداً سداسياً عشرياً صالحاً من 64 خانة"
    }

    if (!validateMaxRepetition(maxRepetition)) {
      newErrors.maxRepetition = "يجب أن يكون الحد الأقصى للتكرار عدداً صحيحاً بين 1 و 32"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAnalyze = () => {
    if (validateInputs()) {
      onAnalyze()
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="startRange" className="block text-sm font-medium text-gray-700">
          بداية النطاق
        </label>
        <input
          type="text"
          id="startRange"
          value={startRange}
          onChange={(e) => setStartRange(e.target.value)}
          className={`mt-1 block w-full border ${errors.startRange ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm p-2`}
          placeholder="0x0000000000..."
        />
        {errors.startRange && <p className="mt-1 text-sm text-red-500">{errors.startRange}</p>}
      </div>
      <div>
        <label htmlFor="endRange" className="block text-sm font-medium text-gray-700">
          نهاية النطاق
        </label>
        <input
          type="text"
          id="endRange"
          value={endRange}
          onChange={(e) => setEndRange(e.target.value)}
          className={`mt-1 block w-full border ${errors.endRange ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm p-2`}
          placeholder="0xffffffffffffffff..."
        />
        {errors.endRange && <p className="mt-1 text-sm text-red-500">{errors.endRange}</p>}
      </div>
      <div>
        <label htmlFor="maxRepetition" className="block text-sm font-medium text-gray-700">
          الحد الأقصى للتكرار
        </label>
        <input
          type="number"
          id="maxRepetition"
          value={maxRepetition}
          onChange={(e) => setMaxRepetition(Number.parseInt(e.target.value))}
          className={`mt-1 block w-full border ${errors.maxRepetition ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm p-2`}
          min="1"
          max="32"
        />
        {errors.maxRepetition && <p className="mt-1 text-sm text-red-500">{errors.maxRepetition}</p>}
      </div>
      <button
        onClick={handleAnalyze}
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        تحليل النطاق
      </button>
    </div>
  )
}

export default InputForm

