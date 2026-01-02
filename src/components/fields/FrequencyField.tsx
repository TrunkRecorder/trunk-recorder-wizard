import { useState, useEffect } from 'react'
import { Input } from '../ui/Input'
import { Tooltip } from '../ui/Tooltip'

interface FrequencyFieldProps {
  label: string
  description: string
  required?: boolean
  value: number | undefined
  onChange: (value: number) => void
  error?: string
}

export function FrequencyField({
  label,
  description,
  required,
  value,
  onChange,
  error
}: FrequencyFieldProps) {
  const [displayMode, setDisplayMode] = useState<'hz' | 'mhz'>('mhz')
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if (value !== undefined && value !== null) {
      if (displayMode === 'mhz') {
        setInputValue((value / 1000000).toFixed(6).replace(/\.?0+$/, ''))
      } else {
        setInputValue(value.toString())
      }
    } else {
      setInputValue('')
    }
  }, [value, displayMode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setInputValue(raw)

    const num = parseFloat(raw)
    if (!isNaN(num)) {
      const hz = displayMode === 'mhz' ? Math.round(num * 1000000) : num
      onChange(hz)
    }
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <Tooltip content={description}>
          <button type="button" className="text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </Tooltip>
      </div>
      <div className="flex gap-2">
        <Input
          type="text"
          inputMode="decimal"
          value={inputValue}
          onChange={handleChange}
          placeholder={displayMode === 'mhz' ? '856.7875' : '856787500'}
          error={error}
          className="flex-1"
        />
        <select
          value={displayMode}
          onChange={(e) => setDisplayMode(e.target.value as 'hz' | 'mhz')}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
        >
          <option value="mhz">MHz</option>
          <option value="hz">Hz</option>
        </select>
      </div>
      {value !== undefined && (
        <p className="text-xs text-gray-500">
          {value.toLocaleString()} Hz
        </p>
      )}
    </div>
  )
}
