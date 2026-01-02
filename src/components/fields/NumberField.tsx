import { Input } from '../ui/Input'
import { Tooltip } from '../ui/Tooltip'

interface NumberFieldProps {
  label: string
  description: string
  required?: boolean
  value: number | undefined
  onChange: (value: number | undefined) => void
  error?: string
  placeholder?: string
  min?: number
  max?: number
  step?: number
}

export function NumberField({
  label,
  description,
  required,
  value,
  onChange,
  error,
  placeholder,
  min,
  max,
  step
}: NumberFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val === '') {
      onChange(undefined)
    } else {
      const num = parseFloat(val)
      if (!isNaN(num)) {
        onChange(num)
      }
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
      <Input
        type="number"
        value={value ?? ''}
        onChange={handleChange}
        placeholder={placeholder}
        error={error}
        min={min}
        max={max}
        step={step}
      />
    </div>
  )
}
